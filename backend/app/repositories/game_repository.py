"""Game repository for data access layer."""

from typing import Any

import pandas as pd

from app.database import execute_query_df
from app.models import BoxScore, Game, TeamGameStats
from app.repositories.base import BaseRepository


class GameRepository(BaseRepository[Game]):
    """Repository for game-related data operations."""

    def __init__(self) -> None:
        super().__init__(Game)

    def get_games(
        self,
        date: str | None = None,
        team_id: str | None = None,
        season_id: str | None = None,
        limit: int = 50,
        offset: int = 0,
    ) -> list[Game]:
        """Get games with optional filtering.

        Args:
            date: Filter by game date (YYYY-MM-DD format)
            team_id: Filter by team (home or away)
            season_id: Filter by season
            limit: Maximum number of results
            offset: Number of results to skip

        Returns:
            List of Game objects

        """
        query = """
            SELECT
                game_id, season_id, game_date, game_time, game_type,
                home_team_id, away_team_id, home_team_score, away_team_score,
                home_q1, home_q2, home_q3, home_q4, home_ot1, home_ot2, home_ot3, home_ot4,
                away_q1, away_q2, away_q3, away_q4, away_ot1, away_ot2, away_ot3, away_ot4,
                arena, attendance, game_duration_minutes, playoff_round,
                series_game_number, winner_team_id
            FROM games
        """
        conditions: list[str] = []
        params: list[Any] = []

        if date:
            conditions.append("game_date = ?")
            params.append(date)

        if team_id:
            # Resolve abbreviation to ID if needed
            resolved_id = self._resolve_team_id(team_id)
            conditions.append("(home_team_id = ? OR away_team_id = ?)")
            params.extend([resolved_id, resolved_id])

        if season_id:
            conditions.append("season_id = ?")
            params.append(season_id)

        if conditions:
            query += " WHERE " + " AND ".join(conditions)

        query += " ORDER BY game_date DESC, game_time DESC"
        query += " LIMIT ? OFFSET ?"
        params.extend([limit, offset])

        df = execute_query_df(query, params)
        return self._to_models(df)

    def get_by_id(self, game_id: str) -> Game | None:
        """Get a single game by ID.

        Args:
            game_id: The game identifier

        Returns:
            Game object or None if not found

        """
        query = """
            SELECT
                game_id, season_id, game_date, game_time, game_type,
                home_team_id, away_team_id, home_team_score, away_team_score,
                home_q1, home_q2, home_q3, home_q4, home_ot1, home_ot2, home_ot3, home_ot4,
                away_q1, away_q2, away_q3, away_q4, away_ot1, away_ot2, away_ot3, away_ot4,
                arena, attendance, game_duration_minutes, playoff_round,
                series_game_number, winner_team_id
            FROM games WHERE game_id = ?
        """
        df = execute_query_df(query, [game_id])
        return self._to_model(df)

    def get_game_stats(self, game_id: str) -> list[TeamGameStats]:
        """Get team stats for a specific game.

        Args:
            game_id: The game identifier

        Returns:
            List of TeamGameStats (one per team)

        """
        query = """
            SELECT
                stat_id, game_id, team_id, is_home,
                field_goals_made, field_goals_attempted,
                three_pointers_made, three_pointers_attempted,
                free_throws_made, free_throws_attempted,
                offensive_rebounds, defensive_rebounds, total_rebounds,
                assists, steals, blocks, turnovers, personal_fouls, points,
                pace, offensive_rating, defensive_rating, possessions,
                effective_fg_pct, turnover_pct, offensive_rebound_pct, free_throw_rate
            FROM team_game_stats
            WHERE game_id = ?
        """
        df = execute_query_df(query, [game_id])
        if df.empty:
            return []
        df = df.where(pd.notnull(df), None)
        return [TeamGameStats(**record) for record in df.to_dict(orient="records")]

    def get_box_scores(self, game_id: str) -> list[BoxScore]:
        """Get player box scores for a specific game.

        Args:
            game_id: The game identifier

        Returns:
            List of BoxScore objects for all players in the game

        """
        query = """
            SELECT
                box_score_id, game_id, player_id, team_id, is_starter,
                minutes_played, did_not_play, dnp_reason,
                field_goals_made, field_goals_attempted,
                three_pointers_made, three_pointers_attempted,
                free_throws_made, free_throws_attempted,
                offensive_rebounds, defensive_rebounds, total_rebounds,
                assists, steals, blocks, turnovers, personal_fouls,
                points, plus_minus, game_score
            FROM box_scores
            WHERE game_id = ?
            ORDER BY team_id, is_starter DESC, points DESC
        """
        df = execute_query_df(query, [game_id])
        if df.empty:
            return []
        df = df.where(pd.notnull(df), None)
        return [BoxScore(**record) for record in df.to_dict(orient="records")]

    def get_recent_games(self, limit: int = 10) -> list[Game]:
        """Get the most recent games.

        Args:
            limit: Maximum number of games to return

        Returns:
            List of recent Game objects

        """
        query = """
            SELECT
                game_id, season_id, game_date, game_time, game_type,
                home_team_id, away_team_id, home_team_score, away_team_score,
                home_q1, home_q2, home_q3, home_q4, home_ot1, home_ot2, home_ot3, home_ot4,
                away_q1, away_q2, away_q3, away_q4, away_ot1, away_ot2, away_ot3, away_ot4,
                arena, attendance, game_duration_minutes, playoff_round,
                series_game_number, winner_team_id
            FROM games
            ORDER BY game_date DESC, game_time DESC
            LIMIT ?
        """
        df = execute_query_df(query, [limit])
        return self._to_models(df)

    def _resolve_team_id(self, team_id: str) -> str:
        """Resolve team abbreviation to team ID if needed.

        Args:
            team_id: Team ID or abbreviation

        Returns:
            Resolved team ID

        """
        team_lookup = execute_query_df(
            "SELECT team_id FROM teams WHERE team_id = ? OR abbreviation = ?",
            [team_id, team_id],
        )
        if not team_lookup.empty:
            return str(team_lookup.iloc[0]["team_id"])
        return team_id
