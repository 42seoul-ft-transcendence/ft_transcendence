from django.urls import re_path
from .pong import PongGameConsumer

websocket_urlpatterns = [
    re_path(r'ws/pong/?$', PongGameConsumer.as_asgi()),
]