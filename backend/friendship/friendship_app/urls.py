from django.urls import path
from .views import FriendRequestView, FriendAcceptView, FriendRejectView, FriendRemoveView, FriendListView, FriendRequestListView

urlpatterns = [
    path('request/', FriendRequestView.as_view(), name='friend-request'),
    path('accept/', FriendAcceptView.as_view(), name='friend-accept'),
    path('reject/', FriendRejectView.as_view(), name='friend-reject'),
    path('remove/', FriendRemoveView.as_view(), name='friend-remove'),
    path('list/', FriendListView.as_view(), name='friend-list'),
    path('requests/', FriendRequestListView.as_view(), name='friend-requests'),
]
