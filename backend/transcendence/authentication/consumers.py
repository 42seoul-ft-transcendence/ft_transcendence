from channels.generic.websocket import AsyncWebsocketConsumer
import json
from asgiref.sync import sync_to_async
from channels.layers import get_channel_layer
import redis

redis_client = redis.StrictRedis(host="redis", port=6379, db=0)


class LoginStatusConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """
        Called when a WebSocket connection is opened.
        """
        self.user = self.scope["user"]
        self.user_group_name = f"user_{self.user.id}"

        if self.user.is_authenticated:
            channel_layer = get_channel_layer()
            await channel_layer.group_discard("online", self.channel_name)


            await self.channel_layer.group_add("online", self.channel_name)
            await redis_client.set(f"user:{self.user.id}:status", "online")

            await self.accept()
            await self.send(json.dumps({"message": "WebSocket connected"}))
        else:
            await self.close()

    async def disconnect(self, close_code):
        """
        Called when a WebSocket connection is closed.
        """
        if self.user.is_authenticated:
            await self.send(json.dumps({"message": "WebSocket disconnected"}))
            await redis_client.delete(f"user:{user.id}:status", "online")
            await self.channel_layer.group_discard("online", self.user_group_name)
            await self.close()

    async def receive(self, text_data):
        """
        Called when a WebSocket message is received.
        """
        user = self.scope["user"]
        if user.is_authenticated:
            data = json.loads(text_data)
            await self.send(json.dumps({"message": "Message received", "data": data}))