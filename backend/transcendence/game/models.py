from django.db import models
from django.contrib.auth import get_user_model


class Pong(models.Model):
    user1 = models.ForeignKey(
        get_user_model(),
        on_delete=models.SET_NULL,
        null=True,
        related_name="user1",
    )
    user2 = models.ForeignKey(
        get_user_model(),
        on_delete=models.SET_NULL,
        null=True,
        related_name="user2",
    )
    score1 = models.PositiveSmallIntegerField()
    score2 = models.PositiveSmallIntegerField()
    id = models.BigIntegerField(primary_key=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user1.username} vs {self.user2.username} - {self.score1}:{self.score2}"

    def serialize(self):
        return {
            "user1": (
                {"id": self.user1.id, "username": self.user1.username}
                if self.user1
                else None
            ),
            "user2": (
                {"id": self.user2.id, "username": self.user2.username}
                if self.user2
                else None
            ),
            "score1": self.score1,
            "score2": self.score2,
            "uuid": self.uuid,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }

class PongTournament(models.Model):
    name = models.CharField(max_length=255, unique=True)
    winner = models.ForeignKey(
        get_user_model(),
        on_delete=models.SET_NULL,
        null=True,
        related_name="winner",
    )
    participants = models.ManyToManyField(
        get_user_model(), related_name="tournaments"
    )
    games = models.ManyToManyField(Pong, related_name="tournaments")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Tournament: {self.name} - Winner: {self.winner}"

    def serialize(self):
        return {
            "name": self.name,
            "winner": (
                {"id": self.winner.id, "username": self.winner.username}
                if self.winner
                else None
            ),
            "participants": [
                {"id": participant.id, "username": participant.username}
                for participant in self.participants.all()
            ],
            "games": [game.serialize() for game in self.games.all()],
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }