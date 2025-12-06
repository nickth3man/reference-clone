"""Season service for business logic."""

from typing import Any

from app.core.exceptions import EntityNotFoundError
from app.models import Season, StandingsItem
from app.repositories.season_repository import SeasonRepository
from app.services.base import BaseService
from app.utils.dates import get_current_season


class SeasonService(BaseService[Season, SeasonRepository]):
    """Service for season-related business logic."""

    def __init__(self, repository: SeasonRepository | None = None) -> None:
        """Initialize the service.

        Args:
            repository: Optional repository instance. If not provided,
                       a new instance will be created.

        """
        if repository is None:
            repository = SeasonRepository()
        super().__init__(repository)

    def get_season(self, season_id: str) -> Season:
        """Get a season by ID.

        Args:
            season_id: The season identifier

        Returns:
            Season object

        Raises:
            EntityNotFoundError: If season is not found

        """
        season = self.repository.get_by_id(season_id)
        if not season:
            raise EntityNotFoundError("Season", season_id)
        return season

    def get_current_season(self) -> Season | None:
        """Get the current season.

        Returns:
            Current Season or None if not found

        """
        current_id = get_current_season()
        return self.repository.get_by_id(current_id)

    def get_all_seasons(self, league: str | None = None) -> list[Season]:
        """Get all seasons, optionally filtered by league.

        Args:
            league: Optional league filter (e.g., 'NBA', 'ABA')

        Returns:
            List of seasons

        """
        return self.repository.get_all(league)

    def get_standings(
        self,
        season_id: str | None = None,
        conference: str | None = None,
    ) -> list[StandingsItem]:
        """Get standings for a season.

        Args:
            season_id: The season (defaults to current)
            conference: Optional conference filter

        Returns:
            List of standings records

        """
        if season_id is None:
            season_id = get_current_season()
        return self.repository.get_standings(season_id, conference)

    def get_conference_standings(
        self,
        season_id: str | None = None,
    ) -> dict[str, list[StandingsItem]]:
        """Get standings split by conference.

        Args:
            season_id: The season (defaults to current)

        Returns:
            Dictionary with 'Eastern' and 'Western' standings

        """
        if season_id is None:
            season_id = get_current_season()

        eastern = self.repository.get_standings(season_id, "Eastern")
        western = self.repository.get_standings(season_id, "Western")

        return {
            "Eastern": eastern,
            "Western": western,
        }

    def get_season_summary(self, season_id: str) -> dict[str, Any]:
        """Get a summary of a season.

        Args:
            season_id: The season identifier

        Returns:
            Dictionary with season summary data

        """
        season = self.get_season(season_id)
        standings = self.repository.get_standings(season_id)
        playoffs = self.repository.get_playoffs(season_id)

        return {
            "season": season,
            "teams_count": len(standings),
            "has_playoffs": len(playoffs) > 0,
            "champion_team_id": season.champion_team_id,
            "mvp_player_id": season.mvp_player_id,
        }
