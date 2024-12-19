from django.urls import path
from .views import CreateGameView, JoinGameView, UpdateScoreView, GameExperimentView

urlpatterns = [
    path("create/", CreateGameView.as_view(), name="create_game"),
    path("join/<int:game_id>/", JoinGameView.as_view(), name="join_game"),
    path("update_score/<int:game_id>/", UpdateScoreView.as_view(), name="update_score"),
    path("experiment/", GameExperimentView.as_view(), name="game_experiment"),
]