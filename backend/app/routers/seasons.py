from typing import Any, cast

import numpy as np
from fastapi import APIRouter, HTTPException

from app.database import execute_query_df
from app.models import Season

router = APIRouter()


@router.get("/seasons", response_model=list[Season])
def get_seasons() -> list[dict[str, Any]]:
    query = "SELECT * FROM seasons ORDER BY end_year DESC"
    df = execute_query_df(query)
    df = df.replace({np.nan: None})
    return cast(list[dict[str, Any]], df.to_dict(orient="records"))


@router.get("/seasons/{season_id}", response_model=Season)
def get_season(season_id: str) -> dict[str, Any]:
    query = "SELECT * FROM seasons WHERE season_id = ?"
    df = execute_query_df(query, [season_id])
    if df.empty:
        raise HTTPException(status_code=404, detail="Season not found")

    df = df.replace({np.nan: None})
    records = cast(list[dict[str, Any]], df.to_dict(orient="records"))
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

    df = df.replace({np.nan: None})
    return cast(list[dict[str, Any]], df.to_dict(orient="records"))


@router.get("/seasons/{season_id}/leaders", response_model=dict[str, list[dict[str, Any]]])
def get_season_leaders(season_id: str) -> dict[str, list[dict[str, Any]]]:
    categories = {
        "pts": ("player_season_stats", "points_per_game"),
        "trb": ("player_season_stats", "rebounds_per_game"),
        "ast": ("player_season_stats", "assists_per_game"),
        "ws": ("player_advanced_stats", "win_shares"),
        "per": ("player_advanced_stats", "player_efficiency_rating"),
    }

    results = {}

    for key, (table, col) in categories.items():
        query = f"""
            SELECT p.player_id, p.full_name, p.headshot_url, s.{col} as value, s.team_id
            FROM {table} s
            JOIN players p ON s.player_id = p.player_id
            WHERE s.season_id = ?
            ORDER BY s.{col} DESC
            LIMIT 5
        """
        try:
            df = execute_query_df(query, [season_id])
            df = df.replace({np.nan: None})
            results[key] = cast(list[dict[str, Any]], df.to_dict(orient="records"))
        except Exception as e:
            print(f"Error fetching leaders for {key}: {e}")
            results[key] = []

    return results
