from django.http import JsonResponse, HttpResponseBadRequest
from django.views import View
from django.shortcuts import get_object_or_404, render
from django.contrib.auth.mixins import LoginRequiredMixin
from .models import Friendship
from django.contrib.auth import get_user_model
from .utils import add_friend_to_redis, remove_friend_from_redis, redis_client


User = get_user_model()

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
                add_friend_to_redis(friendship.requester.id, friendship.receiver.id)
                add_friend_to_redis(friendship.receiver.id, friendship.requester.id)
            elif action == "deny":
                friendship.status = "denied"
                remove_friend_from_redis(friendship.requester.id, friendship.receiver.id)
                remove_friend_from_redis(friendship.receiver.id, friendship.requester.id)
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


class FriendshipListView(LoginRequiredMixin, View):
    """
    친구 목록 조회
    """
    def get(self, request):
        user = request.user
        friend_ids = redis_client.smembers(f"user:{user.id}:friends")
        friends = User.objects.filter(id__in=friend_ids)

        friend_data = []
        for friend in friends:
            status = redis_client.get(f"user:{friend.id}:status")
            friend_data.append({
                "id": friend.id,
                "display_name": friend.display_name,
                "status": "online" if status else "offline"
            })

        return JsonResponse({"friends": friend_data})
