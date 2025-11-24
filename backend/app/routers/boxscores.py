from typing import Any, cast

import numpy as np
from fastapi import APIRouter, HTTPException

from app.database import execute_query_df

router = APIRouter()


@router.get("/boxscores/{game_id}", response_model=list[dict[str, Any]])
def get_box_score(game_id: str) -> list[dict[str, Any]]:
    # Join with players and teams for display info
    query = """
        SELECT bs.*, p.full_name, p.headshot_url, t.abbreviation as team_abbreviation, t.full_name as team_name
        FROM box_scores bs
        JOIN players p ON bs.player_id = p.player_id
        JOIN teams t ON bs.team_id = t.team_id
        WHERE bs.game_id = ?
        ORDER BY bs.team_id, bs.is_starter DESC, bs.minutes_played DESC
    """
    df = execute_query_df(query, [game_id])
    if df.empty:
        return []

    df = df.replace({np.nan: None})
    return cast(list[dict[str, Any]], df.to_dict(orient="records"))
