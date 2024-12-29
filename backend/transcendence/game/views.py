from django.http import JsonResponse
from django.views import View
from django.core.paginator import Paginator
from django.contrib.auth.mixins import LoginRequiredMixin
from authentication.utils import avatar_url
import redis

from django.db import models
from .models import Pong


class MatchHistoryView(View):
    def get(self, request):
        target = request.GET.get('target')
        matches = Pong.objects.order_by('-created_at')
        user = request.user

        if not target:
            target = user.id

        if target:
            matches = matches.filter(
                models.Q(host__id__icontains=target) |
                models.Q(guest__id__icontains=target)
            )

        page = request.GET.get('page', 1)
        paginator = Paginator(matches, 10)
        current_page = paginator.get_page(page)

        match_data = [
            {
                "host": {
                    "id": match.host.id,
                    "username": match.host.username,
                    "avatar": avatar_url(match.host.avatar),
                    "score": match.host_score,
                },
                "guest": {
                    "id": match.guest.id,
                    "username": match.guest.username,
                    "avatar": avatar_url(match.guest.avatar),
                    "score": match.guest_score,
                },
                "winner": match.winner,
                "date": match.updated_at.isoformat(),
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

        existing_rooms = redis_conn.smembers("rooms_list")
        user_id = str(user.id)

        for room_id in existing_rooms:
            players_key = f"{room_id.decode('utf-8')}_players"
            players = redis_conn.lrange(players_key, 0, -1)
            if user_id.encode('utf-8') in players:
                redis_conn.lrem(players_key, 1, user_id)
                if redis_conn.llen(players_key) == 0:
                    redis_conn.srem("rooms_list", room_id)
                    redis_conn.delete(players_key)

        for room_id in existing_rooms:
            players_key = f"{room_id.decode('utf-8')}_players"
            if redis_conn.llen(players_key) < 2:
                redis_conn.rpush(players_key, user_id)
                players = redis_conn.lrange(players_key, 0, -1)
                for player in players:
                    redis_conn.lrem(players_key, 1, player)
                redis_conn.srem("rooms_list", room_id)
                redis_conn.delete(players_key)
                return JsonResponse({
                    "status": "joined",
                    "room_id": room_id.decode('utf-8'),
                    # "players": [p.decode('utf-8') for p in players],
                    "players": [user_id]
                })

        new_room_id = f"waiting_room_{user_id}"
        redis_conn.rpush(f"{new_room_id}_players", user_id)
        redis_conn.sadd("rooms_list", new_room_id)

        return JsonResponse({
            "status": "created",
            "room_id": new_room_id,
            "players": [user_id],
        })
