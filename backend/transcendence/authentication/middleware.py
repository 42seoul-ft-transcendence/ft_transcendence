from django.contrib.auth.models import AnonymousUser
from django.utils.deprecation import MiddlewareMixin
from .utils import decode_jwt
from django.contrib.auth import get_user_model

User = get_user_model()

class JWTAuthenticationMiddleware(MiddlewareMixin):
    def process_request(self, request):
        """
        요청이 들어올 때 Authorization 헤더를 확인하고 JWT 검증
        """
        # 특정 경로는 인증 제외 (예: /admin/ 또는 공용 API 경로)
        if request.path.startswith('/admin/'):
            return

        # 기본값으로 AnonymousUser 설정
        request.user = AnonymousUser()

        # JWT 토큰 가져오기
        token = request.COOKIES.get("access_token")
        if token:
            try:
                # JWT 디코딩 및 사용자 조회
                payload = decode_jwt(token)
                user = User.objects.get(id=payload.get("user_id"))
                request.user = user  # 인증된 사용자 설정
            except User.DoesNotExist:
                print("User dose not exist")