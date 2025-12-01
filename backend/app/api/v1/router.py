"""API v1 router aggregation.

This module aggregates all v1 API routes into a single router
for easy inclusion in the main FastAPI application.
"""

from fastapi import APIRouter

from app.api.v1 import (
    boxscores,
    contracts,
    draft,
    franchises,
    games,
    players,
    seasons,
    teams,
)

router = APIRouter(prefix="/api/v1")

# Include all routers with their respective prefixes and tags
router.include_router(players.router, prefix="/players", tags=["Players"])
router.include_router(teams.router, prefix="/teams", tags=["Teams"])
router.include_router(games.router, prefix="/games", tags=["Games"])
router.include_router(seasons.router, prefix="/seasons", tags=["Seasons"])
router.include_router(boxscores.router, prefix="/boxscores", tags=["Box Scores"])
router.include_router(contracts.router, prefix="/contracts", tags=["Contracts"])
router.include_router(draft.router, prefix="/draft", tags=["Draft"])
router.include_router(franchises.router, prefix="/franchises", tags=["Franchises"])
