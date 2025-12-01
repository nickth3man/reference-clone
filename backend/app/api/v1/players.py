"""Player API endpoints."""

from fastapi import APIRouter, Depends, HTTPException

from app.dependencies import get_player_repository
from app.models import (
    Award,
    Contract,
    Player,
    PlayerAdvancedStats,
    PlayerGameLog,
    PlayerPlayByPlayStats,
    PlayerSeasonStats,
    PlayerShootingStats,
    PlayerSplits,
)
from app.repositories.player_repository import PlayerRepository

router = APIRouter()


@router.get("", response_model=list[Player])
def get_players(
    search: str | None = None,
    letter: str | None = None,
    limit: int = 50,
    offset: int = 0,
    repo: PlayerRepository = Depends(get_player_repository),
) -> list[Player]:
    """Get all players with optional filtering."""
    return repo.get_players(search=search, letter=letter, limit=limit, offset=offset)


@router.get("/{player_id}", response_model=Player)
def get_player(
    player_id: str,
    repo: PlayerRepository = Depends(get_player_repository),
) -> Player:
    """Get a player by ID."""
    player = repo.get_by_id(player_id)
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    return player


@router.get("/{player_id}/stats", response_model=list[PlayerSeasonStats])
def get_player_stats(
    player_id: str,
    repo: PlayerRepository = Depends(get_player_repository),
) -> list[PlayerSeasonStats]:
    """Get season statistics for a player."""
    return repo.get_stats(player_id)


@router.get("/{player_id}/gamelog", response_model=list[PlayerGameLog])
def get_player_gamelog(
    player_id: str,
    season_id: str | None = None,
    repo: PlayerRepository = Depends(get_player_repository),
) -> list[PlayerGameLog]:
    """Get game log for a player."""
    return repo.get_gamelog(player_id, season_id)


@router.get("/{player_id}/splits", response_model=list[PlayerSplits])
def get_player_splits(
    player_id: str,
    season_id: str | None = None,
    repo: PlayerRepository = Depends(get_player_repository),
) -> list[PlayerSplits]:
    """Get split statistics for a player."""
    return repo.get_splits(player_id, season_id)


@router.get("/{player_id}/advanced", response_model=list[PlayerAdvancedStats])
def get_player_advanced_stats(
    player_id: str,
    season_id: str | None = None,
    repo: PlayerRepository = Depends(get_player_repository),
) -> list[PlayerAdvancedStats]:
    """Get advanced statistics for a player."""
    return repo.get_advanced_stats(player_id, season_id)


@router.get("/{player_id}/contracts", response_model=list[Contract])
def get_player_contracts(
    player_id: str,
    repo: PlayerRepository = Depends(get_player_repository),
) -> list[Contract]:
    """Get contracts for a player."""
    return repo.get_contracts(player_id)


@router.get("/{player_id}/shooting", response_model=list[PlayerShootingStats])
def get_player_shooting_stats(
    player_id: str,
    repo: PlayerRepository = Depends(get_player_repository),
) -> list[PlayerShootingStats]:
    """Get shooting statistics for a player."""
    return repo.get_shooting_stats(player_id)


@router.get("/{player_id}/playbyplay", response_model=list[PlayerPlayByPlayStats])
def get_player_play_by_play_stats(
    player_id: str,
    repo: PlayerRepository = Depends(get_player_repository),
) -> list[PlayerPlayByPlayStats]:
    """Get play-by-play statistics for a player."""
    return repo.get_play_by_play_stats(player_id)


@router.get("/{player_id}/awards", response_model=list[Award])
def get_player_awards(
    player_id: str,
    repo: PlayerRepository = Depends(get_player_repository),
) -> list[Award]:
    """Get awards for a player."""
    return repo.get_awards(player_id)


@router.get("/{player_id}/seasons", response_model=list[str])
def get_player_seasons(
    player_id: str,
    repo: PlayerRepository = Depends(get_player_repository),
) -> list[str]:
    """Get list of seasons a player has statistics for."""
    return repo.get_seasons(player_id)
