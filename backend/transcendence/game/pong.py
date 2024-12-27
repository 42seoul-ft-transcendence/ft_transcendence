import asyncio
import json
import uuid
import random

import redis.asyncio as redis
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Pong
from django.contrib.auth import get_user_model

User = get_user_model()

class PongGameConsumer(AsyncWebsocketConsumer):
    win_goal = 3
    redis_conn = redis.Redis(host='redis')
    frame_rate = 1 / 30

    async def connect(self):
        self.connected = True
        self.room_id = self.scope["url_route"]["kwargs"]["room_id"]
        self.player_id = str(self.scope["user"].id)

        self.players_key = f"{self.room_id}_players"

        self.board_width = 800
        self.board_height = 400
        self.ball = self.Ball(self.board_width // 2, self.board_height // 2, 5)
        self.player1 = self.Player(20, self.board_height // 2 - 50, 100)
        self.player2 = self.Player(self.board_width - 30, self.board_height // 2 - 50, 100)
        self.scores = {"player1": 0, "player2": 0}

        players = await self.redis_conn.lrange(self.players_key, 0, -1)
        if len(players) == 0:
            role = "player1"
            self.player1.player_id = self.player_id
            await self.redis_conn.rpush(self.players_key, self.player_id)
        elif len(players) == 1:
            self.player2.player_id = self.player_id
            role = "player2"
            await self.redis_conn.rpush(self.players_key, self.player_id)
        else:
            await self.close()
            return

        await self.channel_layer.group_add(self.room_id, self.channel_name)
        await self.accept()

        await self.send(
            text_data=json.dumps({
                "type": "assign_role",
                "role": role,
            })
        )

        if len(players) == 1:
            asyncio.create_task(self.game_loop())

    async def game_loop(self):
        while True:
            self.ball.update(self.board_height, self.player1, self.player2)

            if self.ball.x <= 0:
                self.scores["player2"] += 1
                self.reset_positions()
            elif self.ball.x >= self.board_width - self.ball.width:
                self.scores["player1"] += 1
                self.reset_positions()

            if self.scores["player1"] >= self.win_goal or self.scores["player2"] >= self.win_goal:
                winner = "player1" if self.scores["player1"] >= self.win_goal else "player2"
                await self.end_game(winner)
                break

            state = {
                "ball": {"x": self.ball.x, "y": self.ball.y},
                "player1": {"y": self.player1.y},
                "player2": {"y": self.player2.y},
                "scores": self.scores,
            }
            await self.channel_layer.group_send(
                self.room_id,
                {"type": "game.state", "state": state},
            )
            await asyncio.sleep(self.frame_rate)

    async def end_game(self, winner, forfeit=False):
        await self.channel_layer.group_send(
            self.room_id,
            {"type": "game.end", "winner": winner},
        )
        await self.save_game_result(winner, forfeit)

        await self.redis_conn.delete(self.players_key)
        await self.redis_conn.srem("rooms_list", self.room_id)

    async def save_game_result(self, winner, forfeit):
        try:
            pong_game = Pong.objects.create(
                id = str(uuid.uuid4()),
                host=User.objects.get(id=int(self.player1.player_id)),
                guest=User.objects.get(id=int(self.player2.player_id)),
                host_score=self.scores["player1"],
                guest_score=self.scores["player2"],
                # winner=User.objects.get(username=winner),
                winner=winner,
                status="FORFEIT" if forfeit else "COMPLETED",
            )
            pong_game.save()
        except Exception as e:
            print(f"Error saving game result: {e}")

    async def game_state(self, event):
        await self.channel_layer.group_send(text_data=json.dumps(event["state"]))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_id, self.channel_name)

        players = await self.redis_conn.lrange(self.players_key, 0, -1)
        if self.player_id.encode() in players:
            await self.redis_conn.lrem(self.players_key, 0, self.player_id)

        remaining_players = await self.redis_conn.lrange(self.players_key, 0, -1)
        if len(remaining_players) == 1:
            remaining_player_id = remaining_players[0].decode()
            if remaining_player_id == self.player1.player_id:
                winner = "player1"
                self.scores["player1"] = self.win_goal
                self.scores["player2"] = 0
            else:
                winner = "player2"
                self.scores["player1"] = 0
                self.scores["player2"] = self.win_goal

            await self.end_game(winner, forfeit=True)

        if len(remaining_players) == 0:
            await self.redis_conn.delete(self.players_key)
            await self.redis_conn.srem("rooms_list", self.room_id)

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            msg_type = data.get("type")

            if msg_type == "move":
                if data["player"] == "player1":
                    self.player1.velocity_y = data["direction"]
                elif data["player"] == "player2":
                    self.player2.velocity_y = data["direction"]
                # direction = data.get("direction")
                # player_id = data.get("player_id")
                # await self.handle_move(player_id, direction)
            # elif msg_type == "end_game":
            #     await self.end_game(data)
            else:
                await self.send(text_data=json.dumps({"error": "Invalid message type"}))
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({"error": "Invalid JSON format"}))

    def reset_positions(self):
        self.ball.x = self.board_width // 2
        self.ball.y = self.board_height // 2
        self.ball.velocity_x *= -1

    # async def handle_move(self, player_id, direction):
    #     await self.channel_layer.group_send(
    #         self.room_id,
    #         {
    #             "type": "game.update",
    #             "player_id": player_id,
    #             "direction": direction,
    #         },
    #     )

    # async def game_start(self, event):
    #     await self.send(
    #         text_data=json.dumps(
    #             {
    #                 "type": "game.start",
    #                 "host": event["host"].decode("utf-8"),
    #                 "guest": event["guest"].decode("utf-8"),
    #             }
    #         )
    #     )

    # async def game_update(self, event):
    #     await self.send(
    #         text_data=json.dumps(
    #             {
    #                 "type": "game.update",
    #                 "player_id": event["player_id"],
    #                 "direction": event["direction"],
    #             }
    #         )
    #     )

    # async def end_game(self, data):
    #     forfeit = data.get("forfeit")
    #     scores = data.get("scores")
    #
    #     await self.channel_layer.group_send(
    #         self.room_id,
    #         {
    #             "type": "game.end",
    #             "forfeit": forfeit,
    #             "scores": scores,
    #         },
    #     )

    #     self.save_game_result(data)
    #
    #     await self.redis_conn.delete(self.players_key)
    #     await self.redis_conn.delete(self.host_key)
    #     await self.redis_conn.delete(self.guest_key)
    #
    # async def game_end(self, event):
    #     await self.send(
    #         text_data=json.dumps(
    #             {
    #                 "type": "game.end",
    #             }
    #         )
    #     )

    class Ball:
        def __init__(self, x, y, velocity):
            self.x = x
            self.y = y
            self.width = 10
            self.height = 10
            self.velocity_x = velocity * (1 if random.random() > 0.5 else -1)
            self.velocity_y = velocity * (1 if random.random() > 0.5 else -1)

        def update(self, board_height, player1, player2):
            self.x += self.velocity_x
            self.y += self.velocity_y

            if self.y <= 0 or self.y + self.height >= board_height:
                self.velocity_y *= -1

            if self.detect_collision(player1):
                self.velocity_x = abs(self.velocity_x)
            elif self.detect_collision(player2):
                self.velocity_x = -abs(self.velocity_x)

        def detect_collision(self, player):
            return (
                    self.x < player.x + player.width
                    and self.x + self.width > player.x
                    and self.y < player.y + player.height
                    and self.y + self.height > player.y
            )

    class Player:
        def __init__(self, x, y, height):
            self.x = x
            self.y = y
            self.height = height
            self.width = 10
            self.velocity_y = 0

        def move(self):
            self.y += self.velocity_y
