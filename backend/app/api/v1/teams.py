"""Team API endpoints."""

from typing import Any

from fastapi import APIRouter, Depends, HTTPException

from app.core.logging import get_logger
from app.dependencies import get_team_repository
from app.models import Team, TeamSeasonStats
from app.repositories.team_repository import TeamRepository
from app.utils.dates import get_current_season

logger = get_logger(__name__)

router = APIRouter()


@router.get("", response_model=list[Team])
def get_teams(
    active_only: bool = True,
    repo: TeamRepository = Depends(get_team_repository),
) -> list[Team]:
    """Get all teams, optionally filtered to active NBA teams only."""
    return repo.get_teams(active_only=active_only)


@router.get("/{team_id}", response_model=Team)
def get_team(
    team_id: str,
    repo: TeamRepository = Depends(get_team_repository),
) -> Team:
    """Get a team by ID or abbreviation."""
    team = repo.get_by_id(team_id)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    return team


@router.get("/{team_id}/stats", response_model=list[TeamSeasonStats])
def get_team_stats(
    team_id: str,
    repo: TeamRepository = Depends(get_team_repository),
) -> list[TeamSeasonStats]:
    """Get season statistics for a team."""
    return repo.get_stats(team_id)


@router.get("/{team_id}/roster", response_model=list[dict[str, Any]])
def get_team_roster(
    team_id: str,
    season_id: str | None = None,
    repo: TeamRepository = Depends(get_team_repository),
) -> list[dict[str, Any]]:
    """Get team roster for a specific season."""
    # Use dynamic current season if not specified
    if season_id is None:
        season_id = get_current_season()
        logger.info(f"Using current season: {season_id}")

    return repo.get_roster(team_id, season_id)
