import requests
from django.conf import settings
from django.shortcuts import redirect
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import AuthenticationFailed
from django.core.mail import send_mail
import jwt
import pyotp


User = get_user_model()


class FortyTwoOAuthRedirect(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        # 42 로그인 페이지로 리다이렉트
        url = (
            f"https://api.intra.42.fr/oauth/authorize?"
            f"client_id={settings.CLIENT_ID}&redirect_uri={settings.REDIRECT_URI}&response_type=code"
        )
        return redirect(url)

class FortyTwoOAuthCallback(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        code = request.GET.get("code")
        if not code:
            return Response({"error": "No code provided"}, status=status.HTTP_401_UNAUTHORIZED)

        # 42 API에서 access token 요청
        token_response = requests.post("https://api.intra.42.fr/oauth/token", data={
            "grant_type": "authorization_code",
            "client_id": settings.CLIENT_ID,
            "client_secret": settings.CLIENT_SECRET,
            "code": code,
            "redirect_uri": settings.REDIRECT_URI,
        }, headers={"Content-Type": "application/x-www-form-urlencoded"}).json()

        access_token = token_response.get("access_token")
        if not access_token:
            return Response({"error": "Failed to obtain access token"}, status=status.HTTP_401_UNAUTHORIZED)

        # 사용자 정보 요청
        user_data_response = requests.get(
            "https://api.intra.42.fr/v2/me",
            headers={"Authorization": f"Bearer {access_token}"}
        ).json()

        user_data = {
            'username': user_data_response.get("login"),
            'email': user_data_response.get("email"),
            'first_name': user_data_response.get("first_name"),
            'last_name': user_data_response.get("last_name"),
            'avatar': user_data_response.get("image", {}).get("link"),
        }

        # 사용자 생성 또는 조회
        user, created = User.objects.get_or_create(
            username=user_data.get("username"),
            defaults=user_data
        )

        if not created:
            for field, value in user_data.items():
                setattr(user, field, value)
            user.save()

        # 2FA 확인 및 처리
        if user.two_factor:
            # OTP 코드 전송
            totp = pyotp.TOTP(user.otp_secret)
            otp_code = totp.now()
            send_mail(
                'Your 2FA Code',
                f'Your verification code is {otp_code}',
                'noreply@student.42seoul.kr',
                [user.email],
                fail_silently=False,
            )
            return Response({
                "message": "2FA code sent to your email. Please verify to complete login.",
                "username": user.username
            }, status=status.HTTP_200_OK)

        # 2FA가 비활성화된 경우에만 JWT 발급
        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "username": user.username,
            "email": user.email,
            "avatar": user.avatar,
        })


class VerifyToken(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        print(request.headers)
        print(request.data)
        token = request.headers.get('Authorization')
        if not token:
            raise AuthenticationFailed('Authorization token required')

        token = token.split()[1]

        try:
            decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = decoded_token['user_id']

            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                raise AuthenticationFailed('User not found')

            user_data = {"user_id": user.id, "username": user.username}
            return Response(user_data, status=status.HTTP_200_OK)

        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token expired')
        except jwt.InvalidTokenError:
            raise AuthenticationFailed('Invalid token')


# 2FA 코드 검증 및 JWT 발급
class Verify2FACodeView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get("username")
        otp_code = request.data.get("otp_code")

        if not otp_code or not username:
            return Response({"error": "Username and OTP code required."}, status=status.HTTP_401_UNAUTHORIZED)

        # 사용자 조회
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_401_UNAUTHORIZED)

        # OTP 코드 검증
        totp = pyotp.TOTP(user.otp_secret)
        if not totp.verify(otp_code):
            return Response({"error": "Invalid OTP code."}, status=status.HTTP_401_UNAUTHORIZED)

        # OTP 검증 성공 시 JWT 발급
        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }, status=status.HTTP_200_OK)


# 2FA 활성화/비활성화 토글
class Toggle2FAView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        enable_2fa = request.data.get("enable_2fa", True)

        if enable_2fa:
            user.two_factor = True
            if not user.otp_secret:
                user.otp_secret = pyotp.random_base32()
            message = "2FA enabled successfully."
        else:
            user.two_factor = False
            message = "2FA disabled successfully."

        user.save()
        return Response({"message": message}, status=status.HTTP_200_OK)
