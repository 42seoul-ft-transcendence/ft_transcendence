from django.urls import re_path
from .consumers import Pong

websocket_urlpatterns = [
    # Pong 게임 WebSocket 라우트
    re_path(r"ws/game/(?P<room_id>[a-zA-Z0-9\-]+)/$", Pong.as_asgi()),
    # 대기 큐를 위한 WebSocket 라우트
    re_path(r"ws/queue/$", Pong.as_asgi()),
]
