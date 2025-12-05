"""Box score API endpoints."""

from typing import Any

from fastapi import APIRouter, Depends

from app.dependencies import get_boxscore_repository
from app.models.game import FourFactors, LineScore
from app.repositories.boxscore_repository import BoxscoreRepository

router = APIRouter()


@router.get("/{game_id}", response_model=list[dict[str, Any]])
def get_box_score(
    game_id: str,
    repo: BoxscoreRepository = Depends(get_boxscore_repository),
) -> list[dict[str, Any]]:
    """Get box score for a specific game."""
    return repo.get_by_game_id(game_id)


@router.get("/{game_id}/linescore", response_model=list[LineScore])
def get_line_score(
    game_id: str,
    repo: BoxscoreRepository = Depends(get_boxscore_repository),
) -> list[LineScore]:
    """Get line score for a specific game."""
    return repo.get_line_score(game_id)


@router.get("/{game_id}/fourfactors", response_model=list[FourFactors])
def get_four_factors(
    game_id: str,
    repo: BoxscoreRepository = Depends(get_boxscore_repository),
) -> list[FourFactors]:
    """Get four factors for a specific game."""
    return repo.get_four_factors(game_id)
