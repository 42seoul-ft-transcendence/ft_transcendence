import uuid
import pyotp
from email.policy import default

from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    display_name = models.CharField(max_length=50, default=username)
    # TODO: edit default URL
    avatar = models.URLField(default="https://example.com/default-avatar.png", blank=False, null=False)
    two_factor = models.BooleanField(default=False)
    otp_secret = models.CharField(max_length=16, default=pyotp.random_base32)  # OTP 비밀키 저장

    def __str__(self):
        return f'User {self.username}: [ email: {self.email} ]'