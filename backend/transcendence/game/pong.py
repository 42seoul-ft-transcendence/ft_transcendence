import asyncio
import json
import uuid
import random

from asgiref.sync import sync_to_async
import redis.asyncio as redis
from django.apps import apps
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model

User = get_user_model()

class PongGameConsumer(AsyncWebsocketConsumer):
    win_goal = 3
    redis_conn = redis.Redis(host='redis')
    frame_rate = 1 / 30

    async def connect(self):
        self.connected = True
        try:
            self.user = self.scope.get('user')
            if not self.user and self.user.is_anonymous:
                print("error1")
                raise ValueError("Invalid user")
            else:
                print(f"User {self.user.id} is attempting to connect.")

            self.has_game_started = False
            await self.initialize_game()
        except Exception as e:
            print(f"connection refused: {str(e)}")
            await self.close()
            return

        print("error2")
        await self.accept()
        print("error3")
        await self.channel_layer.group_add(self.room_id, self.channel_name)
        print("error4")
        self.valid = True

        await self.send_message(
            "group",
            "game_join",
            {
                "id": self.user.id,
                "username": self.user.username,
            }
        )
        print("error5")
        await self.send_message(
            "client",
            "assign_role",
            {
                "role": "player1" if self.host else "player2",
            }
        )
        print("error6")

    async def initialize_game(self):
        print("init1")
        self.room_id = f"game_{self.scope['url_route']['kwargs']['room_id']}"
        self.host = await self.redis_conn.get(self.room_id) is None
        print("init2")
        players = await self.redis_conn.lrange(f"{self.room_id}_players", 0, -1)
        print("init3")

        if self.host:
            await self.redis_conn.set(self.room_id, 1)
            self.info = self.Info(creator=self.user.id, room_id=self.room_id)
            self.board_width = 700
            self.board_height = 500
            self.ball = self.Ball(self.board_width // 2, self.board_height // 2, 5)
            self.player1 = self.Player(20, self.board_height // 2, 100)
            self.player2 = self.Player(self.board_width - 20, self.board_height // 2, 100)
            print("init4")

        else:
            print("init5")
            if str(self.user.id).encode("utf-8") in players:
                print("init6")
                raise ConnectionRefusedError("User already connected to the room")
            if len(players) >= 2:
                print("init7")
                raise ConnectionRefusedError("Room is full")

        print("init8")
        await self.redis_conn.rpush(f"{self.room_id}_players", self.user.id)
        print("init9")

    async def send_message(self, destination="client", msg_type="", args=None):
        message = {"type": msg_type, "content": args} if msg_type else args
        try:
            if destination == "group":
                await self.channel_layer.group_send(self.room_id, message)
            elif destination == "client":
                await self.send(text_data=json.dumps(message))
        except Exception as e:
            print(e)

    async def disconnect(self, close_code):
        print("%%%%%%%%%%%%%%%%DISCONNECT CALL%%%%%%%%%%%%%%%%%%%%%%%%%")
        self.connected = False

        if hasattr(self, "host") and self.host:
            players = await self.redis_conn.lrange(f"{self.room_id}_players", 0, -1)

            if hasattr(self, "game_task"):
                self.game_task.cancel()

            await self.redis_conn.delete(self.room_id)
            await self.redis_conn.delete(f"{self.room_id}_players")
            print(f"Room {self.room_id} has been closed by the host.")

            if len(players) == 2:
                if not hasattr(self, "winner"):
                    self.forfeit(self.info.creator)
                await self.save_game(self.winner)

        if hasattr(self, "valid"):
            await self.send_message(
                "group", "game_stop", {"user": self.user.id}
            )
            await self.channel_layer.group_discard(
                self.room_id, self.channel_name
            )

        await self.redis_conn.close()
        print(f"User {self.scope['user'].id} has disconnected.")

    async def receive(self, text_data):
        data = json.loads(text_data)

        try:
            msg_type = data.get("type")
            if not msg_type:
                raise AttributeError("Missing type")

            if msg_type == "game_stop":
                await self.close()
                return
            elif msg_type == "game_move":
                await self.send_message("group", args=data)
                return
            else:
                raise ValueError(f"Invalid msg_type: {msg_type}")
        except Exception as e:
            print(e)


    async def game_join(self, event):
        if self.host:
            self.info.players_ids.append(event["content"]["id"])
            self.info.players_usernames.append(event["content"]["username"])
            self.info.player_ready += 1

            if len(self.info.players_ids) == 2:
                await self.redis_conn.set(self.room_id, 1)

            if self.info.player_ready == 2:
                await self.send_message("group", "game_start")


    async def game_start(self, event):
        await self.send_message("client", args=event)
        if self.host:
            self.game_task = asyncio.create_task(self.loop())

    async def game_state(self, event):
        await self.send_message("client", args=event)

    async def game_move(self, event):
        if self.host:
            try:
                if event["content"].get("player") is None:
                    raise AttributeError("Missing player")
                if event["content"].get("direction") is None:
                    raise AttributeError("Missing direction")
                await self.move_pad(event["content"]["player"], event["content"]["direction"])
            except AssertionError as e:
                print("Invalid game_move received")

    async def game_stop(self, event):
        if not self.connected:
            return
        if self.host:
            self.winner = event["content"].get("winner")
            if not self.winner:
                self.forfeit(event["content"]["user"])
        await self.send_message("client", args=event)
        await self.close()

    def forfeit(self, target):
        if not target:
            return
        if target is self.info.players_ids[0]:
            self.info.score[1] = self.win_goal
        else:
            self.info.score[0] = self.win_goal
        self.winner = self.get_winner()

    async def loop(self):
        self.reset_game()
        while True:
            try:
                self.ball.update(self.board_height, self.player1, self.player2)
                self.player1.move()
                self.player2.move()
                if self.ball.x < 0:
                    self.info.score[0] += 1
                    self.reset_game()
                    await asyncio.sleep(0.1)
                elif self.ball.x > self.board_width - self.ball.width:
                    self.info.score[1] += 1
                    self.reset_game()
                    await asyncio.sleep(0.1)

                if self.info.score[0] >= self.win_goal or self.info.score[1] >= self.win_goal:
                    winner = self.get_winner()
                    await self.send_message("group", "game_stop", {"winner": winner})
                    break

                await self.send_game_state()
                await asyncio.sleep(self.frame_rate)
            except Exception as e:
                print(e)
                break

    def get_winner(self):
        return self.info.players_ids[0] if self.info.score[0] > self.info.score[1] else self.info.players_ids[1]

    async def move_pad(self, player, direction):
        target = self.player1 if player == "player1" else self.player2
        target.velocity_y = direction
        await self.send_game_state()

    def reset_game(self):
        self.ball.reset()
        self.player1.reset()
        self.player2.reset()

    async def send_game_state(self):
        await self.send_message(
            "group",
            "game_state",
            {
                "ball": {"x": self.ball.x, "y": self.ball.y},
                "player1": {"y": self.player1.y},
                "player2": {"y": self.player2.y},
                "scores": self.info.score,
            }
        )

    async def save_game(self, winner):
        pong_model = await sync_to_async(apps.get_model)("game", "Pong")

        winner_user = await sync_to_async(User.objects.get)(id=winner)

        try:
            await sync_to_async(pong_model.objects.create) (
                id=str(uuid.uuid4()),
                host=await sync_to_async(User.objects.get)(id=self.info.players_ids[0]),
                guest=await sync_to_async(User.objects.get)(id=self.info.players_ids[1]),
                host_score=self.info.score[0],
                guest_score=self.info.score[1],
                winner=winner_user.username,
                status="COMPLETED",
            )
            print("Game saved")
        except Exception as e:
            print(e)

    class Ball:
        def __init__(self, x, y, velocity):
            self.x = x
            self.y = y
            self.velocity = velocity
            self.width = 10
            self.height = 10
            self.velocity_x = velocity * (1 if random.random() > 0.5 else -1)
            self.velocity_y = velocity * (1 if random.random() > 0.5 else -1)

        def update(self, board_height, player1, player2):
            self.x += self.velocity_x
            self.y += self.velocity_y

            if self.y <= 0 or self.y + self.height >= board_height:
                self.velocity_y *= -1

            if self.detect_collision(player1):
                self.velocity_x = abs(self.velocity_x)
            elif self.detect_collision(player2):
                self.velocity_x = -abs(self.velocity_x)

        def detect_collision(self, player):
            return (
                    self.x < player.x + player.width
                    and self.x + self.width > player.x
                    and self.y < player.y + player.height
                    and self.y + self.height > player.y
            )

        def reset(self):
            self.x = 350
            self.y = 250
            self.velocity_x = self.velocity * (1 if random.random() > 0.5 else -1)
            self.velocity_y = self.velocity * (1 if random.random() > 0.5 else -1)

    class Player:
        def __init__(self, x, y, height):
            self.x = x
            self.y = y
            self.height = height
            self.width = 10
            self.velocity_y = 0

        def move(self):
            next_pos = self.y + self.velocity_y
            if next_pos < 0 or next_pos > 450:
                return
            self.y += self.velocity_y

        def reset(self):
            self.y = 200
            self.velocity_y = 0


    class Info:
        def __init__(
            self,
            creator: str,
            room_id: str,
        ):
            self.creator = creator
            self.room_id = room_id
            self.players_ids = []
            self.players_usernames = []
            self.player_ready = 0
            self.score = [0, 0]