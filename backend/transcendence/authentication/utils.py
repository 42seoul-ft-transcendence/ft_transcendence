import jwt
from datetime import datetime, timedelta
from django.conf import settings


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

def avatar_url(avatar):
    if avatar:
        if avatar.name.startswith(('http://', 'https://', '/')):
            avatar_url = str(avatar)
        else:
            avatar_url = f"{settings.BASE_URL}{settings.MEDIA_URL}{avatar}"

            
    else:
        avatar_url = None
    return avatar_url