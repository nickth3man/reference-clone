from typing import Any

import numpy as np
from fastapi import APIRouter, HTTPException

from app.database import execute_query_df
from app.models import (
    Player,
    PlayerAdvancedStats,
    PlayerGameLog,
    PlayerSeasonStats,
    PlayerSplits,
)

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


@router.get("/players/{player_id}/gamelog", response_model=list[PlayerGameLog])
def get_player_gamelog(
    player_id: str, season_id: str | None = None
) -> list[dict[str, Any]]:
    params = [player_id]
    query = """
        SELECT 
            b.*,
            g.game_date,
            CASE WHEN b.team_id = g.home_team_id THEN g.away_team_id ELSE g.home_team_id END as opponent_team_id,
            CASE WHEN b.team_id = g.home_team_id THEN TRUE ELSE FALSE END as is_home,
            CASE WHEN b.team_id = g.winner_team_id THEN TRUE ELSE FALSE END as is_win
        FROM box_scores b
        JOIN games g ON b.game_id = g.game_id
        WHERE b.player_id = ?
    """
    if season_id:
        query += " AND g.season_id = ?"
        params.append(season_id)

    query += " ORDER BY g.game_date DESC"

    try:
        df = execute_query_df(query, params)
        if df.empty:
            return []

        df = df.replace({np.nan: None})  # type: ignore
        return df.to_dict(orient="records")  # type: ignore[return-value]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.get("/players/{player_id}/splits", response_model=list[PlayerSplits])
def get_player_splits(
    player_id: str, season_id: str | None = None
) -> list[dict[str, Any]]:
    params = [player_id]
    query = """
        SELECT *
        FROM player_splits
        WHERE player_id = ?
    """
    if season_id:
        query += " AND season_id = ?"
        params.append(season_id)

    query += " ORDER BY season_id DESC, split_type, split_value"

    try:
        df = execute_query_df(query, params)
        if df.empty:
            return []

        df = df.replace({np.nan: None})  # type: ignore
        return df.to_dict(orient="records")  # type: ignore[return-value]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.get("/players/{player_id}/advanced", response_model=list[PlayerAdvancedStats])
def get_player_advanced_stats(
    player_id: str, season_id: str | None = None
) -> list[dict[str, Any]]:
    params = [player_id]
    query = """
        SELECT *
        FROM player_advanced_stats
        WHERE player_id = ?
    """
    if season_id:
        query += " AND season_id = ?"
        params.append(season_id)

    query += " ORDER BY season_id DESC"

    try:
        df = execute_query_df(query, params)
        if df.empty:
            return []

        df = df.replace({np.nan: None})  # type: ignore
        return df.to_dict(orient="records")  # type: ignore[return-value]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
