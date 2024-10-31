from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
import requests
from django.conf import settings
from .models import Friendship


# 친구 요청 전송
class FriendRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        requester_id = request.user.id
        receiver_id = request.data.get("receiver_id")

        if requester_id == receiver_id:
            return Response({"error": "You cannot send a friend request to yourself."}, status=status.HTTP_400_BAD_REQUEST)

        # 친구 요청이 이미 존재하는지 확인
        if Friendship.objects.filter(requester_id=requester_id, receiver_id=receiver_id).exists():
            return Response({"error": "Friend request already sent."}, status=status.HTTP_400_BAD_REQUEST)

        # 친구 요청 생성
        friendship = Friendship.objects.create(requester_id=requester_id, receiver_id=receiver_id, status="pending")
        return Response({"message": "Friend request sent successfully."}, status=status.HTTP_201_CREATED)


# 수락
class FriendAcceptView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        receiver_id = request.user.id
        requester_id = request.data.get("requester_id")

        try:
            friendship = Friendship.objects.get(requester_id=requester_id, receiver_id=receiver_id, status="pending")
            friendship.status = "accepted"
            friendship.save()
            return Response({"message": "Friend request accepted."}, status=status.HTTP_200_OK)
        except Friendship.DoesNotExist:
            return Response({"error": "No pending friend request found."}, status=status.HTTP_404_NOT_FOUND)


# 거절
class FriendRejectView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        receiver_id = request.user.id
        requester_id = request.data.get("requester_id")

        try:
            friendship = Friendship.objects.get(requester_id=requester_id, receiver_id=receiver_id, status="pending")
            friendship.status = "rejected"
            friendship.save()
            return Response({"message": "Friend request rejected."}, status=status.HTTP_200_OK)
        except Friendship.DoesNotExist:
            return Response({"error": "No pending friend request found."}, status=status.HTTP_404_NOT_FOUND)


# 친구 삭제
class FriendRemoveView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        user_id = request.user.id
        friend_id = request.data.get("friend_id")

        try:
            friendship = Friendship.objects.get(
                (models.Q(requester_id=user_id, receiver_id=friend_id) | models.Q(requester_id=friend_id, receiver_id=user_id)),
                status="accepted"
            )
            friendship.delete()
            return Response({"message": "Friend removed successfully."}, status=status.HTTP_200_OK)
        except Friendship.DoesNotExist:
            return Response({"error": "Friend relationship not found."}, status=status.HTTP_404_NOT_FOUND)


# 친구 목록 조회
class FriendListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user_id = request.user.id

        # 친구 목록 필터링 (status가 accepted인 경우)
        friends = Friendship.objects.filter(
            (models.Q(requester_id=user_id) | models.Q(receiver_id=user_id)),
            status='accepted'
        )

        # 친구 목록에서 친구의 ID 조회 및 반환
        friend_details = []
        for friend in friends:
            friend_id = friend.receiver_id if friend.requester_id == user_id else friend.requester_id
            # 친구 정보 조회 (authentication 서비스와 통신)
            auth_response = requests.get(
                f"{settings.AUTH_SERVICE_URL}/api/auth/user/{friend_id}/",
                headers={"Authorization": request.headers.get("Authorization")}
            )
            if auth_response.status_code == 200:
                friend_details.append(auth_response.json())

        return Response(friend_details, status=status.HTTP_200_OK)


# 받은 친구 요청 목록
class FriendRequestListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user_id = request.user.id
        # 받은 친구 요청만 필터링
        received_requests = Friendship.objects.filter(receiver_id=user_id, status="pending")

        # 요청자 정보 조회 및 반환
        requesters = []
        for request in received_requests:
            auth_response = requests.get(
                f"{settings.AUTH_SERVICE_URL}/api/auth/user/{request.requester_id}/",
                headers={"Authorization": request.headers.get("Authorization")}
            )
            if auth_response.status_code == 200:
                requesters.append(auth_response.json())

        return Response(requesters, status=status.HTTP_200_OK)


# TODO: 친구 상세 조회 (?)