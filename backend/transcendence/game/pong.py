import asyncio
import json
import redis.asyncio as redis
from channels.generic.websocket import AsyncWebsocketConsumer


class Pong(AsyncWebsocketConsumer):
    win_goal = 5

    async def connect(self):
        self.connected = True
        self.redis = redis.Redis(host="redis")

        print("start connect")
        try:
            self.user = self.scope.get("user")
            if not self.user or self.user.is_anonymous:
                raise ValueError("Invalid user")

            self.room_id = await self.assign_room()
            print(room_id)

            await self.channel_layer.group_add(self.room_id, self.channel_name)
            await self.accept()

            print("accepted")
            if await self.redis.llen(f"room_{self.room_id}_players") == 2:
                await self.start_game()
        except Exception as e:
            await self.close()

    async def assign_room(self):
        """Assigns the user to an existing room or creates a new one."""
        print("start assign_room")
        rooms = await self.redis.keys("room_*_players")
        for room in rooms:
            if await self.redis.llen(room) < 2:
                await self.redis.rpush(room, self.user.id)
                print(user.id)
                print("assign_room")
                return room.decode('utf-8')
        new_room = f"room_{self.user.id}"
        await self.redis.rpush(f"room_{new_room}_players", self.user.id)
        return new_room

    async def start_game(self):
        """Start the game when 2 players are connected."""
        print("start game") 
        players = await self.redis.lrange(f"room_{self.room_id}_players", 0, -1)
        self.scores = {player.decode('utf-8'): 0 for player in players}
        await self.send_message("group", "game_start", {"players": players})

    async def disconnect(self, close_code):
        self.connected = False
        await self.redis.lrem(f"room_{self.room_id}_players", 0, self.user.id)

        players_left = await self.redis.llen(f"room_{self.room_id}_players")
        if players_left == 0:
            await self.redis.delete(f"room_{self.room_id}_players")
        elif players_left == 1:
            remaining_player = await self.redis.lrange(f"room_{self.room_id}_players", 0, -1)
            await self.send_message("group", "game_stop", {"winner": remaining_player[0].decode('utf-8')})

        await self.channel_layer.group_discard(self.room_id, self.channel_name)
        await self.redis.close()

    async def receive(self, text_data):
        data = json.loads(text_data)
        msg_type = data.get("type")

        if msg_type == "game_move":
            await self.send_message("group", "game_move", data)

    async def loop(self):
        fps = 0.033
        self.reset_game()
        while True:
            try:
                self.ball.move()
                await self.handle_collisions()
                winner = self.check_winner()
                if winner:
                    await self.send_message("group", "game_stop", {"winner": winner})
                    break
                await self.send_game_state()
                await asyncio.sleep(fps)
            except Exception as e:
                print(f"Unexpected error in the loop from game {self.room_id}: {str(e)}")
                break

    def check_winner(self):
        for player, score in self.scores.items():
            if score >= self.win_goal:
                return player
        return None

    async def handle_collisions(self):
        if self.ball.y - self.ball.radius / 2 <= 0 or self.ball.y + self.ball.radius / 2 >= 1:
            self.ball.revert_velocity(1)
        elif self.check_pad_collision():
            self.ball.revert_velocity(0)
        elif self.ball.x + self.ball.radius / 2 <= 0:
            await self.score_point(self.pad_2_id)
        elif self.ball.x - self.ball.radius / 2 >= 1:
            await self.score_point(self.pad_1_id)

    def check_pad_collision(self):
        if self.ball.x - self.ball.radius <= 0.1 and self.pad_1.y <= self.ball.y <= self.pad_1.y + self.pad_1.height:
            return True
        if self.ball.x + self.ball.radius >= 0.9 and self.pad_2.y <= self.ball.y <= self.pad_2.y + self.pad_2.height:
            return True
        return False

    async def score_point(self, player_id):
        self.scores[player_id] += 1
        self.reset_game()

    def reset_game(self):
        self.ball.reset()
        self.pad_1.reset()
        self.pad_2.reset()

    async def send_message(self, destination="client", msg_type="", args={}):
        message = {"type": msg_type, "content": args} if msg_type else args
        if destination == "group":
            await self.channel_layer.group_send(self.room_id, message)
        elif destination == "client":
            await self.send(text_data=json.dumps(message))

    async def send_game_state(self):
        await self.send_message(
            "group",
            "game_state",
            {
                "scores": self.scores,
                "ball": self.ball.__dict__,
                "pad_1": self.pad_1.__dict__,
                "pad_2": self.pad_2.__dict__,
            },
        )

    class Ball:
        def __init__(self, radius=0.015):
            self.radius = radius
            self.reset()

        def reset(self):
            self.x = 0.5
            self.y = 0.5
            self.velocity = [0.01, 0.01]

        def move(self):
            self.x += self.velocity[0]
            self.y += self.velocity[1]

        def revert_velocity(self, index):
            self.velocity[index] *= -1

    class Pad:
        def __init__(self, y=0.4, height=0.2):
            self.y = y
            self.height = height

        def reset(self):
            self.y = 0.4
