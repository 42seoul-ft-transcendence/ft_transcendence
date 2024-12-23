from django.http import JsonResponse
from django.views import View
from django.contrib.auth.mixins import LoginRequiredMixin
from .models import Pong
from django.db.models import Q

class CreateMatchView(LoginRequiredMixin, View):
    def post(self, request):
        # 대기 중인 매치 찾기
        match = Pong.objects.filter(status="pending").exclude(user1=request.user).first()
        if match:
            match.user2 = request.user
            match.status = "active"
            match.save()
        else:
            match = Pong.objects.create(user1=request.user)

        return JsonResponse({"match_id": match.id, "status": match.status})
