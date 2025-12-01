"""Season repository for data access layer."""

from typing import Any

import pandas as pd

from app.database import execute_query_df
from app.models import Season, TeamSeasonStats
from app.repositories.base import BaseRepository


class SeasonRepository(BaseRepository[Season]):
    """Repository for season-related data operations."""

    def __init__(self) -> None:
        super().__init__(Season)

    def get_all(self, league: str | None = None) -> list[Season]:
        """Get all seasons, optionally filtered by league.

        Args:
            league: Optional league filter (e.g., 'NBA', 'ABA')

        Returns:
            List of Season objects ordered by end_year descending

        """
        query = "SELECT * FROM seasons"
        params: list[Any] = []

        if league:
            query += " WHERE league = ?"
            params.append(league)

        query += " ORDER BY end_year DESC"

        df = execute_query_df(query, params)
        return self._to_models(df)

    def get_by_id(self, season_id: str) -> Season | None:
        """Get a single season by ID.

        Args:
            season_id: The season identifier (e.g., '2025', '42022')

        Returns:
            Season object or None if not found

        """
        query = "SELECT * FROM seasons WHERE season_id = ?"
        df = execute_query_df(query, [season_id])
        return self._to_model(df)

    def get_current(self) -> Season | None:
        """Get the current (most recent) season.

        Returns:
            The most recent Season object or None

        """
        query = "SELECT * FROM seasons ORDER BY end_year DESC LIMIT 1"
        df = execute_query_df(query)
        return self._to_model(df)

    def get_standings(
        self,
        season_id: str,
        conference: str | None = None,
    ) -> list[dict[str, Any]]:
        """Get standings for a specific season.

        Args:
            season_id: The season identifier
            conference: Optional conference filter ('Eastern', 'Western')

        Returns:
            List of team standings with team details

        """
        query = """
            SELECT
                tss.*,
                t.full_name, t.abbreviation, t.logo_url, t.conference, t.division
            FROM team_season_stats tss
            JOIN teams t ON tss.team_id = t.team_id
            WHERE tss.season_id = ?
        """
        params: list[Any] = [season_id]

        if conference:
            query += " AND t.conference = ?"
            params.append(conference)

        query += " ORDER BY tss.win_pct DESC"

        df = execute_query_df(query, params)
        if df.empty:
            return []
        df = df.where(pd.notnull(df), None)
        return df.to_dict(orient="records")  # type: ignore[return-value]

    def get_team_stats(self, season_id: str) -> list[TeamSeasonStats]:
        """Get all team stats for a specific season.

        Args:
            season_id: The season identifier

        Returns:
            List of TeamSeasonStats objects

        """
        query = """
            SELECT *
            FROM team_season_stats
            WHERE season_id = ?
            ORDER BY win_pct DESC
        """
        df = execute_query_df(query, [season_id])
        if df.empty:
            return []
        df = df.where(pd.notnull(df), None)
        records: list[dict[str, Any]] = df.to_dict(orient="records")  # type: ignore[assignment]
        return [TeamSeasonStats(**record) for record in records]

    def get_leaders(
        self,
        season_id: str,
        stat_category: str,
        limit: int = 10,
    ) -> list[dict[str, Any]]:
        """Get statistical leaders for a specific season and category.

        Args:
            season_id: The season identifier
            stat_category: The stat to rank by (e.g., 'points_per_game', 'rebounds_per_game')
            limit: Maximum number of leaders to return

        Returns:
            List of player records with the specified stat

        """
        # Validate stat category to prevent SQL injection
        valid_categories = {
            "points_per_game",
            "rebounds_per_game",
            "assists_per_game",
            "steals_per_game",
            "blocks_per_game",
            "field_goal_pct",
            "three_point_pct",
            "free_throw_pct",
        }

        if stat_category not in valid_categories:
            return []

        # stat_category is validated above against whitelist, safe to use in query
        query = f"""
            SELECT
                p.player_id, p.full_name, p.headshot_url,
                s.{stat_category} as value, s.team_id
            FROM player_season_stats s
            JOIN players p ON s.player_id = p.player_id
            WHERE s.season_id = ?
            ORDER BY s.{stat_category} DESC
            LIMIT ?
        """  # noqa: S608
        df = execute_query_df(query, [season_id, limit])
        if df.empty:
            return []
        df = df.where(pd.notnull(df), None)
        return df.to_dict(orient="records")  # type: ignore[return-value]

    def get_playoffs(self, season_id: str) -> list[dict[str, Any]]:
        """Get playoff series data for a specific season.

        Args:
            season_id: The season identifier

        Returns:
            List of playoff series records

        """
        query = """
            SELECT *
            FROM playoff_series
            WHERE season_id = ?
            ORDER BY round_number, series_start_date
        """
        df = execute_query_df(query, [season_id])
        if df.empty:
            return []
        df = df.where(pd.notnull(df), None)
        return df.to_dict(orient="records")  # type: ignore[return-value]
