import asyncio
import json
import redis.asyncio as redis
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Pong

class PongGameConsumer(AsyncWebsocketConsumer):
    win_goal = 3
    redis_conn = redis.Redis(host='redis')

    async def connect(self):
        self.connected = True
        self.room_id = self.scope["url_route"]["kwargs"].get("room_id")

        self.pad_1_id = self.redis_conn.get(f"{self.room_id}_host").decode("utf-8")
        self.pad_2_id = self.redis_conn.get(f"{self.room_id}_guest").decode("utf-8")

        if self.room_id:
            await self.channel_layer.group_add(self.room_id, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        if self.room_id:
            if self.connected:
                self.connected = False
                await self.handle_disconnect()
            await self.channel_layer.group_discard(self.room_id, self.channel_name)

    async def handle_disconnect(self):
        disconnected_player = self.get_player_id()
        winner = "host" if disconnected_player == "guest" else "guest"
        await self.end_game(winner, forfeit=True)

    def get_player_id(self):
        if str(self.scope["user"].id) == self.pad_1_id:
            return "host"
        elif str(self.scope["user"].id) == self.pad_2_id:
            return "guest"
        return None

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            msg_type = data.get("type")

            if msg_type == "start_game":
                await self.start_game()
            elif msg_type == "move":
                await self.handle_move(data)
            elif msg_type == "end_game":
                await self.end_game(data)
            else:
                await self.send(text_data=json.dumps({"error": "Invalid message type"}))
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({"error": "Invalid JSON format"}))



    async def start_game(self):
        await self.channel_layer.group_send(self.room_id, {"type": "game.start"})
        asyncio.create_task(self.game_loop())

    async def game_start(self, event):
        await self.send(text_data=json.dumps({"type": "game.start"}))

    async def handle_move(self, data):
        player_id = data.get("player_id")
        direction = data.get("direction")

        if player_id == "host":
            self.pad_1.move(direction)
        elif player_id == "guest":
            self.pad_2.move(direction)

        await self.send_game_state()

    async def send_game_state(self):
        await self.channel_layer.group_send(
            self.room_id,
            {
                "type": "game.update",
                "ball": self.ball.__dict__,
                "pad_1": self.pad_1.__dict__,
                "pad_2": self.pad_2.__dict__,
            }
        )

    async def game_update(self, event):
        await self.send(text_data=json.dumps(event))

    async def game_loop(self):
        fps = 0.033
        self.scores = {"host": 0, "guest": 0}
        self.ball = self.Ball()
        self.pad_1 = self.Pad()
        self.pad_2 = self.Pad()

        while True:
            self.ball.move()
            await self.handle_collisions()

            winner = self.check_winner()
            if winner:
                await self.end_game(winner)
                break

            await self.send_game_state()
            await asyncio.sleep(fps)

    def check_winner(self):
        for player, score in self.scores.items():
            if score >= self.win_goal:
                return player
        return None

    async def end_game(self, winner, forfeit=False):
        self.save_game_result(winner, forfeit)

        await self.channel_layer.group_send(
            self.room_id,
            {
                "type": "game.end",
                "winner": winner,
                "forfeit": forfeit,
                "score": self.scores,
            }
        )

        await self.redis_conn.delete(f"{self.room_id}_players")
        await self.redis_conn.delete(f"{self.room_id}_host")
        await self.redis_conn.delete(f"{self.room_id}_guest")

        await self.channel_layer.group_discard(self.room_id, self.channel_name)

    def save_game_result(self, winner, forfeit):
        try:
            pong_game = Pong.objects.get(id=self.room_id)
            pong_game.host_score = self.scores["host"]
            pong_game.guest_score = self.scores["guest"]
            pong_game.status = "FORFEIT" if forfeit else "COMPLETED"
            pong_game.end_game(winner)
        except Pong.DoesNotExist:
            print(f"Game with room_id {self.room_id} does not exist")

    async def game_end(self, event):
        await self.send(text_data=json.dumps({
            "type": "game.end",
            "winner": event["winner"],
            "scores": event["scores"],
        }))

    async def handle_collisions(self):
        if self.ball.y - self.ball.radius <= 0 or self.ball.y + self.ball.radius >= 1:
            self.ball.revert_velocity(1)

        if self.check_pad_collision():
            self.ball.revert_velocity(0)

        if self.ball.x - self.ball.radius <= 0:
            await self.score_point("guest")
        elif self.ball.x + self.ball.radius >= 1:
            await self.score_point("host")

    async def score_point(self, player):
        self.scores[player] += 1
        self.reset_game()

    def reset_game(self):
        self.ball.reset()
        self.pad_1.reset()
        self.pad_2.reset()

    def check_pad_collision(self):
        if (self.ball.x - self.ball.radius <= 0.1 and
                self.pad_1.y <= self.ball.y <= self.pad_1.y + self.pad_1.height):
            return True

        if (self.ball.x + self.ball.radius >= 0.9 and
                self.pad_2.y <= self.ball.y <= self.pad_2.y + self.pad_2.height):
            return True

        return False

    class Ball:
        def __init__(self, radius=0.015):
            self.radius = radius
            self.reset()

        def reset(self):
            self.x = 0.5
            self.y = 0.5
            self.velocity = [0.01, 0.01]

        def move(self):
            self.x += self.velocity[0]
            self.y += self.velocity[1]

        def revert_velocity(self, index):
            self.velocity[index] *= -1

    class Pad:
        def __init__(self, y=0.4, height=0.2):
            self.y = y
            self.height = height

        def reset(self):
            self.y = 0.4

        def move(self, direction):
            if direction == "up":
                self.y = max(self.y - 0.05, 0)
            elif direction == "down":
                self.y = min(self.y + 0.05, 1 - self.height)