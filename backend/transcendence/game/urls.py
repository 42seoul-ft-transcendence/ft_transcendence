from django.urls import path
from .views import MatchHistoryView, GameStartView

urlpatterns = [
    path('match-history/', MatchHistoryView.as_view(), name='match_history'),
    path('start/', GameStartView.as_view(), name='game_start'),
]
