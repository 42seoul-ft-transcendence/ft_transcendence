from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    # TODO: add User Field

    def __str__(self):
        return self.username
