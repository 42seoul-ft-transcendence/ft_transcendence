from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.utils.translation import gettext as _
from . import models


def tournament_json(request, name: str):
    if not request.user.is_authenticated:
        return JsonResponse(
            {"error": _("You must be authenticated to get tournament results")},
            status=401,
        )

    if not name.isalpha():
        return JsonResponse({"error": _("Invalid tournament name.")}, status=400)

    tournament = get_object_or_404(models.PongTournament, name=name)
    data = tournament.serialize()

    return JsonResponse(data, safe=False)