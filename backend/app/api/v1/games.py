"""Game API endpoints."""

from fastapi import APIRouter, Depends, HTTPException

from app.dependencies import get_game_repository
from app.models import Game, TeamGameStats
from app.repositories.game_repository import GameRepository

router = APIRouter()


@router.get("", response_model=list[Game])
def get_games(
    date: str | None = None,
    team_id: str | None = None,
    season_id: str | None = None,
    limit: int = 50,
    offset: int = 0,
    repo: GameRepository = Depends(get_game_repository),
) -> list[Game]:
    """Get games with optional filtering."""
    return repo.get_games(
        date=date,
        team_id=team_id,
        season_id=season_id,
        limit=limit,
        offset=offset,
    )


@router.get("/{game_id}", response_model=Game)
def get_game(
    game_id: str,
    repo: GameRepository = Depends(get_game_repository),
) -> Game:
    """Get a game by ID."""
    game = repo.get_by_id(game_id)
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    return game


@router.get("/{game_id}/stats", response_model=list[TeamGameStats])
def get_game_stats(
    game_id: str,
    repo: GameRepository = Depends(get_game_repository),
) -> list[TeamGameStats]:
    """Get team statistics for a game."""
    return repo.get_game_stats(game_id)
