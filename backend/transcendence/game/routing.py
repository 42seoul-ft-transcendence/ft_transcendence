from django.urls import re_path
from .pong import Pong

websocket_urlpatterns = [
    re_path(r'ws/pong/?$', Pong.as_asgi()),
]