from django.db import models
from django.contrib.auth import get_user_model

class Pong(models.Model):
    STATUS_CHOICES = [
        ("pending", "PEN"),
        ("active", "ACT"),
        ("finished", "FIN"),
    ]

    id = models.IntegerField(primary_key=True)
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

    def serialize(self):
        return {
            "id": self.id,
            "user1": {
                {
                    "id": self.user1.id,
                    "username": self.user1.username
                }
                if self.user1
                else None,
            },
            "user2": {
                {
                    "id": self.user2.id,
                    "username": self.user2.username
                }
                if self.user2
                else None,
            },
            "score1": self.score1,
            "score2": self.score2,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }
