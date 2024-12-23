from channels.generic.websocket import AsyncWebsocketConsumer
import json
from asgiref.sync import sync_to_async


class LoginStatusConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """
        Called when a WebSocket connection is opened.
        """
        user = self.scope["user"]

        if user.is_authenticated:
            await self.channel_layer.group_add("online", f"user.{user.id}")

            await self.accept()
            await self.send(json.dumps({"message": "WebSocket connected"}))
        else:
            await self.close()

    async def disconnect(self, close_code):
        """
        Called when a WebSocket connection is closed.
        """
        user = self.scope["user"]
        if user.is_authenticated:
            await self.send(json.dumps({"message": "WebSocket disconnected"}))
            await self.channel_layer.group_discard("online", f"user.{user.id}")
            await self.close()

    async def receive(self, text_data):
        """
        Called when a WebSocket message is received.
        """
        user = self.scope["user"]
        if user.is_authenticated:
            data = json.loads(text_data)
            await self.send(json.dumps({"message": "Message received", "data": data}))