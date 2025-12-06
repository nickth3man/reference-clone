"""Game service for business logic."""

from typing import Any

from app.core.exceptions import EntityNotFoundError
from app.models import Game
from app.repositories.game_repository import GameRepository
from app.services.base import BaseService


class GameService(BaseService[Game, GameRepository]):
    """Service for game-related business logic."""

    def __init__(self, repository: GameRepository | None = None) -> None:
        """Initialize the service.

        Args:
            repository: Optional repository instance. If not provided,
                       a new instance will be created.

        """
        if repository is None:
            repository = GameRepository()
        super().__init__(repository)

    def get_game(self, game_id: str) -> Game:
        """Get a game by ID.

        Args:
            game_id: The game identifier

        Returns:
            Game object

        Raises:
            EntityNotFoundError: If game is not found

        """
        game = self.repository.get_by_id(game_id)
        if not game:
            raise EntityNotFoundError("Game", game_id)
        return game

    def get_game_with_details(self, game_id: str) -> dict[str, Any]:
        """Get a game with all associated data.

        Args:
            game_id: The game identifier

        Returns:
            Dictionary with game, team stats, and box scores

        """
        game = self.get_game(game_id)
        team_stats = self.repository.get_game_stats(game_id)
        box_scores = self.repository.get_box_scores(game_id)

        # Separate box scores by team
        home_box_scores = [
            bs for bs in box_scores if bs.team_id == game.home_team_id
        ]
        away_box_scores = [
            bs for bs in box_scores if bs.team_id == game.away_team_id
        ]

        return {
            "game": game,
            "team_stats": team_stats,
            "home_box_scores": home_box_scores,
            "away_box_scores": away_box_scores,
        }

    def get_recent_games(self, limit: int = 10) -> list[Game]:
        """Get the most recent games.

        Args:
            limit: Maximum number of games to return

        Returns:
            List of recent games

        """
        return self.repository.get_recent_games(limit)

    def get_games_by_date(self, date: str) -> list[Game]:
        """Get all games on a specific date.

        Args:
            date: The date in YYYY-MM-DD format

        Returns:
            List of games on that date

        """
        return self.repository.get_games(date=date, limit=100)

    def get_team_games(
        self,
        team_id: str,
        season_id: str | None = None,
        limit: int = 50,
    ) -> list[Game]:
        """Get games for a specific team.

        Args:
            team_id: The team identifier
            season_id: Optional season filter
            limit: Maximum number of games

        Returns:
            List of games

        """
        return self.repository.get_games(
            team_id=team_id,
            season_id=season_id,
            limit=limit,
        )

    def get_game_leaders(self, game_id: str) -> dict[str, Any]:
        """Get statistical leaders for a game.

        Args:
            game_id: The game identifier

        Returns:
            Dictionary with leaders for key stats

        """
        box_scores = self.repository.get_box_scores(game_id)
        if not box_scores:
            return {}

        # Filter out DNPs
        active_players = [bs for bs in box_scores if not bs.did_not_play]

        if not active_players:
            return {}

        return {
            "points_leader": max(active_players, key=lambda x: x.points or 0),
            "rebounds_leader": max(active_players, key=lambda x: x.total_rebounds or 0),
            "assists_leader": max(active_players, key=lambda x: x.assists or 0),
        }
