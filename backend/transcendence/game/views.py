from django.http import JsonResponse
from django.views import View
from django.core.paginator import Paginator

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
