from django.db import models
import uuid

class Friendship(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    requester_id = models.UUIDField()
    receiver_id = models.UUIDField()

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected')
    ]
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Friendship(requester_id={self.requester_id}, receiver_id={self.receiver_id}, status={self.status})"
