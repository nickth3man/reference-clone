"""GraphQL schema and resolvers using Strawberry."""

from typing import Any, cast

import numpy as np
import strawberry

from app.database import execute_query_df
from app.logging_config import get_logger

logger = get_logger(__name__)


@strawberry.type
class Team:
    """GraphQL type for Team."""

    team_id: str
    abbreviation: str | None = None
    nickname: str | None = None
    full_name: str | None = None
    city: str | None = None
    arena: str | None = None
    conference: str | None = None
    division: str | None = None
    is_active: bool | None = None


@strawberry.type
class Player:
    """GraphQL type for Player."""

    player_id: str
    full_name: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    position: str | None = None
    height_inches: int | None = None
    weight_lbs: int | None = None
    college: str | None = None
    is_active: bool | None = None


@strawberry.type
class Game:
    """GraphQL type for Game."""

    game_id: str
    game_date: str | None = None
    game_type: str | None = None
    home_team_id: str | None = None
    away_team_id: str | None = None
    home_team_score: int | None = None
    away_team_score: int | None = None


@strawberry.type
class Query:
    """GraphQL Query root."""

    @strawberry.field
    def teams(self, active_only: bool = True) -> list[Team]:
        """Get all teams."""
        logger.info("GraphQL: Fetching all teams")
        query = """
            SELECT team_id, abbreviation, nickname, full_name, city, arena,
                   conference, division, is_active
            FROM teams
        """
        if active_only:
            query += " WHERE is_active = TRUE AND league = 'NBA'"
        query += " ORDER BY full_name"
        df = execute_query_df(query)
        df = df.replace({np.nan: None})  # type: ignore
        records = cast(list[dict[str, Any]], df.to_dict(orient="records"))  # type: ignore
        return [Team(**row) for row in records]

    @strawberry.field
    def team(self, team_id: str) -> Team | None:
        """Get team by ID."""
        logger.info(f"GraphQL: Fetching team {team_id}")
        query = """
            SELECT team_id, abbreviation, nickname, full_name, city, arena,
                   conference, division, is_active
            FROM teams
            WHERE team_id = ? OR abbreviation = ?
        """
        df = execute_query_df(query, [team_id, team_id])
        if df.empty:
            return None
        df = df.replace({np.nan: None})  # type: ignore
        records = cast(list[dict[str, Any]], df.to_dict(orient="records"))  # type: ignore
        return Team(**records[0])

    @strawberry.field
    def players(self, limit: int = 50, offset: int = 0) -> list[Player]:
        """Get all players with pagination."""
        logger.info(f"GraphQL: Fetching players (limit={limit}, offset={offset})")
        query = """
            SELECT player_id, full_name, first_name, last_name, position,
                   height_inches, weight_lbs, college, is_active
            FROM players
            LIMIT ? OFFSET ?
        """
        df = execute_query_df(query, [limit, offset])
        df = df.replace({np.nan: None})  # type: ignore
        records = cast(list[dict[str, Any]], df.to_dict(orient="records"))  # type: ignore
        return [Player(**row) for row in records]

    @strawberry.field
    def player(self, player_id: str) -> Player | None:
        """Get player by ID."""
        logger.info(f"GraphQL: Fetching player {player_id}")
        query = """
            SELECT player_id, full_name, first_name, last_name, position,
                   height_inches, weight_lbs, college, is_active
            FROM players
            WHERE player_id = ?
        """
        df = execute_query_df(query, [player_id])
        if df.empty:
            return None
        df = df.replace({np.nan: None})  # type: ignore
        records = cast(list[dict[str, Any]], df.to_dict(orient="records"))  # type: ignore
        return Player(**records[0])

    @strawberry.field
    def games(self, limit: int = 20) -> list[Game]:
        """Get recent games."""
        logger.info(f"GraphQL: Fetching games (limit={limit})")
        query = """
            SELECT game_id, CAST(game_date AS VARCHAR) as game_date, game_type,
                   home_team_id, away_team_id, home_team_score, away_team_score
            FROM games
            ORDER BY game_date DESC
            LIMIT ?
        """
        df = execute_query_df(query, [limit])
        df = df.replace({np.nan: None})  # type: ignore
        records = cast(list[dict[str, Any]], df.to_dict(orient="records"))  # type: ignore
        return [Game(**row) for row in records]


# Create schema
schema = strawberry.Schema(query=Query)
