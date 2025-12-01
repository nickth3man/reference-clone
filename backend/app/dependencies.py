"""Dependency injection for FastAPI routes.

This module provides centralized dependency injection for repositories
and other shared resources.

Usage:
    from fastapi import Depends
    from app.dependencies import get_player_repository

    @router.get("/players/{player_id}")
    def get_player(
        player_id: str,
        repo: PlayerRepository = Depends(get_player_repository),
    ):
        return repo.get_by_id(player_id)
"""

from functools import lru_cache

from app.repositories.boxscore_repository import BoxscoreRepository
from app.repositories.contract_repository import ContractRepository
from app.repositories.draft_repository import DraftRepository
from app.repositories.franchise_repository import FranchiseRepository
from app.repositories.game_repository import GameRepository
from app.repositories.player_repository import PlayerRepository
from app.repositories.season_repository import SeasonRepository
from app.repositories.team_repository import TeamRepository


@lru_cache
def get_player_repository() -> PlayerRepository:
    """Get a cached PlayerRepository instance."""
    return PlayerRepository()


@lru_cache
def get_team_repository() -> TeamRepository:
    """Get a cached TeamRepository instance."""
    return TeamRepository()


@lru_cache
def get_game_repository() -> GameRepository:
    """Get a cached GameRepository instance."""
    return GameRepository()


@lru_cache
def get_season_repository() -> SeasonRepository:
    """Get a cached SeasonRepository instance."""
    return SeasonRepository()


@lru_cache
def get_boxscore_repository() -> BoxscoreRepository:
    """Get a cached BoxscoreRepository instance."""
    return BoxscoreRepository()


@lru_cache
def get_contract_repository() -> ContractRepository:
    """Get a cached ContractRepository instance."""
    return ContractRepository()


@lru_cache
def get_draft_repository() -> DraftRepository:
    """Get a cached DraftRepository instance."""
    return DraftRepository()


@lru_cache
def get_franchise_repository() -> FranchiseRepository:
    """Get a cached FranchiseRepository instance."""
    return FranchiseRepository()
