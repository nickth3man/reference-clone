"""API v1 routes."""

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
from app.api.v1.router import router

__all__ = [
    "boxscores",
    "contracts",
    "draft",
    "franchises",
    "games",
    "players",
    "router",
    "seasons",
    "teams",
]
