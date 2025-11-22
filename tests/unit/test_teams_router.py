"""
Unit tests for teams router.
"""

import pytest
import pandas as pd
import numpy as np
from fastapi import HTTPException
from unittest.mock import patch, Mock

from app.routers.teams import get_teams, get_team, get_team_players


class TestGetTeams:
    """Tests for get_teams endpoint."""

    @patch("app.routers.teams.execute_query_df")
    def test_get_teams_success(self, mock_execute: Mock) -> None:
        """Test successful retrieval of all teams."""
        # Create mock DataFrame
        mock_df = pd.DataFrame(
            {
                "team_id": ["1", "2"],
                "abbreviation": ["LAL", "BOS"],
                "nickname": ["Lakers", "Celtics"],
            }
        )
        mock_execute.return_value = mock_df

        result = get_teams()

        assert len(result) == 2
        assert result[0]["team_id"] == "1"
        assert result[1]["abbreviation"] == "BOS"

    @patch("app.routers.teams.execute_query_df")
    def test_get_teams_handles_nan(self, mock_execute: Mock) -> None:
        """Test that NaN values are converted to None."""
        mock_df = pd.DataFrame(
            {"team_id": ["1"], "abbreviation": [np.nan], "nickname": ["Lakers"]}
        )
        mock_execute.return_value = mock_df

        result = get_teams()

        assert result[0]["abbreviation"] is None

    @patch("app.routers.teams.execute_query_df")
    def test_get_teams_handles_exception(self, mock_execute: Mock) -> None:
        """Test that database errors are properly raised as HTTPException."""
        mock_execute.side_effect = Exception("Database error")

        with pytest.raises(HTTPException) as exc_info:
            get_teams()

        assert exc_info.value.status_code == 500
        assert "Database error" in str(exc_info.value.detail)


class TestGetTeam:
    """Tests for get_team endpoint."""

    @patch("app.routers.teams.execute_query_df")
    def test_get_team_success(self, mock_execute: Mock) -> None:
        """Test successful retrieval of a single team."""
        mock_df = pd.DataFrame(
            {
                "team_id": ["1610612738"],
                "abbreviation": ["BOS"],
                "nickname": ["Celtics"],
            }
        )
        mock_execute.return_value = mock_df

        result = get_team("1610612738")

        assert result["team_id"] == "1610612738"
        assert result["abbreviation"] == "BOS"

    @patch("app.routers.teams.execute_query_df")
    def test_get_team_not_found(self, mock_execute: Mock) -> None:
        """Test 404 response when team is not found."""
        mock_execute.return_value = pd.DataFrame()  # Empty DataFrame

        with pytest.raises(HTTPException) as exc_info:
            get_team("999999")

        assert exc_info.value.status_code == 404
        assert "Team not found" in str(exc_info.value.detail)


class TestGetTeamPlayers:
    """Tests for get_team_players endpoint."""

    @patch("app.routers.teams.execute_query_df")
    def test_get_team_players_success(self, mock_execute: Mock) -> None:
        """Test successful retrieval of team roster."""
        mock_df = pd.DataFrame(
            {
                "person_id": ["1", "2"],
                "display_first_last": ["Player One", "Player Two"],
                "position": ["G", "F"],
            }
        )
        mock_execute.return_value = mock_df

        result = get_team_players("1610612738")

        assert len(result) == 2
        assert result[0]["display_first_last"] == "Player One"

    @patch("app.routers.teams.execute_query_df")
    def test_get_team_players_empty_roster(self, mock_execute: Mock) -> None:
        """Test that empty roster returns empty list."""
        mock_execute.return_value = pd.DataFrame()

        result = get_team_players("1610612738")

        assert result == []
