import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Pong
from django.contrib.auth.models import User

class PongGameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["match_id"]
        self.room_group_name = f"match_{self.room_name}"

        # WebSocket 연결
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # WebSocket 연결 종료
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

        # 플레이어가 방을 나간 경우 몰수패 처리
        match = await self.get_match(self.room_name)
        if match and match.status == "active":
            await self.forfeit_match(match, self.scope["user"])

    @database_sync_to_async
    def get_match(self, match_id):
        return Pong.objects.filter(id=match_id).first()

    @database_sync_to_async
    def forfeit_match(self, match, user):
        if user == match.user1:
            match.status = "finished"
            match.user2_score = 3
        elif user == match.user2:
            match.status = "finished"
            match.user1_score = 3
        match.save()

    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get("action")

        if action == "move":
            # Broadcast player movements to the opponent
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "player_move",
                    "player": data["player"],
                    "direction": data["direction"],
                }
            )

    async def player_move(self, event):
        # 상대방에게 움직임 전달
        await self.send(text_data=json.dumps({
            "type": "move",
            "player": event["player"],
            "direction": event["direction"],
        }))
