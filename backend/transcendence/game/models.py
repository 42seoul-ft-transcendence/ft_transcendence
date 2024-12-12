from django.db import models
from django.contrib.auth import get_user_model

class Game(models.Model):
    GAME_TYPE_CHOICES = [
        ("pong", "Pong"),
    ]
    STATUS_CHOICES = [
        ("pending", "PEN"),
        ("active", "ACT"),
        ("finished", "FIN"),
    ]

    id = models.IntegerField(primary_key=True)
    game_type = models.CharField(max_length=20, choices=GAME_TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    user1 = models.ForeignKey(
        get_user_model(),
        on_delete=models.SET_NULL,
        null=True,
        related_name="user1",
    )
    user2 = models.ForeignKey(
        get_user_model(),
        on_delete=models.SET_NULL,
        null=True,
        related_name="user2",
    )
    score1 = models.IntegerField(default=0)
    score2 = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user1.username} vs {self.user2.username}"