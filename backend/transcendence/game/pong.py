import asyncio
import json
import uuid
import random

import redis.asyncio as redis
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Pong
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
                raise ValueError("Invalid user")
            else:
                print(f"User {self.user.id} is attempting to connect.")

            await self.initialize_game()
        except Exception as e:
            print(f"connection refused: {str(e)}")
            await self.close()
            return

        await self.accept()
        await self.channel_layer.group_add(self.room_id, self.channel_name)
        self.valid = True

        await self.send_message(
            "group",
            "game_join",
            {
                "id": self.user.id,
                "username": self.user.username,
            }
        )
        await self.send_message(
            "client",
            "assign_role",
            {
                "role": "player1" if self.host else "player2",
            }
        )

    async def initialize_game(self):
        self.room_id = f"game_{self.scope['url_route']['kwargs']['room_id']}"
        self.host = await self.redis_conn.get(self.room_id) is None
        players = await self.redis_conn.lrange(f"{self.room_id}_players", 0, -1)

        if self.host:
            await self.redis_conn.set(self.room_id, 1)
            self.board_width = 800
            self.board_height = 400
            self.ball = self.Ball(self.board_width // 2, self.board_height // 2, 5)
            self.player1 = self.Player(20, self.board_height // 2 - 50, 100)
            self.player2 = self.Player(self.board_width - 30, self.board_height // 2 - 50, 100)

            self.scores = {"player1": 0, "player2": 0}
            self.player1_id = self.user.id
            self.player2_id = None
        else:
            if str(self.user.id).encode("utf-8") in players:
                raise ConnectionRefusedError("User already connected to the room")

            if len(players) == 1:
                self.player1_id = players[0].decode()
                self.player2_id = self.user.id
            if len(players) >= 2:
                raise ConnectionRefusedError("Room is full")

        await self.redis_conn.rpush(f"{self.room_id}_players", self.user.id)

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
        self.connected = False

        players = await self.redis_conn.lrange(f"{self.room_id}_players", 0, -1)
        if self.user.id.encode() in players:
            await self.redis_conn.lrem(f"{self.room_id}_players", 0, self.user.id)

        remainders = await self.redis_conn.lrange(f"{self.room_id}_players", 0, -1)

        if not hasattr(self, "winner"):
            player1_id = getattr(self, "player1_id", None)
            player2_id = getattr(self, "player2_id", None)

            if player2_id is None and self.user.id == player1_id:
                print("Host left before second player joined. Cleaning up.")
            else:
                self.forfeit(self.user.id)

        if len(remainders) == 1:
            if not hasattr(self, "winner"):
                remainder_id = remainders[0].decode()
                if remainder_id == str(self.player1_id):
                    self.winner = "player1"
                else:
                    self.winner = "player2"

            await self.save_game(self.winner)

        if getattr(self, "host", False) is True:
            if hasattr(self, "game_task"):
                self.game_task.cancel()
            await self.redis_conn.delete(self.room_id)
            await self.redis_conn.delete(f"{self.room_id}_players")

            if not hasattr(self, "winner"):
                self.forfeit(self.user.id)

            if hasattr(self, "winner"):
                await self.save_game(self.winner)

        if hasattr(self, "valid"):
            await self.send_message(
                "group",
                "game_stop",
                {
                    "user": self.user.id,
                }
            )
            await self.channel_layer.group_discard(self.room_id, self.channel_name)

        await self.redis_conn.close()

    async def receive(self, text_data):
        data = json.loads(text_data)

        try:
            msg_type = data.get("type")
            if not msg_type:
                raise AttributeError("Missing type")

            if msg_type == "game_stop":
                await self.close()
                return
            elif msg_type == "game_ready":
                await self.send_message("group", args=data)
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
            if not hasattr(self, "player_ready"):
                self.player_ready = 0
            self.player_ready += 1
            if self.player_ready == 2:
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
                self.forfeit(self.user.id)
        await self.send_message("client", args=event)
        await self.close()

    def forfeit(self, user_id):
        if not user_id:
            return

        player1_id = getattr(self, "player1_id", None)
        player2_id = getattr(self, "player2_id", None)

        if not player1_id or not player2_id:
            print("not enough players")
            return

        if str(user_id) == str(player1_id):
            self.scores["player1"] = 0
            self.scores["player2"] = self.win_goal
        else:
            self.scores["player1"] = self.win_goal
            self.scores["player2"] = 0
        self.winner = self.get_winner()

    async def loop(self):
        self.reset_game()
        while True:
            try:
                self.ball.update(self.board_height, self.player1, self.player2)
                if self.ball.x <= 0:
                    self.scores["player2"] += 1
                elif self.ball.x >= self.board_width - self.ball.width:
                    self.scores["player1"] += 1

                if self.scores["player1"] >= self.win_goal or self.scores["player2"] >= self.win_goal:
                    winner = "player1" if self.scores["player1"] >= self.win_goal else "player2"
                    await self.send_message("group", "game_stop", {"winner": winner})
                    break

                await self.send_game_state()
                await asyncio.sleep(self.frame_rate)
            except Exception as e:
                print(e)
                break

    def get_winner(self):
        return "player1" if self.scores["player1"] >= self.win_goal else "player2"

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
                "scores": self.scores,
            }
        )

    async def save_game(self, winner):
        # pong = apps.get_model("pong")
        try:
            if winner == "player1":
                winner_user = User.objects.get(id=self.player1_id)
            else:
                winner_user = User.objects.get(id=self.player2_id)

            pong = Pong.objects.create(
                id=str(uuid.uuid4()),
                host=User.objects.get(id=int(self.player1_id)),
                guest=User.objects.get(id=int(self.player2_id)),
                host_score=self.scores["player1"],
                guest_score=self.scores["player2"],
                winner=winner_user.username,
                status="COMPLETED",
            )
            print("Game saved", pong.id)
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
            self.x = 400
            self.y = 200
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
            self.y += self.velocity_y

        def reset(self):
            self.y = 150
            self.velocity_y = 0
