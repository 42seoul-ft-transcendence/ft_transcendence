import asyncio
import os
import json
import uuid

import redis.asyncio as redis
from urllib.parse import parse_qs
from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.apps import apps

class Pong(AsyncWebsocketConsumer):
    async def connect(self):
        self.redis = redis.Redis(host=os.getenv("REDIS_HOST", "127.0.0.1"), port=6379)
        self.room_id = None
        await self.accept()

    async def disconnect(self, close_code):
        if self.room_id:
            players = await self.redis.lrange(f"game:{self.room_id}:players", 0, -1)
            if self.channel_name.encode("utf-8") in players:
                await self.redis.lrem(f"game:{self.room_id}:players", 0, self.channel_name)
                if len(players) <= 1:  # 몰수패 처리
                    await self.handle_forfeit()

        await self.redis.close()

    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get("action")

        if action == "join_queue":
            await self.join_queue()
        elif action == "leave_queue":
            await self.leave_queue()
        elif action == "game_update":
            await self.update_game(data)
        else:
            await self.send_error("Invalid action")

    async def join_queue(self):
        queue_key = "game_queue"
        await self.redis.rpush(queue_key, self.channel_name)

        # 대기 큐가 2명 이상이면 방 생성
        queue_length = await self.redis.llen(queue_key)
        if queue_length >= 2:
            await self.start_game()

    async def leave_queue(self):
        queue_key = "game_queue"
        await self.redis.lrem(queue_key, 0, self.channel_name)

    async def start_game(self):
        queue_key = "game_queue"
        player1 = await self.redis.lpop(queue_key)
        player2 = await self.redis.lpop(queue_key)

        self.room_id = str(uuid.uuid4())
        await self.redis.set(f"game:{self.room_id}:status", "active")
        await self.redis.rpush(f"game:{self.room_id}:players", player1, player2)

        # 방에 참가한 클라이언트에 알림 전송
        await self.send_to_player(player1, {"action": "start_game", "room_id": self.room_id})
        await self.send_to_player(player2, {"action": "start_game", "room_id": self.room_id})

    async def update_game(self, data):
        # 게임 상태 업데이트 및 클라이언트에 전달
        await self.send_to_group(self.room_id, data)

    async def handle_forfeit(self):
        await self.redis.set(f"game:{self.room_id}:status", "finished")

        # DB에 몰수패 기록
        await self.save_match_to_db(5, 0)

        # 클라이언트에 알림 전송
        await self.send_to_group(self.room_id, {"action": "game_end", "reason": "forfeit"})

    async def save_match_to_db(self, score1, score2):
        Pong = apps.get_model("game", "Pong")
        await sync_to_async(Pong.objects.create)(
            id=self.room_id,
            status="finished",
            score1=score1,
            score2=score2,
        )

    async def send_to_player(self, player, data):
        await self.channel_layer.send(player.decode("utf-8"), {"type": "websocket.send", "text": json.dumps(data)})

    async def send_to_group(self, room_id, data):
        await self.channel_layer.group_send(room_id, {"type": "websocket.send", "text": json.dumps(data)})

    async def send_error(self, message):
        await self.send(text_data=json.dumps({"error": message}))
