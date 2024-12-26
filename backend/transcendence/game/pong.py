import asyncio
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class PongGameConsumer(AsyncWebsocketConsumer):
    win_goal = 5

    async def connect(self):
        self.connected = True
        self.room_id = self.scope["url_route"]["kwargs"].get("room_id")
        if self.room_id:
            await self.channel_layer.group_add(self.room_id, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        if self.room_id:
            await self.channel_layer.group_discard(self.room_id, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        if data.get("type") == "start_game":
            await self.start_game()

    async def start_game(self):
        await self.channel_layer.group_send(self.room_id, {"type": "game.start"})
        asyncio.create_task(self.game_loop())

    async def game_loop(self):
        fps = 0.033
        scores = {"host": 0, "guest": 0}
        ball = self.Ball()
        pad_1 = self.Pad()
        pad_2 = self.Pad()

        while max(scores.values()) < self.win_goal:
            ball.move()
            await self.handle_collisions(ball, pad_1, pad_2, scores)
            await self.channel_layer.group_send(self.room_id, {
                "type": "game.update",
                "scores": scores,
                "ball": ball.__dict__,
                "pad_1": pad_1.__dict__,
                "pad_2": pad_2.__dict__,
            })
            await asyncio.sleep(fps)

    async def handle_collisions(self, ball, pad_1, pad_2, scores):
        if ball.y - ball.radius / 2 <= 0 or ball.y + ball.radius / 2 >= 1:
            ball.revert_velocity(1)
        elif self.check_pad_collision(ball, pad_1, pad_2):
            ball.revert_velocity(0)
        elif ball.x + ball.radius / 2 <= 0:
            scores["guest"] += 1
            ball.reset()
        elif ball.x - ball.radius / 2 >= 1:
            scores["host"] += 1
            ball.reset()

    def check_pad_collision(self, ball, pad_1, pad_2):
        if ball.x - ball.radius <= 0.1 and pad_1.y <= ball.y <= pad_1.y + pad_1.height:
            return True
        if ball.x + ball.radius >= 0.9 and pad_2.y <= ball.y <= pad_2.y + pad_2.height:
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
