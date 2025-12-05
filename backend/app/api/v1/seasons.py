"""Season API endpoints."""

from typing import Any

from fastapi import APIRouter, Depends, HTTPException

from app.core.logging import get_logger
from app.dependencies import get_season_repository
from app.models import Season, StandingsItem
from app.repositories.season_repository import SeasonRepository

logger = get_logger(__name__)

router = APIRouter()


@router.get("", response_model=list[Season])
def get_seasons(
    repo: SeasonRepository = Depends(get_season_repository),
) -> list[Season]:
    """Get all seasons."""
    return repo.get_all()


@router.get("/{season_id}", response_model=Season)
def get_season(
    season_id: str,
    repo: SeasonRepository = Depends(get_season_repository),
) -> Season:
    """Get a season by ID."""
    season = repo.get_by_id(season_id)
    if not season:
        raise HTTPException(status_code=404, detail="Season not found")
    return season


@router.get("/{season_id}/standings", response_model=list[StandingsItem])
def get_season_standings(
    season_id: str,
    conference: str | None = None,
    repo: SeasonRepository = Depends(get_season_repository),
) -> list[StandingsItem]:
    """Get standings for a specific season."""
    return repo.get_standings(season_id, conference)


@router.get("/{season_id}/leaders/{stat_category}", response_model=list[dict[str, Any]])
def get_season_leaders(
    season_id: str,
    stat_category: str,
    limit: int = 10,
    repo: SeasonRepository = Depends(get_season_repository),
) -> list[dict[str, Any]]:
    """Get statistical leaders for a season by category.

    Valid stat categories: points_per_game, rebounds_per_game, assists_per_game,
    steals_per_game, blocks_per_game, field_goal_pct, three_point_pct, free_throw_pct
    """
    return repo.get_leaders(season_id, stat_category, limit)


@router.get("/{season_id}/playoffs", response_model=list[dict[str, Any]])
def get_season_playoffs(
    season_id: str,
    repo: SeasonRepository = Depends(get_season_repository),
) -> list[dict[str, Any]]:
    """Get playoff series for a season."""
    return repo.get_playoffs(season_id)
