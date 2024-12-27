from django.http import JsonResponse
from django.views import View
from django.core.paginator import Paginator
from django.contrib.auth.mixins import LoginRequiredMixin
import redis

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
                "host": match.host.username if match.host else "Unknown",
                "guest": match.guest.username if match.guest else "Unknown",
                "host_score": match.host_score,
                "guest_score": match.guest_score,
                "host_avatar": match.host.avatar,
                "guest_avatar": match.guest.avatar,
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

        existing_rooms = redis_conn.keys(f"waiting_room_*")
        for room in existing_rooms:
            try:
                players = redis_conn.lrange(room, 0, -1)
                if str(user.id).encode('utf-8') in players:
                    redis_conn.delete(room)
                    # return JsonResponse({"room_id": room.decode('utf-8'), "status": "in_room"})
            except redis.exceptions.ResponseError:
                # 키가 리스트가 아닌 경우 키를 삭제
                redis_conn.delete(room)

        for room in existing_rooms:
            try:
                if redis_conn.llen(room) < 2:
                    redis_conn.rpush(room, user.id)
                    return JsonResponse({"room_id": room.decode('utf-8'), "status": "joined"})
            except redis.exceptions.ResponseError:
                # 키가 리스트가 아닌 경우 키를 삭제
                redis_conn.delete(room)

        new_room = f"waiting_room_{user.id}"
        redis_conn.rpush(f"{new_room}", user.id)
        return JsonResponse({"room_id": new_room, "status": "created"})
