# authentication/consumers.py
from channels.generic.websocket import AsyncWebsocketConsumer
import json
from asgiref.sync import sync_to_async
# from redis_utils import set_user_login, is_user_logged_in, set_user_logout
from ..transcendence.redis_utils import set_user_login, is_user_logged_in, set_user_logout

class LoginStatusConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope["user"]

        if user.is_authenticated:
            # 사용자 로그인 상태를 Redis에 저장
            await sync_to_async(set_user_login)(user.id)

            # WebSocket 연결 수락
            await self.accept()

            # 로그인 상태를 클라이언트로 전송
            await self.send(json.dumps({
                "message": f"User {user.id} is logged in",
                "status": "online"
            }))
        else:
            # 비로그인 사용자는 연결을 거부
            await self.close()

    async def disconnect(self, close_code):
        user = self.scope["user"]

        if user.is_authenticated:
            # Redis에서 사용자 로그아웃 처리
            await sync_to_async(set_user_logout)(user.id)

    async def receive(self, text_data):
        # 클라이언트로부터 받은 메시지 처리 (필요 시 구현)
        data = json.loads(text_data)
        await self.send(json.dumps({
            "message": f"Received: {data}"
        }))
