import jwt
import redis
from datetime import datetime, timedelta
from django.conf import settings

redis_client = redis.StrictRedis(host=redis, port=6379, db=0)

# 로그인 상태 관리
def set_user_login(username):
    """
    사용자 로그인 상태를 Redis에 기록.
    """
    redis_client.set(f"user_login:{username}", "true")

def is_user_logged_in(username):
    """
    Redis에서 사용자 로그인 상태를 확인.
    """
    login_status = redis_client.get(f"user_login:{username}")
    return login_status == b"true"

def set_user_logout(username):
    """
    사용자 로그아웃 상태를 Redis에 기록.
    """
    redis_client.set(f"user_login:{username}", "false")


def generate_unique_display_name(display_name, model_class, field_name="display_name"):
    base_name = display_name
    counter = 1
    filter_kwargs = {}
    while True:
        filter_kwargs[field_name] = display_name
        if not model_class.objects.filter(**filter_kwargs).exists():
            break
        display_name = f"{base_name}{counter}"
        counter += 1
    return display_name


def generate_jwt(user, token_type="access"):
    """
    Generates a JWT for the given user and token_type.
    """
    if token_type == "access":
        expiration = datetime.utcnow() + settings.JWT_ACCESS_TOKEN_EXPIRES
    elif token_type == "refresh":
        expiration = datetime.utcnow() + settings.JWT_REFRESH_TOKEN_EXPIRES
    else:
        raise ValueError("Invalid token type")

    payload = {
        "user_id": user.id,
        "username": user.username,
        "exp": expiration,
        "type": token_type,
    }

    token = jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm="HS256")

    return token


def decode_jwt(token):
    """
    Decodes the given JWT and return the payload.
    """
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        print("Expired token")
        raise Exception("Token has expired")
    except jwt.InvalidTokenError:
        print("Invalid token")
        raise Exception("Invalid token")
