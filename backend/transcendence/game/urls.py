
from django.urls import path
from . import views

urlpatterns = [
    path(
        "tournaments/json/<str:name>/", views.tournament_json, name="tournament_json"
    ),
]
