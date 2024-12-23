from django.db import models
from django.conf import settings

class Friendship(models.Model):
    STATUS_CHOICES = [
        ("pending", "PEN"),
        ("accepted", "ACC"),
        ("denied", "DEN"),
        ("deleted", "DEL"),
    ]

    id = models.BigAutoField(primary_key=True)
    requester = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="sent_requests"
    )
    receiver = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="received_requests"
    )
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("requester", "receiver")

    def __str__(self):
        return f"{self.requester} -> {self.receiver} [{self.status}]"
