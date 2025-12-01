"""Player service for business logic."""

from app.core.exceptions import EntityNotFoundError
from app.models import (
    Player,
    PlayerAdvancedStats,
    PlayerSeasonStats,
)
from app.repositories.player_repository import PlayerRepository
from app.services.base import BaseService


class PlayerService(BaseService[Player, PlayerRepository]):
    """Service for player-related business logic."""

    def __init__(self, repository: PlayerRepository | None = None) -> None:
        """Initialize the service.

        Args:
            repository: Optional repository instance. If not provided,
                       a new instance will be created.

        """
        if repository is None:
            repository = PlayerRepository()
        super().__init__(repository)

    def get_player(self, player_id: str) -> Player:
        """Get a player by ID.

        Args:
            player_id: The player identifier

        Returns:
            Player object

        Raises:
            EntityNotFoundError: If player is not found

        """
        player = self.repository.get_by_id(player_id)
        if not player:
            raise EntityNotFoundError("Player", player_id)
        return player

    def search_players(
        self,
        search: str | None = None,
        letter: str | None = None,
        limit: int = 50,
        offset: int = 0,
    ) -> list[Player]:
        """Search for players.

        Args:
            search: Search term for player name
            letter: First letter of last name
            limit: Maximum results
            offset: Number of results to skip

        Returns:
            List of matching players

        """
        return self.repository.get_players(
            search=search,
            letter=letter,
            limit=limit,
            offset=offset,
        )

    def get_player_career_summary(self, player_id: str) -> dict:
        """Get a summary of a player's career.

        Args:
            player_id: The player identifier

        Returns:
            Dictionary with career summary data

        """
        player = self.get_player(player_id)
        stats = self.repository.get_stats(player_id)
        contracts = self.repository.get_contracts(player_id)
        awards = self.repository.get_awards(player_id)

        # Calculate career totals
        total_games = sum(s.games_played or 0 for s in stats)
        total_points = sum(s.points or 0 for s in stats)
        seasons_played = len({s.season_id for s in stats if s.season_id})

        return {
            "player": player,
            "seasons_played": seasons_played,
            "total_games": total_games,
            "total_points": total_points,
            "career_ppg": total_points / total_games if total_games > 0 else 0,
            "contracts_count": len(contracts),
            "awards_count": len(awards),
            "is_hall_of_fame": player.hof_year is not None,
        }

    def get_player_season_comparison(
        self,
        player_id: str,
        season_ids: list[str],
    ) -> list[PlayerSeasonStats]:
        """Get stats for specific seasons for comparison.

        Args:
            player_id: The player identifier
            season_ids: List of season IDs to compare

        Returns:
            List of stats for the specified seasons

        """
        all_stats = self.repository.get_stats(player_id)
        return [s for s in all_stats if s.season_id in season_ids]

    def get_player_advanced_by_season(
        self,
        player_id: str,
        season_id: str,
    ) -> PlayerAdvancedStats | None:
        """Get advanced stats for a specific season.

        Args:
            player_id: The player identifier
            season_id: The season identifier

        Returns:
            Advanced stats or None if not found

        """
        stats = self.repository.get_advanced_stats(player_id, season_id)
        return stats[0] if stats else None
