from django.http import JsonResponse
from django.views import View
from django.core.paginator import Paginator
from django.contrib.auth.mixins import LoginRequiredMixin
import redis
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from . import models
from .models import Pong


class MatchHistoryView(View):
    def get(self, request):
        target = request.GET.get('target')
        matches = Pong.objects.order_by('-created_at')

        if target:
            matches = matches.filter(
                models.Q(host__username__icontains=target) |
                models.Q(guest__username__icontains=target)
            )

        page = request.GET.get('page', 1)
        paginator = Paginator(matches, 10)
        current_page = paginator.get_page(page)

        match_data = [
            {
                "id": str(match.id),
                "host": match.host.username if match.host else "Unknown",
                "guest": match.guest.username if match.guest else "Unknown",
                "host_score": match.host_score,
                "guest_score": match.guest_score,
                "created_at": match.created_at.isoformat(),
                "updated_at": match.updated_at.isoformat(),
            }
            for match in current_page
        ]

        return JsonResponse({
            "matches": match_data,
            "total": paginator.count,
            "pages": paginator.num_pages,
            "current_page": current_page.number,
        })


class GameStartView(LoginRequiredMixin, View):
    def post(self, request):
        user = request.user
        redis_conn = redis.Redis(host="redis")
        channel_layer = get_channel_layer()

        existing_rooms = redis_conn.keys(f"room_*_players")
        for room in existing_rooms:
            players = redis_conn.lrange(room, 0, -1)
            if str(user.id).encode('utf-8') in players:
                return JsonResponse({"room_id": room.decode('utf-8'), "status": "in_room"})

        for room in existing_rooms:
            if redis_conn.llen(room) < 2:
                redis_conn.rpush(room, user.id)
                async_to_sync(channel_layer.group_add)(room.decode('utf-8'), f"user_{user.id}")
                if redis_conn.llen(room) == 2:
                    redis_conn.set(f"{room.decode('utf-8')}_host", players[0])
                    redis_conn.set(f"{room.decode('utf-8')}_guest", user.id)
                    async_to_sync(channel_layer.group_send)(user.decode('utf-8'), {"type": "game.start"})
                return JsonResponse({"room_id": room.decode('utf-8'), "status": "waiting"})

        new_room = f"room_{user.id}"
        redis_conn.rpush(f"{new_room}_players", user.id)
        redis_conn.set(f"{new_room}_host", user.id)
        async_to_sync(channel_layer.group_add)(new_room, f"user_{user.id}")
        return JsonResponse({"room_id": new_room, "status": "created"})
