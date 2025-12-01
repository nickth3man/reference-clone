from typing import Any, cast

import numpy as np
from fastapi import APIRouter, HTTPException

from app.database import execute_query_df
from app.logging_config import get_logger
from app.models import Season

logger = get_logger(__name__)

router = APIRouter()


@router.get("/seasons", response_model=list[Season])
def get_seasons() -> list[dict[str, Any]]:
    query = "SELECT * FROM seasons ORDER BY end_year DESC"
    df = execute_query_df(query)
    df = df.replace({np.nan: None})  # type: ignore
    return cast(list[dict[str, Any]], df.to_dict(orient="records"))  # type: ignore


@router.get("/seasons/{season_id}", response_model=Season)
def get_season(season_id: str) -> dict[str, Any]:
    query = "SELECT * FROM seasons WHERE season_id = ?"
    df = execute_query_df(query, [season_id])
    if df.empty:
        raise HTTPException(status_code=404, detail="Season not found")

    df = df.replace({np.nan: None})  # type: ignore
    records = cast(list[dict[str, Any]], df.to_dict(orient="records"))  # type: ignore
    return records[0]


@router.get("/seasons/{season_id}/standings", response_model=list[dict[str, Any]])
def get_season_standings(season_id: str) -> list[dict[str, Any]]:
    # Join with teams table to get team details (name, logo, etc.)
    query = """
        SELECT tss.*, t.full_name, t.abbreviation, t.logo_url, t.conference, t.division
        FROM team_season_stats tss
        JOIN teams t ON tss.team_id = t.team_id
        WHERE tss.season_id = ?
        ORDER BY tss.win_pct DESC
    """
    df = execute_query_df(query, [season_id])
    if df.empty:
        return []

    df = df.replace({np.nan: None})  # type: ignore
    return cast(list[dict[str, Any]], df.to_dict(orient="records"))  # type: ignore


@router.get("/seasons/{season_id}/leaders", response_model=dict[str, list[dict[str, Any]]])
def get_season_leaders(season_id: str) -> dict[str, list[dict[str, Any]]]:
    # Pre-defined SQL queries for leaders to avoid constructing SQL using f-strings
    # This avoids potential SQL injection flags from linters and keeps queries explicit
    categories_sql: dict[str, str] = {
        "pts": (
            "SELECT p.player_id, p.full_name, p.headshot_url, "
            "s.points_per_game as value, s.team_id "
            "FROM player_season_stats s "
            "JOIN players p ON s.player_id = p.player_id "
            "WHERE s.season_id = ? "
            "ORDER BY s.points_per_game DESC "
            "LIMIT 5"
        ),
        "trb": (
            "SELECT p.player_id, p.full_name, p.headshot_url, "
            "s.rebounds_per_game as value, s.team_id "
            "FROM player_season_stats s "
            "JOIN players p ON s.player_id = p.player_id "
            "WHERE s.season_id = ? "
            "ORDER BY s.rebounds_per_game DESC "
            "LIMIT 5"
        ),
        "ast": (
            "SELECT p.player_id, p.full_name, p.headshot_url, "
            "s.assists_per_game as value, s.team_id "
            "FROM player_season_stats s "
            "JOIN players p ON s.player_id = p.player_id "
            "WHERE s.season_id = ? "
            "ORDER BY s.assists_per_game DESC "
            "LIMIT 5"
        ),
        "ws": (
            "SELECT p.player_id, p.full_name, p.headshot_url, "
            "s.win_shares as value, s.team_id "
            "FROM player_advanced_stats s "
            "JOIN players p ON s.player_id = p.player_id "
            "WHERE s.season_id = ? "
            "ORDER BY s.win_shares DESC "
            "LIMIT 5"
        ),
        "per": (
            "SELECT p.player_id, p.full_name, p.headshot_url, "
            "s.player_efficiency_rating as value, s.team_id "
            "FROM player_advanced_stats s "
            "JOIN players p ON s.player_id = p.player_id "
            "WHERE s.season_id = ? "
            "ORDER BY s.player_efficiency_rating DESC "
            "LIMIT 5"
        ),
    }
    results = {}

    for key, query in categories_sql.items():
        try:
            df = execute_query_df(query, [season_id])
            if df.empty:
                logger.warning(
                    "No data returned for leader category",
                    extra={"category": key, "season_id": season_id},
                )
            df = df.replace({np.nan: None})  # type: ignore
            results[key] = cast(list[dict[str, Any]], df.to_dict(orient="records"))  # type: ignore
        except Exception as e:
            # Enhanced logging to debug the failed query
            logger.exception(
                "Error fetching leaders",
                extra={
                    "category": key,
                    "season_id": season_id,
                    "error": str(e),
                },
            )
            results[key] = []

    return results  # type: ignore


@router.get("/seasons/{season_id}/playoffs", response_model=list[dict[str, Any]])
def get_season_playoffs(season_id: str) -> list[dict[str, Any]]:
    query = """
        SELECT * FROM playoff_series WHERE season_id = ?
    """
    df = execute_query_df(query, [season_id])
    if df.empty:
        return []

    df = df.replace({np.nan: None})  # type: ignore
    return cast(list[dict[str, Any]], df.to_dict(orient="records"))  # type: ignore
