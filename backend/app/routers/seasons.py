from typing import Any, cast

import numpy as np
from fastapi import APIRouter, HTTPException

from app.database import execute_query_df
from app.models import Season

router = APIRouter()


@router.get("/seasons", response_model=list[Season])
def get_seasons() -> list[dict[str, Any]]:
    query = "SELECT * FROM seasons ORDER BY end_year DESC"
    try:
        df = execute_query_df(query)
        df = df.replace({np.nan: None})  # type: ignore
        return cast(list[dict[str, Any]], df.to_dict(orient="records"))  # type: ignore
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.get("/seasons/{season_id}", response_model=Season)
def get_season(season_id: str) -> dict[str, Any]:
    query = "SELECT * FROM seasons WHERE season_id = ?"
    try:
        df = execute_query_df(query, [season_id])
        if df.empty:
            raise HTTPException(status_code=404, detail="Season not found")

        df = df.replace({np.nan: None})  # type: ignore
        records = cast(list[dict[str, Any]], df.to_dict(orient="records"))  # type: ignore
        return records[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


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
    try:
        df = execute_query_df(query, [season_id])
        if df.empty:
            return []

        df = df.replace({np.nan: None})  # type: ignore
        return cast(list[dict[str, Any]], df.to_dict(orient="records"))  # type: ignore
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
