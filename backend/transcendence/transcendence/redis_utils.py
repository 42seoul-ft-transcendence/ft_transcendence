import redis

redis_client = redis.StrictRedis(host='127.0.0.1', port=6379, db=0)

# 사용자 상태 관리
def set_user_status(username, status):
    """
    Redis에 사용자 상태 저장 (예: online, offline, in-game).
    """
    redis_client.set(f"user_status:{username}", status)

def get_user_status(username):
    """
    Redis에서 사용자 상태 조회.
    """
    status = redis_client.get(f"user_status:{username}")
    return status.decode("utf-8") if status else "offline"

def delete_user_status(username):
    """
    Redis에서 사용자 상태 삭제.
    """
    redis_client.delete(f"user_status:{username}")

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
