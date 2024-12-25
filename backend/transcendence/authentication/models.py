import os
import uuid
import requests

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.files.base import ContentFile
from django.db import models


class UserManager(BaseUserManager):
    def create_user(self, username, email, avatar, password=None, **extra_fields):
        """
        일반 사용자 생성
        """
        if not username:
            raise ValueError("Users must have a username.")
        if not email:
            raise ValueError("Users must have an email address.")

        email = self.normalize_email(email)
        user = self.model(
            username=username,
            email=email,
            **extra_fields
        )
        user.set_password(password)  # 암호 설정

        if avatar:
            user.save()
            user.save_avatar_from_url(avatar)

        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, avatar, password=None, **extra_fields):
        """
        슈퍼유저 생성
        """
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if not extra_fields.get("is_staff"):
            raise ValueError("Superuser must have is_staff=True.")
        if not extra_fields.get("is_superuser"):
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(username, email, avatar, password=password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    id = models.BigAutoField(primary_key=True)
    username = models.CharField(max_length=15, unique=True)
    email = models.EmailField(unique=True)
    avatar = models.ImageField(upload_to="media/avatars/", default="media/avatars/default.png")
    two_factor = models.BooleanField(default=False)
    otp_secret = models.CharField(max_length=32, blank=True, null=True)
    status_message = models.TextField(max_length=255, blank=True, null=True, default='')
    is_active = models.BooleanField(default=True)  # 활성 사용자 여부
    is_staff = models.BooleanField(default=False)  # 관리 패널 접근 가능 여부
    is_superuser = models.BooleanField(default=False)  # 모든 권한 부여 여부

    objects = UserManager()

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email", "avatar"]

    def __str__(self):
        return self.username

    def has_perm(self, perm, obj=None):
        """
        특정 권한이 있는지 확인
        """
        return True

    def has_module_perms(self, app_label):
        """
        주어진 앱의 모델에 접근할 권한이 있는지 확인
        """
        return True

    def save_avatar_from_url(self, url):
        response = requests.get(url)
        if response.status_code == 200:
            file_name = f"{self.username}.png"
            avatar_path = os.path.join("avatars", file_name)
            self.avatar.save(avatar_path, ContentFile(response.content), save=True)
        else:
            raise Exception("Failed to download avatar from url")