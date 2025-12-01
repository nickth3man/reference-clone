"""Draft repository for data access layer."""

from typing import Any

from app.core.database import execute_query_df
from app.models import DraftPick
from app.repositories.base import BaseRepository


class DraftRepository(BaseRepository[DraftPick]):
    """Repository for draft data operations."""

    def __init__(self) -> None:
        super().__init__(DraftPick)

    def get_all(
        self,
        year: int | None = None,
        team_id: str | None = None,
        round_num: int | None = None,
        limit: int = 100,
        offset: int = 0,
    ) -> list[DraftPick]:
        """Get draft picks with optional filtering.

        Args:
            year: Filter by draft year
            team_id: Filter by team
            round_num: Filter by round
            limit: Maximum number of results
            offset: Number of results to skip

        Returns:
            List of DraftPick objects

        """
        query = "SELECT * FROM draft_picks"
        conditions: list[str] = []
        params: list[Any] = []

        if year:
            conditions.append("draft_year = ?")
            params.append(year)

        if team_id:
            conditions.append("team_id = ?")
            params.append(team_id)

        if round_num:
            conditions.append("round = ?")
            params.append(round_num)

        if conditions:
            query += " WHERE " + " AND ".join(conditions)

        query += " ORDER BY draft_year DESC, overall_pick ASC LIMIT ? OFFSET ?"
        params.extend([limit, offset])

        df = execute_query_df(query, params)
        return self._to_models(df)

    def get_by_id(self, pick_id: int) -> DraftPick | None:
        """Get a draft pick by ID.

        Args:
            pick_id: The pick identifier

        Returns:
            DraftPick or None if not found

        """
        query = "SELECT * FROM draft_picks WHERE pick_id = ?"
        df = execute_query_df(query, [pick_id])
        return self._to_model(df)

    def get_by_year(self, year: int) -> list[DraftPick]:
        """Get all picks for a specific draft year.

        Args:
            year: The draft year

        Returns:
            List of DraftPick objects

        """
        query = """
            SELECT * FROM draft_picks
            WHERE draft_year = ?
            ORDER BY overall_pick ASC
        """
        df = execute_query_df(query, [year])
        return self._to_models(df)

    def get_by_team(self, team_id: str, year: int | None = None) -> list[DraftPick]:
        """Get all picks for a team.

        Args:
            team_id: The team identifier
            year: Optional year filter

        Returns:
            List of DraftPick objects

        """
        query = "SELECT * FROM draft_picks WHERE team_id = ?"
        params: list[Any] = [team_id]

        if year:
            query += " AND draft_year = ?"
            params.append(year)

        query += " ORDER BY draft_year DESC, overall_pick ASC"
        df = execute_query_df(query, params)
        return self._to_models(df)

    def get_by_player(self, player_id: str) -> DraftPick | None:
        """Get draft pick for a specific player.

        Args:
            player_id: The player identifier

        Returns:
            DraftPick or None if not drafted

        """
        query = "SELECT * FROM draft_picks WHERE player_id = ?"
        df = execute_query_df(query, [player_id])
        return self._to_model(df)
