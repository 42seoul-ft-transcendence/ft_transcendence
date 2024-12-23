import json
import random
from uuid import uuid4
import redis.asyncio as redis
from typing import Final, List, Tuple
from urllib.parse import parse_qs
from asgiref.sync import sync_to_async
from django.contrib.auth import get_user_model
from django.apps import apps
from channels.generic.websocket import AsyncWebsocketConsumer



class Tournament(AsyncWebsocketConsumer):
    GROUP: Final[str] = "group"
    CLIENT: Final[str] = "client"

    async def connect(self):
        query_params = parse_qs(self.scope["query_string"].decode())
        self.redis = redis.Redis(host="redis")

        try:
            self.user = self.scope.get("user")

            if type(self.user) != get_user_model and self.user.is_anonymous:
                raise ValueError("Invalid user")

            self.name = query_params.get("name", [None])[0]

            if self.name == None:
                raise ValueError("Missing name")

            lock = await self.redis.get(f"pong_{self.name}_lock")
            players = await self.get_decoded_list(
                f"pong_{self.name}_usernames"
            )

            if lock != None and self.user.username not in players:
                raise ConnectionRefusedError("Tournament is locked")

        except Exception as e:
            await self.close()
            return

        await self.accept()
        await self.channel_layer.group_add(self.name, self.channel_name)
        creator_encoded = await self.redis.get(f"pong_{self.name}_creator")

        if creator_encoded == None:
            await self.redis.set(
                f"pong_{self.name}_creator", self.user.username
            )
            creator_encoded = await self.redis.get(f"pong_{self.name}_creator")

        creator = creator_encoded.decode("utf-8")

        if creator == self.user.username and lock == None:
            await self.send_message(self.CLIENT, {"type": "unlock_lock"})

        if self.user.username not in players:
            await self.redis.rpush(
                f"pong_{self.name}_usernames", self.user.username
            )
            await self.redis.rpush(
                f"pong_{self.name}_players", self.user.username
            )

        await self.send_message(self.GROUP, {"type": "join"})

        if lock:
            await self.archive()
            await self.check_current_games_state()
            await self.send_play_elements()

    async def disconnect(self, close_code):
        try:
            creator_encoded = await self.redis.get(f"pong_{self.name}_creator")
            creator = creator_encoded.decode("utf-8")

            if (
                hasattr(self, "end_tournament")
                and creator == self.user.username
            ):
                await self.redis.delete(f"pong_{self.name}_lock")
                await self.redis.delete(f"pong_{self.name}_play")
                await self.redis.delete(f"pong_{self.name}_creator")
                await self.redis.delete(f"pong_{self.name}_players")
                await self.redis.delete(f"pong_{self.name}_usernames")
                await self.redis.delete(f"pong_{self.name}_current_games")
                await self.redis.delete(f"pong_{self.name}_player_pairs")
                await self.redis.delete(f"pong_{self.name}_history")
                await self.redis.delete(f"pong_{self.name}_history_ids")
                await self.redis.delete(f"pong_{self.name}_ready_players")
        except AttributeError as e:
            print(e)

        await self.channel_layer.group_discard(self.name, self.channel_name)
        await self.redis.close()

    async def receive(self, text_data):
        data = json.loads(text_data)

        try:
            msg_type = data.get("type")

            if not msg_type:
                raise AttributeError("Missing 'type'")

            msg_type = data.get("type")
            if not msg_type:
                raise AttributeError("Missing 'type'")

            if msg_type == "lock":
                await self.lock()
            elif msg_type == "ready":
                await self.ready()
            elif msg_type == "play":
                await self.play()
            else:
                raise ValueError("Unknown 'type' in data")
        except Exception as e:
            await self.send(self.CLIENT, {"type": "error", "content": str(e)})

    async def join(self, event):
        await self.send_message(
            self.CLIENT,
            {
                "type": "join",
                "players": await self.get_decoded_list(
                    f"pong_{self.name}_usernames"
                ),
            },
        )

    async def lock(self):
        await self.redis.set(f"pong_{self.name}_lock", 1)
        await self.redis.copy(
            f"pong_{self.name}_players",
            f"pong_{self.name}_ready_players",
            replace=True,
        )
        await self.send_message(self.GROUP, {"type": "unlock_ready"})

    async def unlock_ready(self, event):
        ready_players = await self.get_decoded_list(
            f"pong_{self.name}_ready_players"
        )
        if self.user.username in ready_players:
            await self.send_message(self.CLIENT, {"type": "unlock_ready"})

    async def ready(self):
        await self.redis.lrem(
            f"pong_{self.name}_ready_players", 1, self.user.username
        )
        ready_players = await self.get_decoded_list(
            f"pong_{self.name}_ready_players"
        )

        if len(ready_players) <= 0:
            await self.send_message(self.GROUP, {"type": "exec_mix"})

    async def exec_mix(self, event):
        if await self.redis.get(
            f"pong_{self.name}_creator"
        ) == self.user.username.encode("utf-8"):
            await self.mix()

    async def mix(self):
        players = await self.get_decoded_list(f"pong_{self.name}_players")
        random.shuffle(players)
        player_pairs = []
        last_player = None

        if len(players) % 2 != 0:
            last_player = players.pop()

        for i in range(0, len(players), 2):
            player_pairs.append((players[i], players[i + 1]))
            await self.redis.rpush(
                f"pong_{self.name}_current_games", str(uuid4())
            )

        if last_player:
            player_pairs.append((last_player, "-"))
            players.append(last_player)

        await self.redis.set(
            f"pong_{self.name}_player_pairs", json.dumps(player_pairs)
        )
        await self.redis.set(f"pong_{self.name}_play", 1)
        await self.send_message(
            self.GROUP,
            {
                "type": "send_play_elements",
            },
        )
        await self.send_ids_to_general()

    async def send_play_elements(self, event=None):
        player_pairs = await self.redis.get(f"pong_{self.name}_player_pairs")
        play = await self.redis.get(f"pong_{self.name}_play")
        players = await self.get_decoded_list(f"pong_{self.name}_players")
        block_send = False

        if player_pairs:
            json_list = json.loads(player_pairs)
            await self.send_message(
                self.CLIENT,
                {
                    "type": "player_pairs",
                    "player_pairs": json_list,
                },
            )

            for sublist in json_list:
                if self.user.username in sublist:
                    if sublist[1] == "-":
                        block_send = True
                    break

        if (
            self.user.username in players
            and play != None
            and int(play.decode("utf-8")) == 1
            and block_send == False
        ):
            await self.send_message(self.CLIENT, {"type": "unlock_play"})

    async def send_ids_to_general(self):
        group_name = "chat_general"
        player_pairs = json.loads(
            await self.redis.get(f"pong_{self.name}_player_pairs")
        )
        uuid_list = await self.get_decoded_list(
            f"pong_{self.name}_current_games"
        )

        for i, (player1, player2) in enumerate(player_pairs):
            message = f"[{self.name}] - {player1} x {player2}"

            if player2 != "-":
                await self.redis.rpush(
                    f"pong_{uuid_list[i]}_white_list", player1
                )
                await self.redis.rpush(
                    f"pong_{uuid_list[i]}_white_list", player2
                )
                message = f"{message}\n{uuid_list[i]}"

            formatted_message = json.dumps(
                {"message": message, "username": "server"}
            )
            await self.redis.rpush(
                f"chat_{group_name}_messages", formatted_message
            )

        await self.channel_layer.group_add(group_name, self.channel_name)
        await self.channel_layer.group_send(
            group_name, {"type": "send_chat_history"}
        )
        await self.channel_layer.group_discard(group_name, self.channel_name)

    async def send_chat_history(self, event=None):
        return

    async def play(self):
        await self.redis.set(f"pong_{self.name}_play", 0)
        await self.send_message(
            self.GROUP,
            {
                "type": "send_next_round_id",
                "player_pairs": json.loads(
                    await self.redis.get(f"pong_{self.name}_player_pairs")
                ),
                "uuid_list": await self.get_decoded_list(
                    f"pong_{self.name}_current_games"
                ),
            },
        )

    async def send_next_round_id(self, event):
        player_pairs: List = event["player_pairs"]
        uuid_list: List = event["uuid_list"]

        for i, (player1, player2) in enumerate(player_pairs):
            if self.user.username not in (player1, player2):
                continue

            message = (
                {"type": "next_round_id", "id": uuid_list[i]}
                if player2 != "-" and i < len(uuid_list)
                else {"type": "bye"}
            )
            await self.send_message(self.CLIENT, message)
            break

    async def archive(self):
        pong = apps.get_model("games", "Pong")
        current_games = await self.get_decoded_list(
            f"pong_{self.name}_current_games"
        )
        one_game_is_over = False

        for uuid in current_games:
            try:
                game = await sync_to_async(pong.objects.get)(uuid=uuid)
                one_game_is_over = True
                user1 = await sync_to_async(lambda: game.user1.username)()
                user2 = await sync_to_async(lambda: game.user2.username)()
                loser = user2 if game.score1 > game.score2 else user1
                await self.redis.lrem(
                    f"pong_{self.name}_current_games", 1, uuid
                )
                await self.redis.rpush(
                    f"pong_{self.name}_history",
                    json.dumps(
                        {
                            "user1": user1,
                            "user2": user2,
                            "score1": game.score1,
                            "score2": game.score2,
                        }
                    ),
                )
                await self.redis.rpush(f"pong_{self.name}_history_ids", uuid)
                await self.redis.lrem(f"pong_{self.name}_players", 1, loser)
            except pong.DoesNotExist:
                continue

        if one_game_is_over:
            await self.redis.copy(
                f"pong_{self.name}_players",
                f"pong_{self.name}_ready_players",
                replace=True,
            )

        if one_game_is_over:
            await self.send_message(self.GROUP, {"type": "send_history"})
        else:
            await self.send_history()

        players = await self.get_decoded_list(f"pong_{self.name}_players")
        if len(players) < 2:
            await self.save_tournament_to_db(players[0])

    async def send_history(self, event=None):
        await self.send_message(
            self.CLIENT,
            {
                "type": "history",
                "history": await self.get_decoded_list(
                    f"pong_{self.name}_history"
                ),
            },
        )

    async def check_current_games_state(self):
        current_games = await self.get_decoded_list(
            f"pong_{self.name}_current_games"
        )

        if len(current_games) <= 0:
            await self.send_message(self.GROUP, {"type": "unlock_ready"})

    async def get_decoded_list(self, name):
        l = await self.redis.lrange(name, 0, -1)
        decoded_list = [el.decode("utf-8") for el in l]
        return decoded_list

    async def save_tournament_to_db(self, winner_name):
        self.end_tournament = True
        tournament_model = apps.get_model("games", "PongTournament")
        pong_model = apps.get_model("games", "Pong")
        user_model = get_user_model()

        usernames = await self.get_decoded_list(f"pong_{self.name}_usernames")
        participants = await sync_to_async(list)(
            user_model.objects.filter(username__in=usernames)
        )
        game_ids = await self.get_decoded_list(f"pong_{self.name}_history_ids")
        games = await sync_to_async(list)(
            pong_model.objects.filter(uuid__in=game_ids)
        )
        winner = await sync_to_async(user_model.objects.get)(
            username=winner_name
        )

        new_tournament = await sync_to_async(tournament_model.objects.create)(
            name=self.name,
            winner=winner,
        )
        await sync_to_async(new_tournament.participants.add)(*participants)
        await sync_to_async(new_tournament.games.add)(*games)
        await self.send_message(
            self.GROUP, {"type": "end", "winner": winner_name}
        )

    async def end(self, event):
        await self.send_message(
            self.CLIENT, {"type": "end", "winner": event["winner"]}
        )

    async def send_message(self, destination=CLIENT, args={}):
        try:
            if destination == self.GROUP:
                await self.channel_layer.group_send(self.name, args)
            elif destination == self.CLIENT:
                await self.send(text_data=json.dumps(args))
        except Exception as e:
            print(e)