"""Team service for business logic."""

from typing import Any

from app.core.exceptions import EntityNotFoundError
from app.models import Player, Team, TeamSeasonStats
from app.repositories.team_repository import TeamRepository
from app.services.base import BaseService
from app.utils.dates import get_current_season


class TeamService(BaseService[Team, TeamRepository]):
    """Service for team-related business logic."""

    def __init__(self, repository: TeamRepository | None = None) -> None:
        """Initialize the service.

        Args:
            repository: Optional repository instance. If not provided,
                       a new instance will be created.

        """
        if repository is None:
            repository = TeamRepository()
        super().__init__(repository)

    def get_team(self, team_id: str) -> Team:
        """Get a team by ID or abbreviation.

        Args:
            team_id: The team identifier or abbreviation

        Returns:
            Team object

        Raises:
            EntityNotFoundError: If team is not found

        """
        team = self.repository.get_by_id(team_id)
        if not team:
            raise EntityNotFoundError("Team", team_id)
        return team

    def get_active_teams(self) -> list[Team]:
        """Get all active NBA teams.

        Returns:
            List of active teams

        """
        return self.repository.get_teams(active_only=True)

    def get_all_teams(self) -> list[Team]:
        """Get all teams including inactive/historical.

        Returns:
            List of all teams

        """
        return self.repository.get_teams(active_only=False)

    def get_team_current_roster(self, team_id: str) -> list[dict[str, Any]]:
        """Get the current season roster for a team.

        Args:
            team_id: The team identifier

        Returns:
            List of player records on the current roster

        """
        current_season = get_current_season()
        return self.repository.get_roster(team_id, current_season)

    def get_team_roster(
        self,
        team_id: str,
        season_id: str | None = None,
    ) -> list[dict[str, Any]]:
        """Get team roster for a specific season.

        Args:
            team_id: The team identifier
            season_id: The season (defaults to current)

        Returns:
            List of player records on the roster

        """
        if season_id is None:
            season_id = get_current_season()
        return self.repository.get_roster(team_id, season_id)

    def get_team_season_record(
        self,
        team_id: str,
        season_id: str | None = None,
    ) -> TeamSeasonStats | None:
        """Get team record for a specific season.

        Args:
            team_id: The team identifier
            season_id: The season (defaults to current)

        Returns:
            TeamSeasonStats or None if not found

        """
        stats = self.repository.get_stats(team_id)
        if not stats:
            return None

        if season_id is None:
            season_id = get_current_season()

        for s in stats:
            if s.season_id == season_id:
                return s

        # Return most recent if season not found
        return stats[0] if stats else None

    def get_team_franchise_history(self, team_id: str) -> dict[str, Any]:
        """Get franchise history for a team.

        Args:
            team_id: The team identifier

        Returns:
            Dictionary with franchise history data

        """
        team = self.get_team(team_id)
        stats = self.repository.get_stats(team_id)

        total_wins = sum(s.wins or 0 for s in stats)
        total_losses = sum(s.losses or 0 for s in stats)
        championships = team.championships or 0

        return {
            "team": team,
            "total_seasons": len(stats),
            "total_wins": total_wins,
            "total_losses": total_losses,
            "all_time_win_pct": total_wins / (total_wins + total_losses)
            if (total_wins + total_losses) > 0
            else 0,
            "championships": championships,
            "founded_year": team.founded_year,
        }
