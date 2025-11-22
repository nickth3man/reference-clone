"""
GraphQL schema and resolvers using Strawberry.
"""

from typing import List, Optional

import numpy as np
import strawberry

from app.database import execute_query_df
from app.logging_config import get_logger

logger = get_logger(__name__)


@strawberry.type
class Team:
    """GraphQL type for Team."""

    team_id: str
    abbreviation: Optional[str] = None
    nickname: Optional[str] = None
    city: Optional[str] = None
    arena: Optional[str] = None


@strawberry.type
class Player:
    """GraphQL type for Player."""

    person_id: str
    display_first_last: Optional[str] = None
    team_name: Optional[str] = None
    position: Optional[str] = None
    height: Optional[str] = None
    weight: Optional[str] = None
    country: Optional[str] = None


@strawberry.type
class Game:
    """GraphQL type for Game."""

    game_id: str
    game_date: Optional[str] = None
    team_abbreviation_home: Optional[str] = None
    team_abbreviation_away: Optional[str] = None
    pts_home: Optional[float] = None
    pts_away: Optional[float] = None


@strawberry.type
class Query:
    """GraphQL Query root."""

    @strawberry.field
    def teams(self) -> List[Team]:
        """Get all teams."""
        logger.info("GraphQL: Fetching all teams")
        query = "SELECT team_id, abbreviation, nickname, city, arena FROM team_details"
        df = execute_query_df(query)
        df = df.replace({np.nan: None})
        return [Team(**row) for row in df.to_dict(orient="records")]

    @strawberry.field
    def team(self, team_id: str) -> Optional[Team]:
        """Get team by ID."""
        logger.info(f"GraphQL: Fetching team {team_id}")
        query = "SELECT team_id, abbreviation, nickname, city, arena FROM team_details WHERE team_id = ?"
        df = execute_query_df(query, [team_id])
        if df.empty:
            return None
        df = df.replace({np.nan: None})
        return Team(**df.to_dict(orient="records")[0])

    @strawberry.field
    def players(self, limit: int = 50, offset: int = 0) -> List[Player]:
        """Get all players with pagination."""
        logger.info(f"GraphQL: Fetching players (limit={limit}, offset={offset})")
        query = """
            SELECT person_id, display_first_last, team_name, position,
                   height, weight, country
            FROM common_player_info
            LIMIT ? OFFSET ?
        """
        df = execute_query_df(query, [limit, offset])
        df = df.replace({np.nan: None})
        return [Player(**row) for row in df.to_dict(orient="records")]

    @strawberry.field
    def player(self, player_id: str) -> Optional[Player]:
        """Get player by ID."""
        logger.info(f"GraphQL: Fetching player {player_id}")
        query = """
            SELECT person_id, display_first_last, team_name, position,
                   height, weight, country
            FROM common_player_info
            WHERE person_id = ?
        """
        df = execute_query_df(query, [player_id])
        if df.empty:
            return None
        df = df.replace({np.nan: None})
        return Player(**df.to_dict(orient="records")[0])

    @strawberry.field
    def games(self, limit: int = 20) -> List[Game]:
        """Get recent games."""
        logger.info(f"GraphQL: Fetching games (limit={limit})")
        query = """
            SELECT game_id, game_date, team_abbreviation_home,
                   team_abbreviation_away, pts_home, pts_away
            FROM game
            ORDER BY game_date DESC
            LIMIT ?
        """
        df = execute_query_df(query, [limit])
        df = df.replace({np.nan: None})
        return [Game(**row) for row in df.to_dict(orient="records")]


# Create schema
schema = strawberry.Schema(query=Query)
