from django.db import models

class Friendship(models.Model):
    id = models.AutoField(primary_key=True, editable=False)
    requester_id = models.IntegerField()
    receiver_id = models.IntegerField()

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
