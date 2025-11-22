from typing import List

import numpy as np
from database import execute_query_df
from fastapi import APIRouter, HTTPException
from models import Team

router = APIRouter()


@router.get("/teams", response_model=List[Team])
def get_teams():
    query = "SELECT * FROM team_details"
    try:
        df = execute_query_df(query)
        # Replace NaN and Inf with None for JSON compatibility
        df = df.replace({np.nan: None})
        return df.to_dict(orient="records")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.get("/teams/{team_id}", response_model=Team)
def get_team(team_id: str):
    query = "SELECT * FROM team_details WHERE team_id = ?"
    try:
        df = execute_query_df(query, [team_id])
        if df.empty:
            raise HTTPException(status_code=404, detail="Team not found")

        # Replace NaN and Inf with None for JSON compatibility
        df = df.replace({np.nan: None})
        return df.to_dict(orient="records")[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.get("/teams/{team_id}/players", response_model=List[dict])
def get_team_players(team_id: str):
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

        df = df.replace({np.nan: None})
        return df.to_dict(orient="records")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
