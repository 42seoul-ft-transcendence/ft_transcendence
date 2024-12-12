from channels.generic.websocket import AsyncWebsocketConsumer
import json
from asgiref.sync import sync_to_async
from .models import Game

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['game_id']
        self.room_group_name = f"game_{self.room_name}"

        # WebSocket 그룹에 추가
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # WebSocket 그룹에서 제거
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get("action")

        if action == "update_score":
            await self.update_score(data)

        # 그룹에 메시지 전송
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "game_update",
                "message": data
            }
        )

    async def game_update(self, event):
        message = event["message"]

        # 클라이언트로 메시지 전송
        await self.send(text_data=json.dumps(message))

    @sync_to_async
    def update_score(self, data):
        game = Game.objects.get(id=data["game_id"])
        if data["player"] == 1:
            game.score1 += 1
        elif data["player"] == 2:
            game.score2 += 1
        game.save()
