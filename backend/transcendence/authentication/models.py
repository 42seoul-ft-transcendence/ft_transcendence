from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from .utils import generate_unique_display_name


class UserManager(BaseUserManager):
    def create_user(self, username, email, avatar, display_name=None, password=None, **extra_fields):
        """
        일반 사용자 생성
        """
        if not username:
            raise ValueError("Users must have a username.")
        if not email:
            raise ValueError("Users must have an email address.")

        email = self.normalize_email(email)
        if not display_name:
            display_name = username

        # Display name의 중복 체크
        if self.model.objects.filter(display_name=display_name).exists():
            display_name = generate_unique_display_name(display_name, self.model)

        user = self.model(
            username=username,
            email=email,
            avatar=avatar,
            display_name=display_name,
            **extra_fields
        )
        user.set_password(password)  # 암호 설정
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

        return self.create_user(username, email, avatar, display_name=username, password=password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=15, unique=True)
    display_name = models.CharField(max_length=50, unique=True)
    email = models.EmailField(unique=True)
    avatar = models.ImageField(upload_to="media/avatars/", default="media/avatars/default.png")
    two_factor = models.BooleanField(default=False)
    otp_secret = models.CharField(max_length=10, blank=True, null=True)
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
