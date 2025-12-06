"""Unit tests for v1 API teams endpoint."""

from typing import Any
from collections.abc import Generator
from unittest.mock import MagicMock

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.dependencies import get_team_repository
from app.models import Team


class TestTeamsAPI:
    """Tests for teams API endpoints."""

    @pytest.fixture
    def mock_repo(self) -> MagicMock:
        """Create a mock TeamRepository."""
        return MagicMock()

    @pytest.fixture
    def client_with_mock(self, mock_repo: MagicMock) -> Generator[TestClient, None, None]:
        """Create a test client with mocked repository."""
        app.dependency_overrides[get_team_repository] = lambda: mock_repo
        client = TestClient(app)
        yield client
        app.dependency_overrides.clear()

    def test_get_teams_success(
        self,
        mock_repo: MagicMock,
        client_with_mock: TestClient,
        sample_team_data: dict[str, Any],
    ) -> None:
        """Test successful retrieval of all teams."""
        mock_team = Team(**sample_team_data)
        mock_repo.get_teams.return_value = [mock_team]

        response = client_with_mock.get("/api/v1/teams")

        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["team_id"] == sample_team_data["team_id"]
        assert data[0]["abbreviation"] == sample_team_data["abbreviation"]

    def test_get_teams_empty(
        self,
        mock_repo: MagicMock,
        client_with_mock: TestClient,
    ) -> None:
        """Test retrieval when no teams exist."""
        mock_repo.get_teams.return_value = []

        response = client_with_mock.get("/api/v1/teams")

        assert response.status_code == 200
        assert response.json() == []

    def test_get_team_by_id_success(
        self,
        mock_repo: MagicMock,
        client_with_mock: TestClient,
        sample_team_data: dict[str, Any],
    ) -> None:
        """Test successful retrieval of a single team."""
        mock_team = Team(**sample_team_data)
        mock_repo.get_by_id.return_value = mock_team

        response = client_with_mock.get(f"/api/v1/teams/{sample_team_data['team_id']}")

        assert response.status_code == 200
        data = response.json()
        assert data["team_id"] == sample_team_data["team_id"]
        assert data["full_name"] == sample_team_data["full_name"]

    def test_get_team_by_id_not_found(
        self,
        mock_repo: MagicMock,
        client_with_mock: TestClient,
    ) -> None:
        """Test 404 response when team is not found."""
        mock_repo.get_by_id.return_value = None

        response = client_with_mock.get("/api/v1/teams/nonexistent")

        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()
