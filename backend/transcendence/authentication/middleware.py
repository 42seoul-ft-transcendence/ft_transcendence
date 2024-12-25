from django.contrib.auth.models import AnonymousUser
from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin
from .utils import decode_jwt
from django.contrib.auth import get_user_model
from django.shortcuts import redirect

User = get_user_model()

class JWTAuthenticationMiddleware(MiddlewareMixin):
    WHITE_LIST = [
        "/admin/",
        "/login/oauth/",
        "/login/verify-2fa/",
        "/login/"
        ]

    def process_request(self, request):
        """
        요청이 들어올 때 Authorization 헤더를 확인하고 JWT 검증
        """
        # 특정 경로는 인증 제외 (예: /admin/ 또는 공용 API 경로)
        for prefix in self.WHITE_LIST:
            if request.path.startswith(prefix):
                return  # 인증 건너뜀

        request.user = AnonymousUser()
        access_token = request.COOKIES.get("access_token")

        if access_token:
            try:
                # Decode and verify access token
                payload = decode_jwt(access_token)
                user = User.objects.get(id=payload.get("user_id"))
                request.user = user  # Set authenticated user
            except Exception:
                return JsonResponse(
                    {"error": "Invalid or expired access token. Please login again."},
                    status=401
                )
        else:
            return JsonResponse(
                {"error": "Invalid or expired access token. Please login again."},
                status=401
            )
