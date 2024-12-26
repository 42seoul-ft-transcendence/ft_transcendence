from django.urls import path
from .views import MatchHistoryView, GameStartView, GameStateView, ForceDisconnectView

urlpatterns = [
    path('match-history/', MatchHistoryView.as_view(), name='match_history'),
    path('game/start/', GameStartView.as_view(), name='game_start'),
    path('game/state/<str:room_id>/', GameStateView.as_view(), name='game_state'),
    path('game/disconnect/', ForceDisconnectView.as_view(), name='force_disconnect'),
]
