"""Pytest configuration and fixtures for backend tests.

This module provides shared fixtures for testing the Basketball Reference Clone API.
"""

import sys
from pathlib import Path
from typing import Any, Generator
from unittest.mock import MagicMock

import pytest
from fastapi.testclient import TestClient

# Add the backend directory to sys.path
backend_path = Path(__file__).parent.parent
sys.path.insert(0, str(backend_path))

from app.main import app
from app.dependencies import (
    get_player_repository,
    get_team_repository,
    get_game_repository,
    get_season_repository,
)


@pytest.fixture
def client() -> Generator[TestClient, None, None]:
    """Create a test client for the FastAPI app."""
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def mock_player_repository() -> MagicMock:
    """Create a mock PlayerRepository."""
    return MagicMock()


@pytest.fixture
def mock_team_repository() -> MagicMock:
    """Create a mock TeamRepository."""
    return MagicMock()


@pytest.fixture
def mock_game_repository() -> MagicMock:
    """Create a mock GameRepository."""
    return MagicMock()


@pytest.fixture
def mock_season_repository() -> MagicMock:
    """Create a mock SeasonRepository."""
    return MagicMock()


@pytest.fixture
def client_with_mocked_repos(
    mock_player_repository: MagicMock,
    mock_team_repository: MagicMock,
    mock_game_repository: MagicMock,
    mock_season_repository: MagicMock,
) -> Generator[TestClient, None, None]:
    """Create a test client with all repositories mocked.

    Use this fixture when you want to test API endpoints without hitting the database.
    """
    app.dependency_overrides[get_player_repository] = lambda: mock_player_repository
    app.dependency_overrides[get_team_repository] = lambda: mock_team_repository
    app.dependency_overrides[get_game_repository] = lambda: mock_game_repository
    app.dependency_overrides[get_season_repository] = lambda: mock_season_repository

    with TestClient(app) as test_client:
        yield test_client

    # Clear overrides after test
    app.dependency_overrides.clear()


# Sample data fixtures for common test scenarios
@pytest.fixture
def sample_team_data() -> dict[str, Any]:
    """Sample team data for testing."""
    return {
        "team_id": "1610612738",
        "abbreviation": "BOS",
        "nickname": "Celtics",
        "full_name": "Boston Celtics",
        "city": "Boston",
        "arena": "TD Garden",
        "conference": "Eastern",
        "division": "Atlantic",
        "is_active": True,
    }


@pytest.fixture
def sample_player_data() -> dict[str, Any]:
    """Sample player data for testing."""
    return {
        "player_id": "jamesle01",
        "full_name": "LeBron James",
        "first_name": "LeBron",
        "last_name": "James",
        "position": "F",
        "height_inches": 81,
        "weight_lbs": 250,
        "birth_date": "1984-12-30",
        "college": "None",
        "is_active": True,
    }


@pytest.fixture
def sample_game_data() -> dict[str, Any]:
    """Sample game data for testing."""
    return {
        "game_id": "0022400001",
        "season_id": "2025",
        "game_date": "2024-10-22",
        "game_type": "Regular Season",
        "home_team_id": "1610612738",
        "away_team_id": "1610612752",
        "home_team_score": 110,
        "away_team_score": 105,
    }


@pytest.fixture
def sample_season_data() -> dict[str, Any]:
    """Sample season data for testing."""
    return {
        "season_id": "2025",
        "league": "NBA",
        "start_year": 2024,
        "end_year": 2025,
        "num_teams": 30,
    }
