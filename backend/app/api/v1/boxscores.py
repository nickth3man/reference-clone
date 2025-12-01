"""Box score API endpoints."""

from typing import Any

from fastapi import APIRouter, Depends

from app.dependencies import get_boxscore_repository
from app.repositories.boxscore_repository import BoxscoreRepository

router = APIRouter()


@router.get("/{game_id}", response_model=list[dict[str, Any]])
def get_box_score(
    game_id: str,
    repo: BoxscoreRepository = Depends(get_boxscore_repository),
) -> list[dict[str, Any]]:
    """Get box score for a specific game."""
    return repo.get_by_game_id(game_id)
