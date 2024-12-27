import uuid
from django.db import models
from django.contrib.auth import get_user_model


class Pong(models.Model):
    STATUS_CHOICES = [
        ("ONGOING", "Ongoing"),
        ("COMPLETED", "Completed"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    host = models.ForeignKey(get_user_model(), on_delete=models.SET_NULL, null=True, related_name="host")
    guest = models.ForeignKey(get_user_model(), on_delete=models.SET_NULL, null=True, related_name="guest")
    host_score = models.PositiveSmallIntegerField(default=0)
    guest_score = models.PositiveSmallIntegerField(default=0)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="ONGOING")
    winner = models.CharField(max_length=50, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.host.username} vs {self.guest.username} - {self.host_score}:{self.guest_score}"

    def serialize(self):
        return {
            "id": str(self.id),
            "host": (
                {"id": self.host.id, "username": self.host.username}
                if self.host
                else None
            ),
            "guest": (
                {"id": self.guest.id, "username": self.guest.username}
                if self.guest
                else None
            ),
            "host_score": self.host_score,
            "guest_score": self.guest_score,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }
