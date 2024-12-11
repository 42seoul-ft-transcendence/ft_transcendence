from django.http import JsonResponse, HttpResponseBadRequest
from django.views import View
from django.shortcuts import get_object_or_404, render
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db import models
from .models import Friendship
from django.contrib.auth import get_user_model

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt



User = get_user_model()


@method_decorator(csrf_exempt, name='dispatch')
class SendFriendRequestView(LoginRequiredMixin, View):
    """
    친구 요청 전송
    """
    def get(self, request):
        return render(request, 'friendship.html')

    def post(self, request):
        receiver_id = request.POST.get("receiver")
        if not receiver_id:
            return HttpResponseBadRequest("Receiver ID is required.")

        receiver = get_object_or_404(User, id=receiver_id)
        if receiver == request.user:
            return HttpResponseBadRequest("You cannot send a friend request to yourself.")

        friendship, created = Friendship.objects.get_or_create(
            requester=request.user, receiver=receiver
        )

        if not created:
            return JsonResponse({"error": "Friend request already exists."}, status=400)

        return JsonResponse({
            "message": "Friend request sent successfully.",
            "id": friendship.id,
            "status": friendship.status,
        })


class RespondFriendRequestView(LoginRequiredMixin, View):
    """
    친구 요청에 응답 (accept, deny, delete)
    """
    def post(self, request, friendship_id):
        action = request.POST.get("action")
        friendship = get_object_or_404(Friendship, id=friendship_id)

        # 요청자가 receiver일 때만 상태 변경 가능
        if friendship.receiver != request.user:
            return HttpResponseBadRequest("You are not authorized to respond to this request.")

        # 상태 전이 로직
        if friendship.status == "pending":
            if action == "accept":
                friendship.status = "accepted"
            elif action == "deny":
                friendship.status = "denied"
            else:
                return HttpResponseBadRequest("Invalid action for pending state.")
        elif friendship.status == "accepted":
            if action == "delete":
                friendship.status = "deleted"
            else:
                return HttpResponseBadRequest("Invalid action for accepted state.")
        else:
            return HttpResponseBadRequest("No action allowed for this state.")

        friendship.save()
        return JsonResponse({
            "message": f"Friend request {action}ed.",
            "status": friendship.status,
        })


# class FriendshipListView(LoginRequiredMixin, View):
#     """
#     친구 목록 조회
#     """
#     def get(self, request):
#         friendships = Friendship.objects.filter(
#             (models.Q(requester=request.user) | models.Q(receiver=request.user)) & ~models.Q(status="deleted")
#         ).select_related("requester", "receiver")
#
#         return render(request, "friendships/list.html", {"friendships": friendships})
