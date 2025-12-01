from fastapi import APIRouter, Depends, HTTPException

from app.models import (
    Award,
    Contract,
    Player,
    PlayerAdjustedShooting,
    PlayerAdvancedStats,
    PlayerGameLog,
    PlayerPlayByPlayStats,
    PlayerSeasonStats,
    PlayerShootingStats,
    PlayerSplits,
)
from app.repositories.player_repository import PlayerRepository

router = APIRouter()


def get_player_repository() -> PlayerRepository:
    return PlayerRepository()


@router.get("/players", response_model=list[Player])
def get_players(
    search: str | None = None,
    letter: str | None = None,
    limit: int = 50,
    offset: int = 0,
    repo: PlayerRepository = Depends(get_player_repository),
) -> list[Player]:
    return repo.get_players(search=search, letter=letter, limit=limit, offset=offset)


@router.get("/players/{player_id}", response_model=Player)
def get_player(
    player_id: str,
    repo: PlayerRepository = Depends(get_player_repository),
) -> Player:
    player = repo.get_by_id(player_id)
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    return player


@router.get("/players/{player_id}/stats", response_model=list[PlayerSeasonStats])
def get_player_stats(
    player_id: str,
    repo: PlayerRepository = Depends(get_player_repository),
) -> list[PlayerSeasonStats]:
    return repo.get_stats(player_id)


@router.get("/players/{player_id}/gamelog", response_model=list[PlayerGameLog])
def get_player_gamelog(
    player_id: str,
    season_id: str | None = None,
    repo: PlayerRepository = Depends(get_player_repository),
) -> list[PlayerGameLog]:
    return repo.get_gamelog(player_id, season_id)


@router.get("/players/{player_id}/splits", response_model=list[PlayerSplits])
def get_player_splits(
    player_id: str,
    season_id: str | None = None,
    repo: PlayerRepository = Depends(get_player_repository),
) -> list[PlayerSplits]:
    return repo.get_splits(player_id, season_id)


@router.get("/players/{player_id}/advanced", response_model=list[PlayerAdvancedStats])
def get_player_advanced_stats(
    player_id: str,
    season_id: str | None = None,
    repo: PlayerRepository = Depends(get_player_repository),
) -> list[PlayerAdvancedStats]:
    return repo.get_advanced_stats(player_id, season_id)


@router.get("/players/{player_id}/contracts", response_model=list[Contract])
def get_player_contracts(
    player_id: str,
    repo: PlayerRepository = Depends(get_player_repository),
) -> list[Contract]:
    return repo.get_contracts(player_id)


@router.get("/players/{player_id}/shooting", response_model=list[PlayerShootingStats])
def get_player_shooting_stats(
    player_id: str,
    repo: PlayerRepository = Depends(get_player_repository),
) -> list[PlayerShootingStats]:
    return repo.get_shooting_stats(player_id)


@router.get("/players/{player_id}/adjusted_shooting", response_model=list[PlayerAdjustedShooting])
def get_player_adjusted_shooting(
    player_id: str,
    repo: PlayerRepository = Depends(get_player_repository),
) -> list[PlayerAdjustedShooting]:
    return repo.get_adjusted_shooting(player_id)


@router.get("/players/{player_id}/playbyplay", response_model=list[PlayerPlayByPlayStats])
def get_player_play_by_play_stats(
    player_id: str,
    repo: PlayerRepository = Depends(get_player_repository),
) -> list[PlayerPlayByPlayStats]:
    return repo.get_play_by_play_stats(player_id)


@router.get("/players/{player_id}/awards", response_model=list[Award])
def get_player_awards(
    player_id: str,
    repo: PlayerRepository = Depends(get_player_repository),
) -> list[Award]:
    return repo.get_awards(player_id)


@router.get("/players/{player_id}/seasons", response_model=list[str])
def get_player_seasons(
    player_id: str,
    repo: PlayerRepository = Depends(get_player_repository),
) -> list[str]:
    return repo.get_seasons(player_id)
