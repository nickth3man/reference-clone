"""Unit tests for GameRepository."""

from unittest.mock import MagicMock, patch

import pandas as pd

from app.models import BoxScore, Game
from app.repositories.game_repository import GameRepository


class TestGameRepositoryGetById:
    """Tests for GameRepository.get_by_id method."""

    @patch("app.repositories.game_repository.execute_query_df")
    def test_get_by_id_returns_game(self, mock_execute: MagicMock) -> None:
        """Test getting a game by ID returns Game object."""
        mock_df = pd.DataFrame(
            {
                "game_id": ["0022400001"],
                "season_id": ["2025"],
                "game_date": ["2024-10-22"],
                "game_time": ["19:30:00"],
                "game_type": ["Regular Season"],
                "home_team_id": ["1610612738"],
                "away_team_id": ["1610612752"],
                "home_team_score": [132],
                "away_team_score": [109],
                "home_q1": [35],
                "home_q2": [30],
                "home_q3": [32],
                "home_q4": [35],
                "home_ot1": [None],
                "home_ot2": [None],
                "home_ot3": [None],
                "home_ot4": [None],
                "away_q1": [28],
                "away_q2": [25],
                "away_q3": [30],
                "away_q4": [26],
                "away_ot1": [None],
                "away_ot2": [None],
                "away_ot3": [None],
                "away_ot4": [None],
                "arena": ["TD Garden"],
                "attendance": [19156],
                "game_duration_minutes": [138],
                "playoff_round": [None],
                "series_game_number": [None],
                "winner_team_id": ["1610612738"],
            }
        )
        mock_execute.return_value = mock_df

        repo = GameRepository()
        result = repo.get_by_id("0022400001")

        assert result is not None
        assert result.game_id == "0022400001"
        assert result.season_id == "2025"
        assert result.home_team_score == 132
        assert result.away_team_score == 109

    @patch("app.repositories.game_repository.execute_query_df")
    def test_get_by_id_returns_none_when_not_found(self, mock_execute: MagicMock) -> None:
        """Test getting a non-existent game returns None."""
        mock_execute.return_value = pd.DataFrame()

        repo = GameRepository()
        result = repo.get_by_id("nonexistent")

        assert result is None


class TestGameRepositoryGetGames:
    """Tests for GameRepository.get_games method."""

    @patch("app.repositories.game_repository.execute_query_df")
    def test_get_games_returns_list(self, mock_execute: MagicMock) -> None:
        """Test getting games returns list of Game objects."""
        mock_df = pd.DataFrame(
            {
                "game_id": ["0022400001", "0022400002"],
                "season_id": ["2025", "2025"],
                "game_date": ["2024-10-22", "2024-10-22"],
                "game_time": ["19:30:00", "20:00:00"],
                "game_type": ["Regular Season", "Regular Season"],
                "home_team_id": ["1610612738", "1610612747"],
                "away_team_id": ["1610612752", "1610612744"],
                "home_team_score": [132, 110],
                "away_team_score": [109, 103],
                "home_q1": [35, 28],
                "home_q2": [30, 27],
                "home_q3": [32, 30],
                "home_q4": [35, 25],
                "home_ot1": [None, None],
                "home_ot2": [None, None],
                "home_ot3": [None, None],
                "home_ot4": [None, None],
                "away_q1": [28, 26],
                "away_q2": [25, 24],
                "away_q3": [30, 28],
                "away_q4": [26, 25],
                "away_ot1": [None, None],
                "away_ot2": [None, None],
                "away_ot3": [None, None],
                "away_ot4": [None, None],
                "arena": ["TD Garden", "Crypto.com Arena"],
                "attendance": [19156, 18997],
                "game_duration_minutes": [138, 142],
                "playoff_round": [None, None],
                "series_game_number": [None, None],
                "winner_team_id": ["1610612738", "1610612747"],
            }
        )
        mock_execute.return_value = mock_df

        repo = GameRepository()
        result = repo.get_games()

        assert len(result) == 2
        assert all(isinstance(g, Game) for g in result)
        assert result[0].game_id == "0022400001"
        assert result[1].game_id == "0022400002"

    @patch("app.repositories.game_repository.execute_query_df")
    def test_get_games_with_date_filter(self, mock_execute: MagicMock) -> None:
        """Test getting games filtered by date."""
        mock_execute.return_value = pd.DataFrame(
            columns=[
                "game_id",
                "season_id",
                "game_date",
                "game_time",
                "game_type",
                "home_team_id",
                "away_team_id",
                "home_team_score",
                "away_team_score",
                "home_q1",
                "home_q2",
                "home_q3",
                "home_q4",
                "home_ot1",
                "home_ot2",
                "home_ot3",
                "home_ot4",
                "away_q1",
                "away_q2",
                "away_q3",
                "away_q4",
                "away_ot1",
                "away_ot2",
                "away_ot3",
                "away_ot4",
                "arena",
                "attendance",
                "game_duration_minutes",
                "playoff_round",
                "series_game_number",
                "winner_team_id",
            ]
        )

        repo = GameRepository()
        repo.get_games(date="2024-10-22")

        # Verify the query included the date filter
        call_args = mock_execute.call_args
        query = call_args[0][0]
        params = call_args[0][1]
        assert "game_date = ?" in query
        assert "2024-10-22" in params

    @patch("app.repositories.game_repository.execute_query_df")
    def test_get_games_returns_empty_list(self, mock_execute: MagicMock) -> None:
        """Test getting games returns empty list when no results."""
        mock_execute.return_value = pd.DataFrame()

        repo = GameRepository()
        result = repo.get_games()

        assert result == []


class TestGameRepositoryGetBoxScores:
    """Tests for GameRepository.get_box_scores method."""

    @patch("app.repositories.game_repository.execute_query_df")
    def test_get_box_scores_returns_list(self, mock_execute: MagicMock) -> None:
        """Test getting box scores returns list of BoxScore objects."""
        mock_df = pd.DataFrame(
            {
                "box_score_id": [1, 2],
                "game_id": ["0022400001", "0022400001"],
                "player_id": ["201566", "203507"],
                "team_id": ["1610612738", "1610612738"],
                "is_starter": [True, True],
                "minutes_played": [32, 28],
                "did_not_play": [False, False],
                "dnp_reason": [None, None],
                "field_goals_made": [10, 8],
                "field_goals_attempted": [18, 15],
                "three_pointers_made": [3, 2],
                "three_pointers_attempted": [7, 5],
                "free_throws_made": [5, 4],
                "free_throws_attempted": [6, 6],
                "offensive_rebounds": [2, 4],
                "defensive_rebounds": [6, 8],
                "total_rebounds": [8, 12],
                "assists": [5, 3],
                "steals": [2, 1],
                "blocks": [1, 4],
                "turnovers": [3, 2],
                "personal_fouls": [2, 4],
                "points": [28, 22],
                "plus_minus": [15, 12],
                "game_score": [25.5, 20.3],
            }
        )
        mock_execute.return_value = mock_df

        repo = GameRepository()
        result = repo.get_box_scores("0022400001")

        assert len(result) == 2
        assert all(isinstance(b, BoxScore) for b in result)
        assert result[0].points == 28
        assert result[1].total_rebounds == 12

    @patch("app.repositories.game_repository.execute_query_df")
    def test_get_box_scores_returns_empty_list(self, mock_execute: MagicMock) -> None:
        """Test getting box scores returns empty list when no results."""
        mock_execute.return_value = pd.DataFrame()

        repo = GameRepository()
        result = repo.get_box_scores("nonexistent")

        assert result == []
