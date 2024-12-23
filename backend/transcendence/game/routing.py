from django.urls import re_path
from .pong import Pong
from .tournament import Tournament

websocket_urlpatterns = [
    re_path(r'ws/pong/?$', Pong.as_asgi()),
    re_path(r'ws/pong_tournament/?$', Tournament.as_asgi()),
]