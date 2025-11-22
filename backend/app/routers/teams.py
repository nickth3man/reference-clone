from typing import Any

import numpy as np
from fastapi import APIRouter, HTTPException

from app.database import execute_query_df
from app.logging_config import get_logger
from app.models import Team

logger = get_logger(__name__)
router = APIRouter()


@router.get("/teams", response_model=list[Team])
def get_teams() -> list[dict[str, Any]]:
    logger.info("Fetching all teams")
    query = "SELECT * FROM team_details"
    try:
        df = execute_query_df(query)
        # Replace NaN and Inf with None for JSON compatibility
        df = df.replace({np.nan: None})  # type: ignore
        logger.info("Successfully fetched teams", extra={"count": len(df)})
        return df.to_dict(orient="records")  # type: ignore[return-value]
    except Exception as e:
        logger.error("Failed to fetch teams", extra={"error": str(e)})
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.get("/teams/{team_id}", response_model=Team)
def get_team(team_id: str) -> dict[str, Any]:
    query = "SELECT * FROM team_details WHERE team_id = ?"
    try:
        df = execute_query_df(query, [team_id])
        if df.empty:
            raise HTTPException(status_code=404, detail="Team not found")

        # Replace NaN and Inf with None for JSON compatibility
        df = df.replace({np.nan: None})  # type: ignore
        return df.to_dict(orient="records")[0]  # type: ignore[return-value]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.get("/teams/{team_id}/players", response_model=list[dict[str, Any]])
def get_team_players(team_id: str) -> list[dict[str, Any]]:
    # Query common_player_info for players on this team
    # We select relevant fields. Note: common_player_info might list inactive
    # players too if they were last on this team?
    # Usually common_player_info has current team.
    query = """
        SELECT
            person_id,
            display_first_last,
            position,
            height,
            weight,
            jersey,
            birthdate,
            country
        FROM common_player_info
        WHERE team_id = ?
    """
    try:
        df = execute_query_df(query, [team_id])
        if df.empty:
            return []

        df = df.replace({np.nan: None})  # type: ignore
        return df.to_dict(orient="records")  # type: ignore[return-value]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
