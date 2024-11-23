# friendship/utils.py
import requests
from rest_framework.authentication import BaseAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication as BaseJWTAuthentication
from rest_framework import exceptions
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.contrib.auth.models import AnonymousUser


class SimpleUser:
    def __init__(self, user_id):
        self.id = user_id
        self.is_authenticated = True

# class JWTAuthentication(BaseJWTAuthentication):
#     def authenticate(self, request):
#         print("JWT AUTH")
#         header = self.get_header(request)
#         if header is None:
#             return None
#
#         raw_token = self.get_raw_token(header)
#         if raw_token is None:
#             return None
#
#         validated_token = self.get_validated_token(raw_token)
#         user = self.get_user(validated_token)
#
#         if user is None:
#             raise exceptions.AuthenticationFailed('User not found', code='user_not_found')
#
#         # 토큰에서 사용자 정보 추출
#         user_id = validated_token.get('user_id')
#         if not user_id:
#             raise exceptions.AuthenticationFailed('User ID not found in token', code='user_not_found')
#
#         # 사용자 객체 대신 사용자 ID를 반환
#         return user, validated_token

class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        header = request.headers.get('Authorization')
        if not header:
            return None

        try:
            prefix, token = header.split(' ')
            if prefix != 'Bearer':
                raise exceptions.AuthenticationFailed('Invalid token prefix')
        except ValueError:
            raise exceptions.AuthenticationFailed('Invalid token header')

        try:
            validated_token = UntypedToken(token)
        except TokenError as e:
            raise exceptions.AuthenticationFailed(str(e))

        user_id = validated_token.get('user_id')
        if not user_id:
            raise exceptions.AuthenticationFailed('User ID not found in token')

        user = SimpleUser(user_id)
        return user, validated_token
