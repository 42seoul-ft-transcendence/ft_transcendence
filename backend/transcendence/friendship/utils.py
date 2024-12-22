import redis

redis_client = redis.StrictRedis(host=redis, port=6379, db=0)


def add_friend_to_redis(user_id, friend_id):
    redis_client.sadd(f"user:{user_id}:friends", friend_id)

def remove_friend_from_redis(user_id, friend_id):
    redis_client.srem(f"user:{user_id}:friends", friend_id)