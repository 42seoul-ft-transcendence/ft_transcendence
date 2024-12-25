
import requests
import pyotp
import qrcode
import json
from io import BytesIO
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views import View
from django.shortcuts import redirect
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponse
from django.conf import settings
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .utils import generate_jwt, decode_jwt
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

User = get_user_model()

# for debug
from django.shortcuts import render
class LoginPageView(View):
    def get(self, request):
        return render(request, 'authentication.html')

class LogoutView(View):
    def get(self, request):
        user = request.user

        if user.is_authenticated:
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                "online",
                {
                    "type": "user.disconnect",
                    "user_id": user.id,
                }
            )

            response = JsonResponse({'message': 'Logout successful'})
            response.delete_cookie("access_token")
            response.delete_cookie("refresh_token")
            logout(request)

            return response

        return JsonResponse({'error': 'User is not authenticated'}, status=401)


class LandingPageView(View):
    def get(self, request):
        """
        사용자의 인증 상태를 반환하는 API.
        """
        token = request.COOKIES.get("access_token")
        if token:
            try:
                payload = decode_jwt(token)
                return JsonResponse({"authenticated": True, "redirect": "/"})
            except Exception:
                return JsonResponse({"authenticated": False, "redirect": "/login/"})
        else:
            return JsonResponse({"authenticated": False, "redirect": "/login/"})


class OauthRedirect(View):
    def get(self, request):
        url = (
            f"https://api.intra.42.fr/oauth/authorize?"
            f"client_id={settings.CLIENT_ID}&redirect_uri={settings.REDIRECT_URI}&response_type=code"
        )

        # response = HttpResponseRedirect(url)
        # response['custom-header'] = 'custom-header-value'
        # return response
        return redirect(url)


class OauthCallbackView(View):
    token_url = "https://api.intra.42.fr/oauth/token"
    user_info_url = "https://api.intra.42.fr/v2/me"

    def get(self, request):
        code = request.GET.get("code")
        if not code:
            # FE url
            return JsonResponse({'error': 'Authorization code not provided'}, status=400)

        try:
            # 토큰 요청 및 처리
            token_data = self.fetch_tokens(code)
            access_token = token_data.get("access_token")


            # 사용자 정보 가져오기
            user_info = self.fetch_user_info(access_token)
            user = self.get_or_create_user(user_info)

            # 2FA
            if user.two_factor:
                # QR 제공
                return self.handle_2fa(user)

            # JWT 생성
            response_data = self.generate_jwt_tokens(user)

            response = JsonResponse({
                "message": "Login successful",
                "websocket_url": "wss://localhost:4443/ws/login_status/",
                "access_token": response_data["access_token"],
                "refresh_token": response_data["refresh_token"],
            })
            self.set_cookies(response, response_data)
            login(request, user)
            return response

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)


    def set_cookies(self, response, response_data):
        response.set_cookie(
            key="access_token",
            value=response_data["access_token"],
            httponly=True, # JS 접근불가
            secure=True, # HTTPS
            samesite="Strict", # CSRF 방지
        )
        response.set_cookie(
            key="refresh_token",
            value=response_data["refresh_token"],
            httponly=True,
            secure=True,
            samesite="Strict",
        )


    def fetch_tokens(self, code):
        """
        인증 코드를 사용하여 42 API에서 토큰을 가져옵니다.
        """
        print(f"Code: {code}")
        response = requests.post(
            self.token_url,
            data={
                "grant_type": "authorization_code",
                "client_id": settings.CLIENT_ID,
                "client_secret": settings.CLIENT_SECRET,
                "redirect_uri": settings.REDIRECT_URI,
                "code": code,
            },
        )
        if response.status_code != 200:
            raise Exception("Failed to get tokens from 42.")
        return response.json()

    def fetch_user_info(self, access_token):
        """
        Access Token을 사용해 42 API에서 사용자 정보를 가져옵니다.
        """
        headers = {"Authorization": f"Bearer {access_token}"}
        response = requests.get(self.user_info_url, headers=headers)
        if response.status_code != 200:
            raise Exception("Failed to fetch user info.")
        return response.json()

    def get_or_create_user(self, user_info):
        """
        42 사용자 정보를 사용하여 Django 사용자 모델에서 조회하거나 새로 생성합니다.
        """
        username = user_info.get("login")
        email = user_info.get("email")
        avatar = user_info.get("image").get("link")

        user, created = User.objects.get_or_create(
            username=username,
            defaults={"email": email, "avatar": avatar}
        )

        # 기존 사용자 업데이트
        # if not created:
        #     for field, value in {"email": email, "avatar": avatar}.items():
        #         setattr(user, field, value)
        #     user.save()

        return user

    def generate_jwt_tokens(self, user):
        """
        사용자 정보를 바탕으로 Access 및 Refresh 토큰을 생성합니다.
        """
        access_token = generate_jwt(user, "access")
        refresh_token = generate_jwt(user, "refresh")

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
        }

    def handle_2fa(self, user):
        """
        2FA 활성화된 사용자에게 QR or OTP 요청
        """
        if not user.otp_secret:
            user.otp_secret = pyotp.random_base32()
            user.save()

        totp = pyotp.TOTP(user.otp_secret)
        qr_url = totp.provisioning_uri(user.username, issuer_name="Transcendence")

        qr = qrcode.make(qr_url)
        buffer = BytesIO()
        qr.save(buffer, format='PNG')
        buffer.seek(0)

        print(buffer)
        return HttpResponse(buffer, content_type="image/png")


@method_decorator(csrf_exempt, name='dispatch')
class Verify2FAView(View):
    def get(self, request):
        return render(request, 'authentication.html')

    def post(self, request):
        print(request.user)
        print(request.body)
        try:
            data = json.loads(request.body)
            username = request.user.username
            otp_code = data.get("otp_code")
        except json.JSONDecodeError:
            return HttpResponseBadRequest("Invalid JSON.")
        
        print(otp_code)
        print(username)

        if not username or not otp_code:
            return HttpResponseBadRequest("Username and OTP code are required.")

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return HttpResponseBadRequest("User not found.")

        totp = pyotp.TOTP(user.otp_secret)
        if not totp.verify(otp_code):
            return HttpResponseBadRequest("Invalid OTP code.")

        response_data = self.generate_jwt_tokens(user)

        response = JsonResponse({"message": "Login successful"})
        response.set_cookie(
            key="access_token",
            value=response_data["access_token"],
            httponly=True,
            secure=True,
            samesite="Lax",
        )
        response.set_cookie(
            key="refresh_token",
            value=response_data["refresh_token"],
            httponly=True,
            secure=True,
            samesite="Lax",
        )
        return response

    def generate_jwt_tokens(self, user):
        access_token = generate_jwt(user, "access")
        refresh_token = generate_jwt(user, "refresh")

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
        }


@method_decorator(csrf_exempt, name='dispatch')
class Toggle2FAView(View):
    def post(self, request):
        user = request.user
        two_factor = user.two_factor

        if not two_factor:
            if not user.otp_secret:
                temp = pyotp.random_base32()
                print(temp)
                user.otp_secret = temp
            user.two_factor = True
            message = "2FA enabled"
        else:
            user.two_factor = False
            message = "2FA disabled"

        user.save()

        return JsonResponse({"message": message, "two_factor": user.two_factor}, status=200)

class RefreshTokenView(View):
    def post(self, request):
        refresh_token = request.POST.get("refresh_token")
        if not refresh_token:
            return JsonResponse({"error": "Refresh token is required."}, status=400)

        try:
            payload = decode_jwt(refresh_token)
            if payload.get("type") != "refresh":
                return JsonResponse({"error": "Invalid token type."}, status=400)

            user_id = payload.get("user_id")
            user = User.objects.get(id=user_id)

            # 새로운 access_token 생성
            access_token = generate_jwt(user, "access")
            response = JsonResponse({"message": "Access token refreshed"})
            response.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                secure=True,
                samesite="Strict",
            )
            return response
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

class UpdateStatusMessageView(LoginRequiredMixin, View):
    def post(self, request):
        status_message = request.POST.get("status_message", "").strip()
        user = request.user
        user.status_message = status_message
        user.save()

        return JsonResponse({"message": "status message updated.", "status_message": status_message})