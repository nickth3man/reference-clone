from typing import List, Optional

import numpy as np
from database import execute_query_df
from fastapi import APIRouter, HTTPException
from models import Player

router = APIRouter()


@router.get("/players", response_model=List[Player])
def get_players(search: Optional[str] = None, limit: int = 50, offset: int = 0):
    if search:
        query = """
            SELECT id as person_id, full_name as display_first_last, first_name, last_name
            FROM player
            WHERE LOWER(full_name) LIKE ?
            OR LOWER(last_name) LIKE ?
            LIMIT ? OFFSET ?
        """
        search_term = f"%{search.lower()}%"
        params = [search_term, search_term, limit, offset]
    else:
        query = (
            "SELECT id as person_id, full_name as display_first_last, "
            "first_name, last_name FROM player LIMIT ? OFFSET ?"
        )
        params = [limit, offset]

    try:
        df = execute_query_df(query, params)
        df = df.replace({np.nan: None})
        return df.to_dict(orient="records")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.get("/players/{player_id}", response_model=Player)
def get_player(player_id: str):
    # Try common_player_info first for details
    query = "SELECT * FROM common_player_info WHERE person_id = ?"
    try:
        df = execute_query_df(query, [player_id])
        if not df.empty:
            df = df.replace({np.nan: None})
            return df.to_dict(orient="records")[0]

        # Fallback to player table
        query_fallback = (
            "SELECT id as person_id, full_name as display_first_last, "
            "first_name, last_name FROM player WHERE id = ?"
        )
        df_fallback = execute_query_df(query_fallback, [player_id])

        if df_fallback.empty:
            raise HTTPException(status_code=404, detail="Player not found")

        df_fallback = df_fallback.replace({np.nan: None})
        return df_fallback.to_dict(orient="records")[0]

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.get("/players/{player_id}/stats", response_model=List[dict])
def get_player_stats(player_id: str):
    # Query player_stats_per_game for season stats
    # We select relevant fields.
    query = """
        SELECT
            season_id,
            team_id,
            pts_per_game,
            ast_per_game,
            trb_per_game,
            stl_per_game,
            blk_per_game,
            fg_percent,
            x3p_percent,
            ft_percent,
            games_played,
            games_started,
            minutes_per_game
        FROM player_stats_per_game
        WHERE player_id = ?
        ORDER BY season_id DESC
    """
    try:
        # Note: The column names in the table might be slightly different
        # (e.g. 'seas_id' vs 'season_id').
        # Based on previous inspection, it was 'seas_id'.
        # Let's check inspect_game_stats.py output again. It showed 'seas_id'.
        # Also 'x2p_percent' was shown. 'x3p_percent' might be there too.
        # I'll use a safer query selecting * first to be sure, or just use the columns I saw.
        # Actually, I'll use * and let the frontend pick what it needs, or filter in python.
        # But for performance, specific columns are better.
        # Let's assume standard names but check for 'seas_id'.

        query = "SELECT * FROM player_stats_per_game WHERE player_id = ? ORDER BY seas_id DESC"

        df = execute_query_df(query, [player_id])
        if df.empty:
            return []

        df = df.replace({np.nan: None})
        return df.to_dict(orient="records")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
