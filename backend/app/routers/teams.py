from typing import Any, cast

import numpy as np
from fastapi import APIRouter, HTTPException

from app.database import execute_query_df
from app.models import Team, TeamSeasonStats

router = APIRouter()


@router.get("/teams", response_model=list[Team])
def get_teams(active_only: bool = True) -> list[dict[str, Any]]:
    query = "SELECT * FROM teams"
    params: list[Any] = []

    if active_only:
        # Filter for active teams AND ensure they are part of the NBA
        # This filters out historical/obscure teams that might be marked active but not relevant
        query += " WHERE is_active = TRUE AND league = 'NBA'"

    query += " ORDER BY full_name"

    try:
        df = execute_query_df(query, params)
        df = df.replace({np.nan: None})
        return cast(list[dict[str, Any]], df.to_dict(orient="records"))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.get("/teams/{team_id}", response_model=Team)
def get_team(team_id: str) -> dict[str, Any]:
    query = "SELECT * FROM teams WHERE team_id = ?"
    try:
        df = execute_query_df(query, [team_id])

        if df.empty:
            # Try to match by abbreviation if ID fails?
            query = "SELECT * FROM teams WHERE abbreviation = ?"
            df = execute_query_df(query, [team_id])
            if df.empty:
                raise HTTPException(status_code=404, detail="Team not found")

        df = df.replace({np.nan: None})
        records = cast(list[dict[str, Any]], df.to_dict(orient="records"))
        return records[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.get("/teams/{team_id}/stats", response_model=list[TeamSeasonStats])
def get_team_stats(team_id: str) -> list[dict[str, Any]]:
    query = """
        SELECT *
        FROM team_season_stats
        WHERE team_id = ?
        ORDER BY season_id DESC
    """
    try:
        # First resolve team_id if it's an abbreviation
        team_df = execute_query_df(
            "SELECT team_id FROM teams WHERE team_id = ? OR abbreviation = ?", [team_id, team_id]
        )
        resolved_team_id = team_df.iloc[0]["team_id"] if not team_df.empty else team_id

        df = execute_query_df(query, [resolved_team_id])
        if df.empty:
            return []

        df = df.replace({np.nan: None})
        return cast(list[dict[str, Any]], df.to_dict(orient="records"))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


# NOTE: Roster endpoint might need `player_season_stats` or `player_contracts`.
# For now, finding players who played for the team in current season?
# Or just active players?
# We will use player_season_stats for a specific season roster.


@router.get("/teams/{team_id}/roster", response_model=list[dict[str, Any]])
def get_team_roster(team_id: str, season_id: str = "2025") -> list[dict[str, Any]]:
    # Join player_season_stats with players
    query = """
        SELECT p.*, s.season_id, s.team_id
        FROM players p
        JOIN player_season_stats s ON p.player_id = s.player_id
        WHERE s.team_id = ? AND s.season_id = ?
    """
    # Note: Team ID might be different from Abbr in stats?
    # My `load_stats.py` mapped abbrevs to team_ids.
    # So we query by team_id.

    try:
        # First verify team exists (and resolve ID if abbr provided)
        team_df = execute_query_df(
            "SELECT team_id FROM teams WHERE team_id = ? OR abbreviation = ?", [team_id, team_id]
        )
        resolved_team_id = (
            team_df.iloc[0]["team_id"] if not team_df.empty else team_id
        )  # Try anyway or 404

        df = execute_query_df(query, [resolved_team_id, season_id])

        if df.empty:
            return []

        df = df.replace({np.nan: None})
        return cast(list[dict[str, Any]], df.to_dict(orient="records"))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
