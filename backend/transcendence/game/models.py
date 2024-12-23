import uuid
from django.db import models
from django.contrib.auth import get_user_model

class Pong(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("active", "Active"),
        ("finished", "Finished"),
    ]

    id = models.BigAutoField(primary_key=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
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
        return f"Match {self.id} | {self.user1} vs {self.user2 or 'Waiting...'}"
