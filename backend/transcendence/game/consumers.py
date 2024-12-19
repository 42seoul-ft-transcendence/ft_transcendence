import asyncio
import os
import json
import random
import redis.asyncio as redis
from typing import Any, List
from urllib.parse import parse_qs
from asgiref.sync import sync_to_async
from django.contrib.auth import get_user_model
from django.apps import apps
from channels.generic.websocket import AsyncWebsocketConsumer


class Pong(AsyncWebsocketConsumer):
    win_goal = 5

    async def connect(self):
        self.connected = True
        self.redis = redis.Redis(host=os.getenv("REDIS_HOST", "127.0.0.1"), port=6379)

        try:
            self.user = self.scope.get("user")
            if not self.user or self.user.is_anonymous:
                raise ValueError("Invalid user")

            await self.initialize_game()
        except Exception as e:
            await self.close()
            return

        await self.accept()
        await self.channel_layer.group_add(self.room_id, self.channel_name)
        self.valid = True
        await self.send_message(
            "group",
            "game_join",
            {"id": self.user.id, "username": self.user.username},
        )

    async def initialize_game(self):
        query_params = parse_qs(self.scope["query_string"].decode())
        self.room_id = self.check_missing_param(query_params, "room_id")
        self.mode = self.check_missing_param(query_params, "mode")
        self.room_key = f"game:{self.room_id}:players"
        self.white_list_key = f"game:{self.room_id}:white_list"

        if await self.redis.get(self.room_id) is None:
            self.host = True
            await self.redis.set(self.room_id, 1)
        else:
            self.host = False

        players = await self.redis.lrange(self.room_key, 0, -1)
        if len(players) >= 2:
            raise ConnectionRefusedError("Room is full")
        await self.redis.rpush(self.room_key, self.user.id)

    async def disconnect(self, close_code):
        self.connected = False
        if hasattr(self, "host") and self.host:
            await self.redis.delete(self.room_key)
        if hasattr(self, "valid"):
            await self.channel_layer.group_discard(self.room_id, self.channel_name)
        await self.redis.close()

    async def receive(self, text_data):
        data = json.loads(text_data)
        try:
            msg_type = data.get("type")
            if not msg_type:
                raise AttributeError("Missing 'type'")
            if "content" not in data:
                raise AttributeError("Missing 'content'")

            if msg_type == "game_move":
                await self.send_message("group", args=data)
            else:
                await self.send_error("Unsupported message type")

        except Exception as e:
            await self.send_error("Invalid message")

    def check_missing_param(self, query_params, param_name):
        param = query_params.get(param_name, [None])[0]
        if param is None:
            raise AttributeError(f"Missing query parameter: {param_name}")
        return param


    class Info:
        def __init__(
            self,
            creator: str,
            room_id: str,
            player_needed: int,
        ):
            self.creator = creator
            self.room_id = room_id
            self.players_ids = []
            self.players_usernames = []
            self.player_needed = player_needed
            self.player_ready = 0
            self.score = [0, 0]

    class Ball:
        def __init__(self, radius=0.015, color="white", power_on=False):
            self.color = color
            self.limit = 250 if power_on else 50
            self.reset(radius=radius)

        def reset(self, radius=0.015):
            self.x = 0.5
            self.y = random.uniform(0.2, 0.8)
            self.radius = radius
            self.velocity = self.randomize_velocity()
            self.step = 0.05
            self.combo = 0

        def randomize_velocity(self) -> List[float]:
            speed = 0.01
            velocity = [speed, speed]
            if random.randint(0, 1):
                velocity[0] *= -1
            if random.randint(0, 1):
                velocity[1] *= -1
            return velocity

        def revert_velocity(self, index):
            self.velocity[index] = -self.velocity[index]
            self.combo += 1

            if self.combo < self.limit:
                self.velocity[index] *= 1.05

        def move(self):
            self.x += self.velocity[0]
            self.y += self.velocity[1]

    class Pad:
        def __init__(self, left, width=0.02, height=0.2, color="white"):
            self.left = left
            self.color = color
            self.reset(width=width, height=height)

        def reset(self, width=0.02, height=0.2):
            self.width = width
            self.height = height
            self.x = 0 if self.left else 1 - self.width
            self.y = 0.4
            self.step = 0.05
            self.move = 0
            self.combo = 0