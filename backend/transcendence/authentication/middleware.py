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
        if request.path.startswith('/admin/'):
            return

        token = request.COOKIES.get("access_token")
        if token:
            try:
                payload = decode_jwt(token)
                user = User.objects.get(id=payload.get("user_id"))
            except Exception as e:
                request.user = AnonymousUser()
        else:
            request.user = AnonymousUser()
