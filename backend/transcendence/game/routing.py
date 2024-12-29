from django.urls import re_path
from .pong import PongGameConsumer

websocket_urlpatterns = [
    re_path(r'ws/pong/(?P<room_id>\w+)/?$', PongGameConsumer.as_asgi()),
]
