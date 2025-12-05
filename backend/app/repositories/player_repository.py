from typing import Any

import pandas as pd

from app.database import execute_query_df
from app.models import (
    Award,
    Contract,
    Player,
    PlayerAdjustedShooting,
    PlayerAdvancedStats,
    PlayerGameLog,
    PlayerPlayByPlayStats,
    PlayerSeasonStats,
    PlayerShootingStats,
    PlayerSplits,
)
from app.repositories.base import BaseRepository


class PlayerRepository(BaseRepository[Player]):
    def __init__(self) -> None:
        super().__init__(Player)

    def _table_exists(self, table_name: str) -> bool:
        """Return True if a DuckDB table/view exists."""
        try:
            df = execute_query_df(f"PRAGMA table_info('{table_name}')")
        except Exception:
            return False
        return not df.empty

    def get_players(
        self,
        search: str | None = None,
        letter: str | None = None,
        limit: int = 50,
        offset: int = 0,
    ) -> list[Player]:
        params: list[Any] = []
        query = """
            SELECT
                player_id, full_name, first_name, last_name, birth_date,
                height_inches, weight_lbs, position, college, nba_debut,
                experience_years, is_active, headshot_url
            FROM players
        """
        conditions: list[str] = []

        if search:
            conditions.append("(LOWER(full_name) LIKE ? OR LOWER(last_name) LIKE ?)")
            search_term = f"%{search.lower()}%"
            params.extend([search_term, search_term])

        if letter:
            conditions.append("last_name ILIKE ?")
            params.append(f"{letter}%")

        if conditions:
            query += " WHERE " + " AND ".join(conditions)

        query += " LIMIT ? OFFSET ?"
        params.extend([limit, offset])

        df = execute_query_df(query, params)
        return self._to_models(df)

    def get_by_id(self, player_id: str) -> Player | None:
        query = """
            SELECT
                player_id, full_name, first_name, last_name, birth_date,
                height_inches, weight_lbs, position, college, nba_debut,
                experience_years, is_active, headshot_url
            FROM players WHERE player_id = ?
        """
        df = execute_query_df(query, [player_id])
        return self._to_model(df)

    def get_stats(self, player_id: str) -> list[PlayerSeasonStats]:
        query = """
            SELECT *
            FROM player_season_stats
            WHERE player_id = ?
            ORDER BY season_id DESC
        """
        df = execute_query_df(query, [player_id])
        if df.empty:
            return []
        df = df.where(pd.notnull(df), None)
        records: list[dict[str, Any]] = df.to_dict(orient="records")  # type: ignore[assignment]
        return [PlayerSeasonStats(**record) for record in records]

    def get_gamelog(self, player_id: str, season_id: str | None = None) -> list[PlayerGameLog]:
        params = [player_id]
        query = """
            SELECT
                b.*,
                g.game_date,
                CASE WHEN b.team_id = g.home_team_id THEN g.away_team_id ELSE g.home_team_id END as opponent_team_id,
                CASE WHEN b.team_id = g.home_team_id THEN TRUE ELSE FALSE END as is_home,
                CASE WHEN b.team_id = g.winner_team_id THEN TRUE ELSE FALSE END as is_win
            FROM box_scores b
            JOIN games g ON b.game_id = g.game_id
            WHERE b.player_id = ?
        """
        if season_id:
            query += " AND g.season_id = ?"
            params.append(season_id)

        query += " ORDER BY g.game_date DESC"

        df = execute_query_df(query, params)
        if df.empty:
            return []
        df = df.where(pd.notnull(df), None)
        records: list[dict[str, Any]] = df.to_dict(orient="records")  # type: ignore[assignment]
        return [PlayerGameLog(**record) for record in records]

    def get_splits(self, player_id: str, season_id: str | None = None) -> list[PlayerSplits]:
        params = [player_id]
        query = """
            SELECT *
            FROM player_splits
            WHERE player_id = ?
        """
        if season_id:
            query += " AND season_id = ?"
            params.append(season_id)

        query += " ORDER BY season_id DESC, split_type, split_value"

        df = execute_query_df(query, params)
        if df.empty:
            return []
        df = df.where(pd.notnull(df), None)
        records: list[dict[str, Any]] = df.to_dict(orient="records")  # type: ignore[assignment]
        return [PlayerSplits(**record) for record in records]

    def get_advanced_stats(
        self, player_id: str, season_id: str | None = None
    ) -> list[PlayerAdvancedStats]:
        params = [player_id]
        query = """
            SELECT *
            FROM player_advanced_stats
            WHERE player_id = ?
        """
        if season_id:
            query += " AND season_id = ?"
            params.append(season_id)

        query += " ORDER BY season_id DESC"

        df = execute_query_df(query, params)
        if df.empty:
            return []
        df = df.where(pd.notnull(df), None)
        records: list[dict[str, Any]] = df.to_dict(orient="records")  # type: ignore[assignment]
        return [PlayerAdvancedStats(**record) for record in records]

    def get_contracts(self, player_id: str) -> list[Contract]:
        query = """
            SELECT *
            FROM player_contracts
            WHERE player_id = ?
            ORDER BY signing_date DESC
        """
        df = execute_query_df(query, [player_id])
        if df.empty:
            return []
        df = df.where(pd.notnull(df), None)
        records: list[dict[str, Any]] = df.to_dict(orient="records")  # type: ignore[assignment]
        return [Contract(**record) for record in records]

    def get_shooting_stats(self, player_id: str) -> list[PlayerShootingStats]:
        query = """
            SELECT *
            FROM player_shooting_stats
            WHERE player_id = ?
            ORDER BY season_id DESC
        """
        df = execute_query_df(query, [player_id])
        if df.empty:
            return []
        df = df.where(pd.notnull(df), None)
        records: list[dict[str, Any]] = df.to_dict(orient="records")  # type: ignore[assignment]
        return [PlayerShootingStats(**record) for record in records]

    def get_adjusted_shooting(self, player_id: str) -> list[PlayerAdjustedShooting]:
        if not self._table_exists("player_adjusted_shooting"):
            return []

        query = """
            SELECT *
            FROM player_adjusted_shooting
            WHERE player_id = ?
            ORDER BY season_id DESC
        """
        try:
            df = execute_query_df(query, [player_id])
        except Exception:
            return []

        if df.empty:
            return []
        df = df.where(pd.notnull(df), None)
        records: list[dict[str, Any]] = df.to_dict(orient="records")  # type: ignore[assignment]
        return [PlayerAdjustedShooting(**record) for record in records]

    def get_play_by_play_stats(self, player_id: str) -> list[PlayerPlayByPlayStats]:
        query = """
            SELECT *
            FROM player_play_by_play_stats
            WHERE player_id = ?
            ORDER BY season_id DESC
        """
        df = execute_query_df(query, [player_id])
        if df.empty:
            return []
        df = df.where(pd.notnull(df), None)
        records: list[dict[str, Any]] = df.to_dict(orient="records")  # type: ignore[assignment]
        return [PlayerPlayByPlayStats(**record) for record in records]

    def get_awards(self, player_id: str) -> list[Award]:
        query = """
            SELECT *
            FROM awards
            WHERE player_id = ?
            ORDER BY season_id DESC
        """
        df = execute_query_df(query, [player_id])
        if df.empty:
            return []
        df = df.where(pd.notnull(df), None)
        records: list[dict[str, Any]] = df.to_dict(orient="records")  # type: ignore[assignment]
        return [Award(**record) for record in records]

    def get_seasons(self, player_id: str) -> list[str]:
        query = """
            SELECT DISTINCT season_id
            FROM player_season_stats
            WHERE player_id = ?
            ORDER BY season_id DESC
        """
        df = execute_query_df(query, [player_id])
        if df.empty:
            return []
        return df["season_id"].tolist()
