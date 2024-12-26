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
        print(self.scope)
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.player_id = str(self.scope["user"].id)

        players = await self.redis_conn.lrange(f"{self.room_id}_players", 0, -1)

        if len(players) < 2 and self.player_id not in [p.decode("utf-8") for p in players]:
            await self.redis_conn.rpush(f"{self.room_id}_players", self.player_id)

        if len(players) == 0:
            await self.redis_conn.set(f"{self.room_id}_host", self.player_id)
        elif len(players) == 1:
            await self.redis_conn.set(f"{self.room_id}_guest", self.player_id)

        await self.channel_layer.group_add(self.room_id, self.channel_name)
        await self.accept()

        if len(players) == 1:
            await self.channel_layer.group_send(
                self.room_id,
                {
                    "type": "game.start",
                    "host": await self.redis_conn.get(f"{self.room_id}_host"),
                    "guest": await self.redis_conn.get(f"{self.room_id}_guest"),
                },
            )

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_id, self.channel_name)
        players = await self.redis_conn.lrange(f"{self.room_id}_players", 0, -1)

        if len(players) <= 1:
            await self.redis_conn.delete(f"{self.room_id}_players")
            await self.redis_conn.delete(f"{self.room_id}_host")
            await self.redis_conn.delete(f"{self.room_id}_guest")

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            msg_type = data.get("type")

            if msg_type == "move":
                direction = data.get("direction")
                player_id = data.get("player_id")
                await self.handle_move(player_id, direction)
            elif msg_type == "end_game":
                await self.end_game(data)
            else:
                await self.send(text_data=json.dumps({"error": "Invalid message type"}))
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({"error": "Invalid JSON format"}))


    async def handle_move(self, player_id, direction):
        await self.channel_layer.group_send(
            self.room_id,
            {
                "type": "game.update",
                "player_id": player_id,
                "direction": direction,
            },
        )

    async def game_start(self, event):
        await self.send(text_data=json.dumps({"type": "game.start"}))

    async def game_update(self, event):
        await self.send(
            text_data=json.dumps(
                {
                    "type": "game.update",
                    "player_id": event["player_id"],
                    "direction": event["direction"],
                }
            )
        )

    async def end_game(self, data):
        winner = data.get("winner")
        forfeit = data.get("forfeit")

        await self.channel_layer.group_send(
            self.room_id,
            {
                "type": "game.end",
                "winner": winner,
                "forfeit": forfeit,
            },
        )

        self.save_game_result(data)

        await self.redis_conn.delete(f"{self.room_id}_players")
        await self.redis_conn.delete(f"{self.room_id}_host")
        await self.redis_conn.delete(f"{self.room_id}_guest")

    async def game_end(self, event):
        await self.send(
            text_data=json.dumps(
                {
                    "type": "game.end",
                    "winner": event["winner"],
                }
            )
        )

    def save_game_result(self, data):
        try:
            scores = data.get("scores")
            pong_game = Pong.objects.get(id=self.room_id)
            pong_game.host = data.get("host")
            pong_game.guest = data.get("guest")
            pong_game.host_score = scores["host"]
            pong_game.guest_score = scores["guest"]
            pong_game.winner = data.get("winner")
            pong_game.status = "FORFEIT" if data.get("forfeit") else "COMPLETED"
            pong_game.save()
        except Pong.DoesNotExist:
            print(f"Game with room_id {self.room_id} does not exist")

    # async def game_loop(self):
    #     fps = 0.033
    #     self.scores = {"host": 0, "guest": 0}
    #     self.ball = self.Ball()
    #     self.pad_1 = self.Pad()
    #     self.pad_2 = self.Pad()
    #
    #     while True:
    #         self.ball.move()
    #         await self.handle_collisions()
    #
    #         winner = self.check_winner()
    #         if winner:
    #             await self.end_game(winner)
    #             break
    #
    #         await self.send_game_state()
    #         await asyncio.sleep(fps)
    #
    # def check_winner(self):
    #     for player, score in self.scores.items():
    #         if score >= self.win_goal:
    #             return player
    #     return None
    #
    # def save_game_result(self, winner, forfeit):
    #     try:
    #         pong_game = Pong.objects.get(id=self.room_id)
    #         pong_game.host_score = self.scores["host"]
    #         pong_game.guest_score = self.scores["guest"]
    #         pong_game.status = "FORFEIT" if forfeit else "COMPLETED"
    #         pong_game.end_game(winner)
    #     except Pong.DoesNotExist:
    #         print(f"Game with room_id {self.room_id} does not exist")
    #
    # async def handle_collisions(self):
    #     if self.ball.y - self.ball.radius <= 0 or self.ball.y + self.ball.radius >= 1:
    #         self.ball.revert_velocity(1)
    #
    #     if self.check_pad_collision():
    #         self.ball.revert_velocity(0)
    #
    #     if self.ball.x - self.ball.radius <= 0:
    #         await self.score_point("guest")
    #     elif self.ball.x + self.ball.radius >= 1:
    #         await self.score_point("host")
    #
    # async def score_point(self, player):
    #     self.scores[player] += 1
    #     self.reset_game()
    #
    # def reset_game(self):
    #     self.ball.reset()
    #     self.pad_1.reset()
    #     self.pad_2.reset()
    #
    # def check_pad_collision(self):
    #     if (self.ball.x - self.ball.radius <= 0.1 and
    #             self.pad_1.y <= self.ball.y <= self.pad_1.y + self.pad_1.height):
    #         return True
    #
    #     if (self.ball.x + self.ball.radius >= 0.9 and
    #             self.pad_2.y <= self.ball.y <= self.pad_2.y + self.pad_2.height):
    #         return True
    #
    #     return False
    #
    # class Ball:
    #     def __init__(self, radius=0.015):
    #         self.radius = radius
    #         self.reset()
    #
    #     def reset(self):
    #         self.x = 0.5
    #         self.y = 0.5
    #         self.velocity = [0.01, 0.01]
    #
    #     def move(self):
    #         self.x += self.velocity[0]
    #         self.y += self.velocity[1]
    #
    #     def revert_velocity(self, index):
    #         self.velocity[index] *= -1
    #
    # class Pad:
    #     def __init__(self, y=0.4, height=0.2):
    #         self.y = y
    #         self.height = height
    #
    #     def reset(self):
    #         self.y = 0.4
    #
    #     def move(self, direction):
    #         if direction == "up":
    #             self.y = max(self.y - 0.05, 0)
    #         elif direction == "down":
    #             self.y = min(self.y + 0.05, 1 - self.height)
    {'type': 'websocket', 'path': '/ws/pong/room_1/', 'raw_path': b'/ws/pong/room_1/', 'root_path': '', 'headers': [(b'upgrade', b'websocket'), (b'connection', b'upgrade'), (b'host', b'localhost'), (b'x-real-ip', b'192.168.65.1'), (b'x-forwarded-for', b'192.168.65.1'), (b'x-forwarded-proto', b'https'), (b'pragma', b'no-cache'), (b'cache-control', b'no-cache'), (b'user-agent', b'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'), (b'origin', b'https://localhost:4443'), (b'sec-websocket-version', b'13'), (b'accept-encoding', b'gzip, deflate, br, zstd'), (b'accept-language', b'ko-KR,ko;q=0.9'), (b'cookie', b'access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6InN1bWlucGFyIiwiZXhwIjoxNzM1MjU1ODU1LCJ0eXBlIjoiYWNjZXNzIn0.SMaW5ukQd6FcK61BM3PJulwZzO2vnA4Ze57jq0wGqj8; refresh_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6InN1bWlucGFyIiwiZXhwIjoxNzM1ODE3NDU1LCJ0eXBlIjoicmVmcmVzaCJ9.E2OgJAteQiMZvN6yKTugMoP6X5FeF82w-y3EoP4rRxY; sessionid=u8gsiqoqdhnx6bix7mxz09mndxiy4fpq; csrftoken=UIXZwZQ2XWasbXL09nqlff5EUsL1Ma2b'), (b'sec-websocket-key', b'kEVFGFbfbjfEo6KcgLAmFw=='), (b'sec-websocket-extensions', b'permessage-deflate; client_max_window_bits')], 'query_string': b'', 'client': ['172.29.0.6', 56828], 'server': ['172.29.0.5', 8000], 'subprotocols': [], 'asgi': {'version': '3.0'}, 'cookies': {'access_token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6InN1bWlucGFyIiwiZXhwIjoxNzM1MjU1ODU1LCJ0eXBlIjoiYWNjZXNzIn0.SMaW5ukQd6FcK61BM3PJulwZzO2vnA4Ze57jq0wGqj8', 'refresh_token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6InN1bWlucGFyIiwiZXhwIjoxNzM1ODE3NDU1LCJ0eXBlIjoicmVmcmVzaCJ9.E2OgJAteQiMZvN6yKTugMoP6X5FeF82w-y3EoP4rRxY', 'sessionid': 'u8gsiqoqdhnx6bix7mxz09mndxiy4fpq', 'csrftoken': 'UIXZwZQ2XWasbXL09nqlff5EUsL1Ma2b'}, 'session': <django.utils.functional.LazyObject object at 0xffff9c34e5b0>, 'user': <channels.auth.UserLazyObject object at 0xffff9c34ecd0>, 'path_remaining': '', 'url_route': {'args': (), 'kwargs': {'room_id': 'room_1'}}