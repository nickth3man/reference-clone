"""Boxscore repository for data access layer."""
from __future__ import annotations

from typing import TYPE_CHECKING, Any

import pandas as pd

from app.core.database import execute_query_df
from app.models import BoxScore
from app.repositories.base import BaseRepository
from app.utils.dataframe import clean_nan, df_to_records

if TYPE_CHECKING:
    from app.models.game import FourFactors, LineScore


class BoxscoreRepository(BaseRepository[BoxScore]):
    """Repository for box score data operations."""

    def __init__(self) -> None:
        super().__init__(BoxScore)

    def get_by_game_id(self, game_id: str) -> list[dict[str, Any]]:
        """Get box scores for a specific game with player and team info.

        Args:
            game_id: The game identifier

        Returns:
            List of box score records with player and team details

        """
        query = """
            SELECT
                bs.*,
                p.full_name,
                p.headshot_url,
                t.abbreviation as team_abbreviation,
                t.full_name as team_name
            FROM box_scores bs
            JOIN players p ON bs.player_id = p.player_id
            JOIN teams t ON bs.team_id = t.team_id
            WHERE bs.game_id = ?
            ORDER BY bs.team_id, bs.is_starter DESC, bs.minutes_played DESC
        """
        df = execute_query_df(query, [game_id])
        return df_to_records(df)

    def get_by_player_and_game(self, player_id: str, game_id: str) -> BoxScore | None:
        """Get a specific player's box score for a game.

        Args:
            player_id: The player identifier
            game_id: The game identifier

        Returns:
            BoxScore or None if not found

        """
        query = """
            SELECT * FROM box_scores
            WHERE player_id = ? AND game_id = ?
        """
        df = execute_query_df(query, [player_id, game_id])
        return self._to_model(df)

    def get_by_team_and_game(self, team_id: str, game_id: str) -> list[BoxScore]:
        """Get all box scores for a team in a specific game.

        Args:
            team_id: The team identifier
            game_id: The game identifier

        Returns:
            List of BoxScore objects

        """
        query = """
            SELECT * FROM box_scores
            WHERE team_id = ? AND game_id = ?
            ORDER BY is_starter DESC, minutes_played DESC
        """
        df = execute_query_df(query, [team_id, game_id])
        return self._to_models(df)

    def get_line_score(self, game_id: str) -> list[LineScore]:
        """Return line score rows (home/away) for a game."""
        query = """
            SELECT
                team_abbreviation_home AS team,
                pts_qtr1_home AS q1,
                pts_qtr2_home AS q2,
                pts_qtr3_home AS q3,
                pts_qtr4_home AS q4,
                pts_ot1_home AS ot1,
                pts_ot2_home AS ot2,
                pts_home AS total
            FROM line_score
            WHERE game_id = ?
            UNION ALL
            SELECT
                team_abbreviation_away AS team,
                pts_qtr1_away AS q1,
                pts_qtr2_away AS q2,
                pts_qtr3_away AS q3,
                pts_qtr4_away AS q4,
                pts_ot1_away AS ot1,
                pts_ot2_away AS ot2,
                pts_away AS total
            FROM line_score
            WHERE game_id = ?
        """
        df = execute_query_df(query, [game_id, game_id])

        if df.empty:
            fallback = """
                SELECT
                    COALESCE(home.abbreviation, home_team_id) AS team,
                    home_q1 AS q1, home_q2 AS q2, home_q3 AS q3, home_q4 AS q4,
                    home_ot1 AS ot1, home_ot2 AS ot2,
                    home_team_score AS total
                FROM games g
                LEFT JOIN teams home ON home.team_id = g.home_team_id
                WHERE game_id = ?
                UNION ALL
                SELECT
                    COALESCE(away.abbreviation, away_team_id) AS team,
                    away_q1 AS q1, away_q2 AS q2, away_q3 AS q3, away_q4 AS q4,
                    away_ot1 AS ot1, away_ot2 AS ot2,
                    away_team_score AS total
                FROM games g
                LEFT JOIN teams away ON away.team_id = g.away_team_id
                WHERE game_id = ?
            """
            df = execute_query_df(fallback, [game_id, game_id])

        if df.empty:
            return []

        from app.models.game import LineScore

        df = df.where(pd.notnull(df), None)
        records = df_to_records(df)
        return [LineScore(**record) for record in records]

    @staticmethod
    def _safe_div(numerator: float | None, denominator: float | None) -> float | None:
        if numerator is None or denominator is None or denominator == 0:
            return None
        return numerator / denominator

    @classmethod
    def _estimate_possessions(
        cls,
        team_row: dict[str, Any] | None,
        opp_row: dict[str, Any] | None,
    ) -> float | None:
        if team_row is None:
            return None

        fga = team_row.get("fga")
        fta = team_row.get("fta")
        oreb = team_row.get("oreb")
        tov = team_row.get("tov")
        fg = team_row.get("fg")
        opp_dreb = opp_row.get("dreb") if opp_row else None

        if None in (fga, fta, oreb, tov, fg) or (opp_dreb is None and oreb is None):
            return None

        oreb_denominator = (oreb or 0) + (opp_dreb or 0)
        oreb_factor = 0 if oreb_denominator == 0 else (oreb or 0) / oreb_denominator

        return (fga or 0) + 0.4 * (fta or 0) - 1.07 * oreb_factor * ((fga or 0) - (fg or 0)) + (tov or 0)

    def get_four_factors(self, game_id: str) -> list[FourFactors]:
        """Compute four factors for both teams of a game."""
        raw = execute_query_df(
            """
            SELECT
                g.team_id_home AS team_id,
                COALESCE(home.abbreviation, g.team_abbreviation_home) AS team,
                g.pts_home AS pts,
                g.fgm_home AS fg,
                g.fga_home AS fga,
                g.fg3m_home AS threep,
                g.ftm_home AS ft,
                g.fta_home AS fta,
                g.oreb_home AS oreb,
                g.dreb_home AS dreb,
                g.tov_home AS tov
            FROM game g
            LEFT JOIN teams home ON home.team_id = g.team_id_home
            WHERE g.game_id = ?
            UNION ALL
            SELECT
                g.team_id_away AS team_id,
                COALESCE(away.abbreviation, g.team_abbreviation_away) AS team,
                g.pts_away AS pts,
                g.fgm_away AS fg,
                g.fga_away AS fga,
                g.fg3m_away AS threep,
                g.ftm_away AS ft,
                g.fta_away AS fta,
                g.oreb_away AS oreb,
                g.dreb_away AS dreb,
                g.tov_away AS tov
            FROM game g
            LEFT JOIN teams away ON away.team_id = g.team_id_away
            WHERE g.game_id = ?
            """,
            [game_id, game_id],
        )

        if raw.empty:
            return []

        raw = clean_nan(raw)
        records = df_to_records(raw)

        from app.models.game import FourFactors

        results: list[FourFactors] = []
        for record in records:
            opp_candidates = [r for r in records if r["team_id"] != record["team_id"]]
            opp = opp_candidates[0] if opp_candidates else None

            team_poss = self._estimate_possessions(record, opp)
            opp_poss = self._estimate_possessions(opp, record) if opp else None

            pace = None
            if team_poss is not None and opp_poss is not None:
                pace = (team_poss + opp_poss) / 2

            efg = self._safe_div((record.get("fg") or 0) + 0.5 * (record.get("threep") or 0), record.get("fga"))
            ft_per_fga = self._safe_div(record.get("ft"), record.get("fga"))
            orb_pct = self._safe_div(record.get("oreb"), (record.get("oreb") or 0) + ((opp or {}).get("dreb") or 0))
            tov_pct = None
            if team_poss and team_poss != 0:
                tov_pct = self._safe_div(record.get("tov"), team_poss)
                tov_pct = tov_pct * 100 if tov_pct is not None else None

            ortg = None
            if team_poss and team_poss != 0:
                ortg = self._safe_div(record.get("pts"), team_poss)
                ortg = ortg * 100 if ortg is not None else None

            team_value = record.get("team") or record.get("team_id") or ""

            results.append(
                FourFactors(
                    team=str(team_value),
                    pace=pace,
                    efg_pct=efg,
                    tov_pct=tov_pct,
                    orb_pct=orb_pct,
                    ft_per_fga=ft_per_fga,
                    ortg=ortg,
                ),
            )

        return results
