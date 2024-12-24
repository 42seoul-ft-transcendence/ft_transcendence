from django.urls import path
from .views import MatchHistoryView

urlpatterns = [
    path('match-history/', MatchHistoryView.as_view(), name='match_history'),
]
