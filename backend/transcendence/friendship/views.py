import json
from django.http import JsonResponse, HttpResponseBadRequest
from django.views import View
from django.shortcuts import get_object_or_404, render
from django.contrib.auth.mixins import LoginRequiredMixin
from .models import Friendship
from django.contrib.auth import get_user_model
from asgiref.sync import sync_to_async
from django.db import models

from authentication.consumers import redis_client

User = get_user_model()

class SendFriendRequestView(LoginRequiredMixin, View):
    """
    친구 요청 전송
    """
    def get(self, request):
        return render(request, 'friendship.html')

    def post(self, request):
        try:
            data = json.loads(request.body)
            receiver_id = data.get("receiver")
        except json.JSONDecodeError:
            return HttpResponseBadRequest("Invalid JSON.")

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


class ReceivedFriendRequestsView(LoginRequiredMixin, View):
    """
    받은 친구 요청 조회
    """
    def get(self, request):
        user = request.user

        received_requests = Friendship.objects.filter(
            receiver=user,
            status="pending"
        )

        request_data = [
            {
                "id": request.id,
                "requester_id": request.requester.id,
                "created_at": request.created_at.strftime("%Y-%m-%d %H:%M:%S"),
                # requester_id 의 username, avatar, state_message
            }
            for request in received_requests
        ]

        return JsonResponse({"received_requests": request_data})


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
            "message": f"Friend request {action}",
            "status": friendship.status,
        })


class FriendshipListView(LoginRequiredMixin, View):
    """
    친구 목록 조회
    """
    async def get(self, request):
        user = request.user

        # DB에서 친구 목록 조회
        friendships = await sync_to_async(Friendship.objects.filter)(
            (models.Q(requester=user) | models.Q(receiver=user)) &
            models.Q(status="accepted")
        )

        friend_ids = set(
            friendship.requester.id if friendship.receiver == user else friendship.receiver.id
            for friendship in friendships
        )

        redis_keys = [f"user:{friend_id}:status" for friend_id in friend_ids]
        statuses = await redis_client.mget(redis_keys)

        friend_data = []
        for friend_id, status in zip(friend_ids, statuses):
            friend = await sync_to_async(User.objects.get)(id=friend_id)
            is_online = status == b"online"
            friend_data.append({
                "id": friend.id,
                "status": "online" if is_online else "offline",
            })

        return JsonResponse({"friends": friend_data})
