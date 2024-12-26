import json
from django.http import JsonResponse, HttpResponseBadRequest
from django.views import View
from django.shortcuts import get_object_or_404, render
from django.contrib.auth.mixins import LoginRequiredMixin
from .models import Friendship
from django.contrib.auth import get_user_model

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
                "requester_username": request.requester.username,
                # "requester_avatar": request.requester.avatar,
                "requester_state_message": request.requester.status_message,
                "created_at": request.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            }
            for request in received_requests
        ]

        return JsonResponse({"received_requests": request_data})


class RespondFriendRequestView(LoginRequiredMixin, View):
    """
    친구 요청에 응답 (accept, deny, delete)
    """
    def post(self, request, friendship_id):
        # action = request.POST.get("action")

        action = json.loads(request.body).get("action")
        print(action)
        friendship = get_object_or_404(Friendship, id=friendship_id)

        print(friendship.receiver)
        print(request.user)
        # 요청자가 receiver일 때만 상태 변경 가능
        if friendship.receiver.id != request.user.id:
            return HttpResponseBadRequest("You are not authorized to respond to this request.")

        # 상태 전이 로직
        if friendship.status == "pending":
            if action == "accept":
                print("ASDFAS")
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
