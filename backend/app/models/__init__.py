"""
Pydantic models for the Basketball Reference Clone API.

This module provides domain models split by entity type for better organization.

Usage:
    from app.models import Player, Team, Game
    from app.models.player import PlayerSeasonStats, PlayerAdvancedStats
    from app.models.team import TeamSeasonStats
"""

# Base models
from app.models.base import AppBaseModel

# Player models
from app.models.player import (
    Player,
    PlayerSeasonStats,
    PlayerAdvancedStats,
    PlayerSplits,
    PlayerShootingStats,
    PlayerAdjustedShooting,
    PlayerPlayByPlayStats,
    PlayerGameLog,
)

# Team models
from app.models.team import (
    Team,
    TeamSeasonStats,
    TeamRoster,
    Standings,
)

# Game models
from app.models.game import (
    Game,
    BoxScore,
    TeamGameStats,
    GameStats,
    GamePlayByPlay,
    ShotChartData,
)

# Season models
from app.models.season import (
    Season,
    PlayoffSeries,
    Award,
    LeagueSeasonAverage,
)

# Contract models
from app.models.contract import Contract

# Draft models
from app.models.draft import DraftPick

# Franchise models
from app.models.franchise import Franchise

__all__ = [
    # Base
    "AppBaseModel",
    # Player
    "Player",
    "PlayerSeasonStats",
    "PlayerAdvancedStats",
    "PlayerSplits",
    "PlayerShootingStats",
    "PlayerPlayByPlayStats",
    "PlayerGameLog",
    # Team
    "Team",
    "TeamSeasonStats",
    "TeamRoster",
    "Standings",
    # Game
    "Game",
    "BoxScore",
    "TeamGameStats",
    "GameStats",
    # Season
    "Season",
    "PlayoffSeries",
    "Award",
    # Contract
    "Contract",
    # Draft
    "DraftPick",
    # Franchise
    "Franchise",
]
