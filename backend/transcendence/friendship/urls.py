from django.urls import path
from .views import SendFriendRequestView, RespondFriendRequestView, FriendshipListView

urlpatterns = [
    path("send/", SendFriendRequestView.as_view(), name="send_friend_request"),
    path("received/", RespondFriendRequestView.as_view(), name="received_friend_request"),
    path("respond/<int:friendship_id>/", RespondFriendRequestView.as_view(), name="respond_friend_request"),
    path("list/", FriendshipListView.as_view(), name="friendship_list"),
]
