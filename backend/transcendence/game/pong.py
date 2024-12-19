import asyncio
import json
import random
import redis.asyncio as redis
import logging
from typing import Any, List
from urllib.parse import parse_qs
from asgiref.sync import sync_to_async
from django.contrib.auth import get_user_model
from django.apps import apps
from channels.generic.websocket import AsyncWebsocketConsumer

logger = logging.getLogger(__name__)


class Pong(AsyncWebsocketConsumer):
    win_goal = 5

    async def connect(self):
        self.connected = True
        self.redis = redis.Redis(host="redis")

        try:
            self.user = self.scope.get("user")
            if type(self.user) != get_user_model and self.user.is_anonymous:
                raise ValueError("Invalid user")
            else:
                logger.info(f"User {self.user.id} is attempting to connect.")

            await self.initialize_game()
        except Exception as e:
            logger.warning(f"Connection refused: {str(e)}")
            await self.close()
            return

        await self.accept()
        await self.channel_layer.group_add(self.room_id, self.channel_name)
        self.valid = True
        logger.info(
            f"User {self.user.id} successfully connected to room {self.room_id}."
        )
        await self.send_message(
            "group",
            "game_join",
            {"id": self.user.id, "username": self.user.username},
        )
        await self.send_message(
            "client", "game_pad", {"game_pad": self.pad_n, "host": self.host}
        )
        if self.is_tournament_game:
            await self.send_message(
                "client",
                "tournament_name",
                {"tournament_name": self.tournament_name},
            )

    async def initialize_game(self):
        query_params = parse_qs(self.scope["query_string"].decode())
        self.room_id = self.check_missing_param(query_params, "room_id")
        self.mode = self.check_missing_param(query_params, "mode")
        player_needed = self.check_missing_param(query_params, "player_needed")
        self.tournament_name = self.check_missing_param(
            query_params, "tournament_name"
        )
        self.is_tournament_game = self.tournament_name != "0"
        white_list = await self.get_decoded_list(
            f"pong_{self.room_id}_white_list"
        )

        if self.is_tournament_game and self.user.username not in white_list:
            raise ConnectionRefusedError("User not in white list")

        self.power = query_params.get("power", ["False"])[0] == "True"
        self.host = await self.redis.get(self.room_id) == None
        self.pad_n = "pad_1" if self.host else "pad_2"
        players = await self.redis.lrange(f"pong_{self.room_id}_id", 0, -1)

        if self.host:
            await self.redis.set(self.room_id, 1)
            self.info = self.Info(
                creator=self.user.id,
                room_id=self.room_id,
                player_needed=int(player_needed),
            )
            self.ball = self.Ball(color="black", power_on=self.power)
            self.pad_1 = self.Pad(True, color="#FECACA")
            self.pad_2 = self.Pad(False, color="#00beef")
            logger.info(
                f"User {self.user.id} is the host for room {self.room_id}."
            )
        else:
            if str(self.user.id).encode("utf-8") in players:
                raise ConnectionRefusedError(
                    "User already connected to the room"
                )
            if len(players) == 2:
                raise ConnectionRefusedError("Room is full")

        await self.redis.rpush(f"pong_{self.room_id}_id", self.user.id)

    async def disconnect(self, close_code):
        self.connected = False

        if hasattr(self, "host") and self.host:
            players = await self.redis.lrange(f"pong_{self.room_id}_id", 0, -1)

            if hasattr(self, "game_task"):
                self.game_task.cancel()

            await self.redis.delete(self.room_id)
            await self.redis.delete(f"pong_{self.room_id}_id")
            await self.redis.delete(f"pong_{self.room_id}_white_list")
            logger.info(f"Room {self.room_id} has been closed by the host.")

            if self.mode == "online" and len(players) == 2:
                if not hasattr(self, "winner"):
                    self.punish_coward(self.info.creator)
                await self.save_pong_to_db(self.winner)

        if hasattr(self, "valid"):
            await self.send_message(
                "group", "game_stop", {"user": self.user.id}
            )
            await self.channel_layer.group_discard(
                self.room_id, self.channel_name
            )

        await self.redis.close()
        logger.info(f"User {self.scope['user'].id} has disconnected.")

    async def receive(self, text_data):
        data = json.loads(text_data)

        try:
            msg_type = data.get("type")
            if not msg_type:
                raise AttributeError("Missing 'type'")
            if "content" not in data:
                raise AttributeError("Missing 'content'")

            logger.debug(
                f"Received '{msg_type}' message from user {self.scope['user'].id}."
            )
            match msg_type:
                case "game_stop":
                    await self.close()
                case "game_ready":
                    await self.send_message("group", args=data)
                case "game_move":
                    await self.send_message("group", args=data)
                case "toggle_power":
                    self.power = data["content"]["power"]
                case _:
                    raise ValueError("Unknown 'type' in data")
        except Exception as e:
            logger.warning(
                f"Invalid message received from user {self.scope['user'].id}: {str(e)}"
            )
            await self.send_error("Invalid message")

    async def game_join(self, event):
        if self.host:
            self.info.players_ids.append(event["content"]["id"])

            if self.mode == "online":
                self.info.players_usernames.append(
                    event["content"]["username"]
                )
            elif len(self.info.players_usernames) == 0:
                self.info.players_usernames.append("1")
                self.info.players_usernames.append("2")

            if len(self.info.players_ids) == self.info.player_needed:
                await self.redis.set(self.room_id, 1)

    async def game_ready(self, event):
        if self.host:
            self.info.player_ready += 1
            if self.info.player_ready == self.info.player_needed:
                await self.send_message("group", "game_start")

    async def game_start(self, event):
        await self.send_message("client", args=event)
        if self.host:
            self.game_task = asyncio.create_task(self.loop())

    async def game_state(self, event):
        await self.send_message("client", args=event)

    async def game_move(self, event):
        if self.host:
            try:
                if event["content"].get("pad_n") == None:
                    raise AttributeError("Missing 'pad_n'")
                if event["content"].get("direction") == None:
                    raise AttributeError("Missing 'direction'")
                await self.move_pad(
                    event["content"]["pad_n"], event["content"]["direction"]
                )
            except AssertionError as e:
                logger.warning(
                    f"Invalid game_move received in {self.room_id}: {str(e)}"
                )

    async def game_stop(self, event):
        if not self.connected:
            return
        if self.host:
            self.winner = event["content"].get("winner")
            if not self.winner:
                self.punish_coward(event["content"].get("user"))
        await self.send_message("client", args=event)
        await self.close()

    def punish_coward(self, coward):
        if not coward:
            return
        if coward is self.info.players_ids[0]:
            self.info.score[1] = self.win_goal
        else:
            self.info.score[0] = self.win_goal
        self.winner = self.get_winner()

    async def loop(self):
        fps = 0.033
        self.reset_game()
        while True:
            try:
                self.ball.move()
                await self.handle_collisions()
                if (
                    self.info.score[0] == self.win_goal
                    or self.info.score[1] == self.win_goal
                ):
                    winner = self.get_winner()
                    if self.mode == "online":
                        winner = (
                            self.info.players_usernames[0]
                            if self.info.players_ids[0] == self.get_winner()
                            else self.info.players_usernames[1]
                        )
                    await self.send_message(
                        "group",
                        "game_stop",
                        {"winner": winner},
                    )
                    break
                await self.send_game_state()
                await asyncio.sleep(fps)
            except Exception as e:
                logger.error(
                    f"Unexpected error in the loop from game {self.room_id}: {str(e)}"
                )
                break

    def get_winner(self):
        if self.mode == "online":
            return (
                self.info.players_ids[0]
                if self.info.score[0] > self.info.score[1]
                else self.info.players_ids[1]
            )
        else:
            return "1" if self.info.score[0] > self.info.score[1] else "2"

    async def move_pad(self, pad_number, direction):
        pad = self.pad_1 if pad_number == "pad_1" else self.pad_2
        step = pad.step if direction == "down" else -pad.step
        pad.y = min(max(pad.y + step, 0), 1 - pad.height)
        await self.send_game_state()

    async def handle_collisions(self):
        if (
            self.ball.y - self.ball.radius / 2 <= 0
            or self.ball.y + self.ball.radius / 2 >= 1
        ):
            self.ball.revert_velocity(1)
        elif self.check_pad_collision():
            self.ball.revert_velocity(0)
            if self.ball.x < 0.5:
                self.ball.x = self.pad_1.width + self.ball.radius / 2
            else:
                self.ball.x = 1 - self.pad_2.width - self.ball.radius / 2
        elif self.ball.x + self.ball.radius / 2 <= self.pad_1.width:
            await self.score_point(1)
        elif self.ball.x - self.ball.radius / 2 >= 1 - self.pad_2.width:
            await self.score_point(0)

    def check_pad_collision(self):
        if self.ball.x - self.ball.radius <= self.pad_1.width:
            if self.pad_1.y <= self.ball.y <= self.pad_1.y + self.pad_1.height:
                self.check_power_up(self.pad_1)
                return True
        if self.ball.x + self.ball.radius >= 1 - self.pad_2.width:
            if self.pad_2.y <= self.ball.y <= self.pad_2.y + self.pad_2.height:
                self.check_power_up(self.pad_2)
                return True
        return False

    def check_power_up(self, pad):
        if self.power == False:
            return

        pad.combo += 1

        if pad.combo >= 2 and pad.height < 0.4:
            pad.height += 0.05

    async def score_point(self, winner: int):
        self.info.score[winner] += 1
        self.reset_game()

    def reset_game(self):
        self.ball.reset()
        self.pad_1.reset()
        self.pad_2.reset()

    async def send_message(self, destination="client", msg_type="", args={}):
        message = {"type": msg_type, "content": args} if msg_type else args
        try:
            if destination == "group":
                await self.channel_layer.group_send(self.room_id, message)
            elif destination == "client":
                await self.send(text_data=json.dumps(message))
        except Exception as e:
            logger.error(f"Error when sending message: {str(e)}")

    async def send_error(self, error: str):
        await self.send_message("client", "game_error", {"error": error})

    async def send_game_state(self):
        await self.send_message(
            "group",
            "game_state",
            {
                "score": self.info.score,
                "ball": self.ball.__dict__,
                "pad_1": self.pad_1.__dict__,
                "pad_2": self.pad_2.__dict__,
                "players": self.info.players_usernames,
            },
        )

    async def save_pong_to_db(self, winner):
        pong = apps.get_model("games", "Pong")
        try:
            await sync_to_async(pong.objects.create)(
                user1=await sync_to_async(get_user_model().objects.get)(
                    id=self.info.players_ids[0]
                ),
                user2=await sync_to_async(get_user_model().objects.get)(
                    id=self.info.players_ids[1]
                ),
                score1=self.info.score[0],
                score2=self.info.score[1],
                uuid=self.room_id,
            )
            logger.debug(f"Game {self.room_id} saved to db.")
        except Exception as e:
            logger.error(f"Could not save game {self.room_id} to db: {str(e)}")

    def check_missing_param(
        self, query_params: dict[Any, List], param_name: str
    ):
        param = query_params.get(param_name, [None])[0]
        if param == None:
            raise AttributeError(f"Missing query parameter: {param_name}")
        else:
            return param

    async def get_decoded_list(self, name):
        l = await self.redis.lrange(name, 0, -1)
        decoded_list = [el.decode("utf-8") for el in l]
        return decoded_list

    class Info:
        def __init__(
            self,
            creator: str,
            room_id: str,
            player_needed: int,
        ):
            self.creator = creator
            self.room_id = room_id
            self.players_ids = []
            self.players_usernames = []
            self.player_needed = player_needed
            self.player_ready = 0
            self.score = [0, 0]

    class Ball:
        def __init__(self, radius=0.015, color="white", power_on=False):
            self.color = color
            self.limit = 250 if power_on else 50
            self.reset(radius=radius)

        def reset(self, radius=0.015):
            self.x = 0.5
            self.y = random.uniform(0.2, 0.8)
            self.radius = radius
            self.velocity = self.randomize_velocity()
            self.step = 0.05
            self.combo = 0

        def randomize_velocity(self) -> List[float]:
            speed = 0.01
            velocity = [speed, speed]
            if random.randint(0, 1):
                velocity[0] *= -1
            if random.randint(0, 1):
                velocity[1] *= -1
            return velocity

        def revert_velocity(self, index):
            self.velocity[index] = -self.velocity[index]
            self.combo += 1

            if self.combo < self.limit:
                self.velocity[index] *= 1.05

        def move(self):
            self.x += self.velocity[0]
            self.y += self.velocity[1]

    class Pad:
        def __init__(self, left, width=0.02, height=0.2, color="white"):
            self.left = left
            self.color = color
            self.reset(width=width, height=height)

        def reset(self, width=0.02, height=0.2):
            self.width = width
            self.height = height
            self.x = 0 if self.left else 1 - self.width
            self.y = 0.4
            self.step = 0.05
            self.move = 0
            self.combo = 0