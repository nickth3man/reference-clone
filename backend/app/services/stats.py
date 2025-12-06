"""Stats service for cross-cutting statistical operations."""

from typing import Any

from app.core.database import execute_query_df
from app.core.logging import get_logger
from app.utils.dataframe import df_to_records

logger = get_logger(__name__)


class StatsService:
    """Service for cross-cutting statistical operations.

    This service provides statistical calculations and comparisons
    that span multiple entities (players, teams, seasons).
    """

    def get_league_averages(self, season_id: str) -> dict[str, float]:
        """Get league average statistics for a season.

        Args:
            season_id: The season identifier

        Returns:
            Dictionary of average statistics

        """
        query = """
            SELECT
                AVG(points_per_game) as avg_ppg,
                AVG(rebounds_per_game) as avg_rpg,
                AVG(assists_per_game) as avg_apg,
                AVG(field_goal_pct) as avg_fg_pct,
                AVG(three_point_pct) as avg_3pt_pct,
                AVG(free_throw_pct) as avg_ft_pct
            FROM player_season_stats
            WHERE season_id = ?
                AND games_played >= 20
        """
        df = execute_query_df(query, [season_id])
        if df.empty:
            return {}

        records = df_to_records(df)
        return records[0] if records else {}

    def get_percentile_rank(
        self,
        player_id: str,
        season_id: str,
        stat: str,
    ) -> float | None:
        """Get a player's percentile rank for a stat in a season.

        Args:
            player_id: The player identifier
            season_id: The season identifier
            stat: The stat column name

        Returns:
            Percentile rank (0-100) or None if not found

        """
        # Validate stat name to prevent SQL injection
        valid_stats = {
            "points_per_game",
            "rebounds_per_game",
            "assists_per_game",
            "steals_per_game",
            "blocks_per_game",
            "field_goal_pct",
            "three_point_pct",
            "free_throw_pct",
            "player_efficiency_rating",
        }

        if stat not in valid_stats:
            logger.warning(f"Invalid stat requested: {stat}")
            return None

        query = f"""
            WITH ranked AS (
                SELECT
                    player_id,
                    PERCENT_RANK() OVER (ORDER BY {stat}) as pct_rank
                FROM player_season_stats
                WHERE season_id = ?
                    AND games_played >= 20
                    AND {stat} IS NOT NULL
            )
            SELECT pct_rank * 100 as percentile
            FROM ranked
            WHERE player_id = ?
        """  # noqa: S608

        df = execute_query_df(query, [season_id, player_id])
        if df.empty:
            return None

        return float(df.iloc[0]["percentile"])

    def compare_players(
        self,
        player_ids: list[str],
        season_id: str,
    ) -> list[dict[str, Any]]:
        """Compare multiple players' stats for a season.

        Args:
            player_ids: List of player identifiers
            season_id: The season identifier

        Returns:
            List of player stats for comparison

        """
        if not player_ids:
            return []

        placeholders = ", ".join("?" for _ in player_ids)
        query = f"""
            SELECT
                p.player_id,
                p.full_name,
                p.position,
                s.*
            FROM player_season_stats s
            JOIN players p ON s.player_id = p.player_id
            WHERE s.player_id IN ({placeholders})
                AND s.season_id = ?
        """  # noqa: S608

        params = [*player_ids, season_id]
        df = execute_query_df(query, params)
        return df_to_records(df)

    def get_team_comparison(
        self,
        team_ids: list[str],
        season_id: str,
    ) -> list[dict[str, Any]]:
        """Compare multiple teams' stats for a season.

        Args:
            team_ids: List of team identifiers
            season_id: The season identifier

        Returns:
            List of team stats for comparison

        """
        if not team_ids:
            return []

        placeholders = ", ".join("?" for _ in team_ids)
        query = f"""
            SELECT
                t.team_id,
                t.full_name,
                t.abbreviation,
                s.*
            FROM team_season_stats s
            JOIN teams t ON s.team_id = t.team_id
            WHERE s.team_id IN ({placeholders})
                AND s.season_id = ?
        """  # noqa: S608

        params = [*team_ids, season_id]
        df = execute_query_df(query, params)
        return df_to_records(df)
