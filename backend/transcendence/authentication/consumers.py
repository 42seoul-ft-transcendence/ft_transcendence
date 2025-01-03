import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "transcendence.settings")
import django
django.setup()
import json
import redis
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from channels.layers import get_channel_layer
from friendship.models import Friendship
from django.db import models
from django.contrib.auth import get_user_model
from django.conf import settings
from .utils import avatar_url

User = get_user_model()

redis_client = redis.asyncio.StrictRedis(host="redis", port=6379, db=0)


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
            # await redis_client.delete(f"user:{self.user.id}:status", "online")
            await redis_client.delete(f"user:{self.user.id}:status")
            await self.channel_layer.group_discard("online", self.channel_name)
            await self.close()

    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get("action")
        print(action)

        if action == "fetch_friend_statuses":
            await self.send_friend_statuses()
        elif action == "get_user":
            await self.get_user()

    async def get_user(self):
        user = self.scope["user"]
        user_id = user.id
        username = user.username

        await self.send(json.dumps({
            "type": "user_id",
            "user_id": user_id,
            "username": username,
            "avatar": avatar_url(user.avatar),
            "status_message": user.status_message
        }))


    async def send_friend_statuses(self):
        """
        Send the list of friends with their online/offline status.
        """
        friendships = await sync_to_async(lambda: list(
            Friendship.objects.filter(
                (models.Q(requester=self.user) | models.Q(receiver=self.user)) &
                models.Q(status="accepted")
            ).select_related('requester', 'receiver')
        ))()

        friend_ids = []
        for friendship in friendships:
            # sync_to_async로 래핑된 함수 정의
            async def get_friend_id():
                if friendship.receiver_id == self.user.id:
                    return friendship.requester_id
                return friendship.receiver_id
            
            # 비동기 함수 실행
            friend_id = await get_friend_id()
            friend_ids.append(friend_id)
        # friendships = await sync_to_async(list)(
        #     Friendship.objects.filter(
        #         (models.Q(requester=self.user) | models.Q(receiver=self.user)) &
        #         models.Q(status="accepted")
        #     )
        # )

        # friend_id = []
        # for friendship in friendships:
        #     if await sync_to_async(lambda: friendship.receiver == self.user)():
        #         friend_id.append(friendship.requester.id)
        # else:
        #     friend_id.append(friendship.receiver.id)
        # friend_ids = set(friend_id)

        

        if not friend_ids:
            await self.send(json.dumps({"type": "friend_statuses", "friends": []}))
            return

        friends = await sync_to_async(list)(
            User.objects.filter(id__in=friend_ids).values("id", "username", "avatar", "status_message")
        )

        redis_keys = [f"user:{friend['id']}:status" for friend in friends]

        if redis_keys:
            statuses = await redis_client.mget(*redis_keys)
        else:
            statuses = []

        friend_data = [
            {
                "id": friend["id"],
                "username": friend["username"],
                "avatar": (friend["avatar"]
                        if friend["avatar"] and friend["avatar"].startswith(('http://', 'https://', '/')) 
                        else f"{settings.BASE_URL}/media/{friend['avatar']}" if friend["avatar"]
                        else None), 
                "status_message": friend["status_message"],
                "status": "online" if status == b"online" else "offline",
            }
            for friend, status in zip(friends, statuses)
        ]
        print(friend_data)
        await self.send(json.dumps({"type": "friend_statuses", "friends": friend_data}))
