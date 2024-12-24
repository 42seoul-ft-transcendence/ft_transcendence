import uuid
from django.db import models
from django.contrib.auth import get_user_model


class Pong(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    host = models.ForeignKey(
        get_user_model(),
        on_delete=models.SET_NULL,
        null=True,
        related_name="user1",
    )
    guest = models.ForeignKey(
        get_user_model(),
        on_delete=models.SET_NULL,
        null=True,
        related_name="user2",
    )
    host_score = models.PositiveSmallIntegerField()
    guest_score = models.PositiveSmallIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.host.username} vs {self.guest.username} - {self.host_score}:{self.guest_score}"

    def serialize(self):
        return {
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
            "uuid": self.id,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }
