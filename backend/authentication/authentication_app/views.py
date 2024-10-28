import requests
from django.conf import settings
from django.shortcuts import redirect
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "message": "User registered successfully."
        }, status=status.HTTP_201_CREATED)

class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }, status=status.HTTP_200_OK)


class FortyTwoOAuthRedirect(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        # 42 로그인 페이지로 리다이렉트
        url = f"https://api.intra.42.fr/oauth/authorize?client_id={settings.CLIENT_ID}&redirect_uri={settings.REDIRECT_URI}&response_type=code"
        return redirect(url)


class FortyTwoOAuthCallback(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        # 콜백에서 받은 코드
        code = request.GET.get("code")
        if not code:
            return Response({"error": "No code provided"}, status=400)

        # 토큰 요청
        token_response = requests.post("https://api.intra.42.fr/oauth/token", data={
            "grant_type": "authorization_code",
            "client_id": settings.CLIENT_ID,
            "client_secret": settings.CLIENT_SECRET,
            "code": code,
            "redirect_uri": settings.REDIRECT_URI,
        }, headers={"Content-Type": "application/x-www-form-urlencoded"})

        token_data = token_response.json()

        access_token = token_data.get("access_token")
        if not access_token:
            return Response({"error": "Failed to obtain access token", "details": token_data}, status=400)

        # 사용자 정보 요청
        user_data_response = requests.get(
            "https://api.intra.42.fr/v2/me",
            headers={"Authorization": f"Bearer {access_token}"}
        ).json()

        # 사용자 정보 저장 및 로그인 처리
        username = user_data_response.get("login")
        email = user_data_response.get("email")

        # 사용자 생성 또는 조회
        user, created = User.objects.get_or_create(username=username, defaults={"email": email})

        # JWT 토큰 발급
        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "username": user.username,
            "email": user.email,
        })