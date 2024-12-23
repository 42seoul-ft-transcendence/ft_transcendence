from channels.generic.websocket import AsyncWebsocketConsumer
import json
from asgiref.sync import sync_to_async
from .utils import set_user_login, set_user_logout
from channels.layers import get_channel_layer


class LoginStatusConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """
        Called when a WebSocket connection is opened.
        """
        user = self.scope["user"]
        if user.is_authenticated:
            self.user_group = f"user_{user.id}"
            await self.channel_layer.group_add(self.user_group, self.channel_name)

            await sync_to_async(set_user_login)(user.username)
            await self.accept()
            await self.send(json.dumps({"message": "Connected and added to online group"}))
        else:
            await self.close()

    async def disconnect(self, close_code):
        """
        Called when a WebSocket connection is closed.
        """
        user = self.scope["user"]
        if user.is_authenticated:
            await sync_to_async(set_user_logout)(user.username)
            await self.channel_layer.group_discard(self.user_group, self.channel_name)
            await self.close()

    async def receive(self, text_data):
        """
        Called when a WebSocket message is received.
        """
        user = self.scope["user"]
        if user.is_authenticated:
            data = json.loads(text_data)
            await self.send(json.dumps({"message": "Message received", "data": data}))