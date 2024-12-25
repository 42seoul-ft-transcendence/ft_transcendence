# from django.contrib import admin
# from .models import Pong

# @admin.register(Pong)
# class PongGameAdmin(admin.ModelAdmin):
#     list_display = ("user1", "user2", "score1", "score2", "created_at", "id")
#     search_fields = ("user1__username", "user2__username")
#     list_filter = ("created_at",)


# @admin.register(PongTournament)
# class PongTournamentAdmin(admin.ModelAdmin):
#     list_display = ("name", "winner", "created_at", "updated_at")
#     search_fields = ("name", "winner__username")
#     list_filter = ("created_at", "updated_at", "winner")