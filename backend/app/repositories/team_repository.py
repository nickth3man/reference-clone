from typing import Any

import pandas as pd

from app.database import execute_query_df
from app.models import Team, TeamSeasonStats
from app.repositories.base import BaseRepository


class TeamRepository(BaseRepository[Team]):
    def __init__(self) -> None:
        super().__init__(Team)

    def get_teams(self, active_only: bool = True) -> list[Team]:
        query = "SELECT * FROM teams"
        params: list[Any] = []

        if active_only:
            query += " WHERE is_active = TRUE AND league = 'NBA'"

        query += " ORDER BY full_name"

        df = execute_query_df(query, params)
        return self._to_models(df)

    def get_by_id(self, team_id: str) -> Team | None:
        # Try by ID first
        query = "SELECT * FROM teams WHERE team_id = ?"
        df = execute_query_df(query, [team_id])

        if df.empty:
            # Try by abbreviation
            query = "SELECT * FROM teams WHERE abbreviation = ?"
            df = execute_query_df(query, [team_id])

        return self._to_model(df)

    def resolve_team_id(self, team_id_or_abbr: str) -> str | None:
        """Helper to resolve a team ID from an ID or abbreviation."""
        team = self.get_by_id(team_id_or_abbr)
        return team.team_id if team else None

    def get_stats(self, team_id: str) -> list[TeamSeasonStats]:
        # Resolve ID first
        resolved_id = self.resolve_team_id(team_id)
        if not resolved_id:
            return []

        query = """
            SELECT *
            FROM team_season_stats
            WHERE team_id = ?
            ORDER BY season_id DESC
        """
        df = execute_query_df(query, [resolved_id])
        if df.empty:
            return []
        
        df = df.where(pd.notnull(df), None)
        return [TeamSeasonStats(**record) for record in df.to_dict(orient="records")]

    def get_roster(self, team_id: str, season_id: str) -> list[dict[str, Any]]:
        # Resolve ID first
        resolved_id = self.resolve_team_id(team_id)
        if not resolved_id:
            return []

        query = """
            SELECT p.*, s.season_id, s.team_id
            FROM players p
            JOIN player_season_stats s ON p.player_id = s.player_id
            WHERE s.team_id = ? AND s.season_id = ?
        """
        df = execute_query_df(query, [resolved_id, season_id])
        
        if df.empty:
            return []

        df = df.replace({float("nan"): None})
        return df.to_dict(orient="records")  # type: ignore
