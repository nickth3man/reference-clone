from typing import Any, cast

import numpy as np
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

from app.database import execute_query_df

router = APIRouter()


class DraftPick(BaseModel):
    pick_id: int
    draft_year: int | None = None
    round: int | None = None
    pick_number: int | None = None
    overall_pick: int | None = None
    player_id: str | None = None
    team_id: str | None = None
    player_name: str | None = None
    college: str | None = None
    nationality: str | None = None
    career_games: int | None = None
    career_points: int | None = None
    career_win_shares: float | None = None
    career_vorp: float | None = None


@router.get("/draft/picks", response_model=list[DraftPick])
def get_draft_picks(
    year: int | None = None,
    team_id: str | None = None,
    limit: int = Query(100, ge=1, le=1000),
    offset: int = 0,
) -> list[dict[str, Any]]:
    query = "SELECT * FROM draft_picks"
    conditions = []
    params: list[Any] = []

    if year:
        conditions.append("draft_year = ?")
        params.append(year)

    if team_id:
        conditions.append("team_id = ?")
        params.append(team_id)

    if conditions:
        query += " WHERE " + " AND ".join(conditions)

    query += " ORDER BY draft_year DESC, overall_pick ASC LIMIT ? OFFSET ?"
    params.extend([limit, offset])

    df = execute_query_df(query, params)
    df = df.replace({np.nan: None})
    return cast(list[dict[str, Any]], df.to_dict(orient="records"))
