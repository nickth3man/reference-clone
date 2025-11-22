from typing import Any

import numpy as np
from fastapi import APIRouter, HTTPException

from app.database import execute_query_df
from app.models import Player, PlayerSeasonStats

router = APIRouter()


@router.get("/players", response_model=list[Player])
def get_players(
    search: str | None = None, limit: int = 50, offset: int = 0
) -> list[dict[str, Any]]:
    params: list[Any]

    if search:
        query = """
            SELECT *
            FROM players
            WHERE LOWER(full_name) LIKE ?
            OR LOWER(last_name) LIKE ?
            LIMIT ? OFFSET ?
        """
        search_term = f"%{search.lower()}%"
        params = [search_term, search_term, limit, offset]
    else:
        query = "SELECT * FROM players LIMIT ? OFFSET ?"
        params = [limit, offset]

    try:
        df = execute_query_df(query, params)
        df = df.replace({np.nan: None})  # type: ignore
        return df.to_dict(orient="records")  # type: ignore[return-value]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.get("/players/{player_id}", response_model=Player)
def get_player(player_id: str) -> dict[str, Any]:
    # Query players table
    query = "SELECT * FROM players WHERE player_id = ?"
    try:
        df = execute_query_df(query, [player_id])

        if df.empty:
            raise HTTPException(status_code=404, detail="Player not found")

        df = df.replace({np.nan: None})  # type: ignore
        return df.to_dict(orient="records")[0]  # type: ignore[return-value]

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.get("/players/{player_id}/stats", response_model=list[PlayerSeasonStats])
def get_player_stats(player_id: str) -> list[dict[str, Any]]:
    # Query player_season_stats
    # We might want to join with teams to get team abbrev?
    # The model has team_id.
    # We should probably verify if we need to map team_id back to abbreviation for frontend?
    # Or frontend uses team_id?
    # The model follows schema where team_id is defined.

    query = """
        SELECT *
        FROM player_season_stats
        WHERE player_id = ?
        ORDER BY season_id DESC
    """
    try:
        df = execute_query_df(query, [player_id])
        if df.empty:
            return []

        df = df.replace({np.nan: None})  # type: ignore
        return df.to_dict(orient="records")  # type: ignore[return-value]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
