"""Boxscore repository for data access layer."""

from typing import Any

from app.core.database import execute_query_df
from app.models import BoxScore
from app.repositories.base import BaseRepository
from app.utils.dataframe import df_to_records


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
