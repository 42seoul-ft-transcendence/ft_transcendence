from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
import requests
from django.conf import settings
from django.db.models import Q
from .models import Friendship
from .utils import JWTAuthentication


# 친구 요청 전송
class FriendRequestView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user_id = request.user.id

        receiver_user_id = request.data.get("receiver_id")
        if not receiver_user_id:
            return Response({"error": "Receiver ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            receiver_user_id = int(receiver_user_id)
        except ValueError:
            return Response({"error": "Receiver ID must be an integer."}, status=status.HTTP_400_BAD_REQUEST)

        # 같은 사용자에게 요청을 보내는지 확인
        if user_id == receiver_user_id:
            return Response(
                {"error": "You cannot send a friend request to yourself."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 이미 친구 요청이 있는지 확인
        if Friendship.objects.filter(
                requester_id=user_id, receiver_id=receiver_user_id
        ).exists():
            return Response({"error": "Friend request already sent."}, status=status.HTTP_400_BAD_REQUEST)

        # 이미 반대 방향의 친구 요청이 있는지 확인
        if Friendship.objects.filter(
                requester_id=receiver_user_id, receiver_id=user_id
        ).exists():
            return Response({"error": "You have a pending friend request from this user."}, status=status.HTTP_400_BAD_REQUEST)

        # Friendship 객체 생성
        Friendship.objects.create(
            requester_id=user_id,
            receiver_id=receiver_user_id,
            status="pending"
        )
        return Response({"message": "Friend request sent successfully."}, status=status.HTTP_201_CREATED)


# 친구 요청 수락
class FriendAcceptView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user_id = request.user.id

        requester_id = request.data.get("requester_id")
        if not requester_id:
            return Response({"error": "Requester ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            requester_id = int(requester_id)
        except ValueError:
            return Response({"error": "Requester ID must be an integer."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            friendship = Friendship.objects.get(
                requester_id=requester_id,
                receiver_id=user_id,
                status="pending"
            )
            friendship.status = "accepted"
            friendship.save()
            return Response({"message": "Friend request accepted."}, status=status.HTTP_200_OK)
        except Friendship.DoesNotExist:
            return Response({"error": "No pending friend request found."}, status=status.HTTP_404_NOT_FOUND)


# 친구 요청 거절
class FriendRejectView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user_id = request.user.id

        requester_id = request.data.get("requester_id")
        if not requester_id:
            return Response({"error": "Requester ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            requester_id = int(requester_id)
        except ValueError:
            return Response({"error": "Requester ID must be an integer."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            friendship = Friendship.objects.get(
                requester_id=requester_id,
                receiver_id=user_id,
                status="pending"
            )
            friendship.status = "rejected"
            friendship.save()
            return Response({"message": "Friend request rejected."}, status=status.HTTP_200_OK)
        except Friendship.DoesNotExist:
            return Response({"error": "No pending friend request found."}, status=status.HTTP_404_NOT_FOUND)


# 친구 삭제
class FriendRemoveView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        user_id = request.user.id

        friend_id = request.data.get("friend_id")
        if not friend_id:
            return Response({"error": "Friend ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            friend_id = int(friend_id)
        except ValueError:
            return Response({"error": "Friend ID must be an integer."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            friendship = Friendship.objects.get(
                Q(requester_id=user_id, receiver_id=friend_id) | Q(requester_id=friend_id, receiver_id=user_id),
                status="accepted"
            )
            friendship.delete()
            return Response({"message": "Friend removed successfully."}, status=status.HTTP_200_OK)
        except Friendship.DoesNotExist:
            return Response({"error": "Friend relationship not found."}, status=status.HTTP_404_NOT_FOUND)



# 친구 목록 조회
# TODO: `friend_id`를 URL 이나 쿼리 파라미터로 전달하게 변경
class FriendListView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user_id = request.user.id

        friends = Friendship.objects.filter(
            Q(requester_id=user_id) | Q(receiver_id=user_id),
            status='accepted'
        )

        friend_ids = set()
        for friendship in friends:
            if friendship.requester_id == user_id:
                friend_ids.add(friendship.receiver_id)
            else:
                friend_ids.add(friendship.requester_id)

        friend_details = []
        headers = {"Authorization": request.headers.get("Authorization")}
        for friend_id in friend_ids:
            try:
                auth_response = requests.get(
                    f"{settings.AUTH_SERVICE_URL}/api/auth/user/{friend_id}/",
                    headers=headers,
                    timeout=5  # 타임아웃 설정
                )
                if auth_response.status_code == 200:
                    friend_details.append(auth_response.json())
                else:
                    friend_details.append({"id": friend_id, "error": "User not found"})
            except requests.exceptions.RequestException as e:
                friend_details.append({"id": friend_id, "error": str(e)})

        return Response(friend_details, status=status.HTTP_200_OK)


# 받은 친구 요청 목록
class FriendRequestListView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user_id = request.user.id

        received_requests = Friendship.objects.filter(receiver_id=user_id, status="pending")

        requesters = []
        headers = {"Authorization": request.headers.get("Authorization")}
        for friendship_request in received_requests:
            requester_id = friendship_request.requester_id
            try:
                auth_response = requests.get(
                    f"{settings.AUTH_SERVICE_URL}/api/auth/user/{requester_id}/",
                    headers=headers,
                    timeout=5
                )
                if auth_response.status_code == 200:
                    requesters.append(auth_response.json())
                else:
                    requesters.append({"id": requester_id, "error": "User not found"})
            except requests.exceptions.RequestException as e:
                requesters.append({"id": requester_id, "error": str(e)})

        return Response(requesters, status=status.HTTP_200_OK)

# TODO: 친구 상세 조회 (?)