import redis

redis_client = redis.StrictRedis(host="redis", port=6379, db=0)

QUEUE_KEY = "game_queue"

def add_to_queue(user_id):
    """
    Add a user to the game queue.
    """
    redis_client.rpush(QUEUE_KEY, user_id)

def remove_from_queue(user_id):
    """
    Remove a user from the game queue.
    """
    redis_client.lrem(QUEUE_KEY, 0, user_id)

def get_next_players():
    """
    Get the next two players from the queue.
    """
    if redis_client.llen(QUEUE_KEY) >= 2:
        return redis_client.lpop(QUEUE_KEY), redis_client.lpop(QUEUE_KEY)
    return None, None
