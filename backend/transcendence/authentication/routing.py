# authentication/routing.py
from django.urls import path
from .consumers import LoginStatusConsumer

websocket_urlpatterns = [
    path("ws/login_status/", LoginStatusConsumer.as_asgi()),
]
