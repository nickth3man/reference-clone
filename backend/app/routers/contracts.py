from datetime import date
from typing import Any, cast

import numpy as np
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

from app.database import execute_query_df

router = APIRouter()


class Contract(BaseModel):
    contract_id: int
    player_id: str | None = None
    team_id: str | None = None
    contract_type: str | None = None
    signing_date: date | None = None
    total_value: float | None = None
    years: int | None = None
    year_1_salary: float | None = None
    year_2_salary: float | None = None
    year_3_salary: float | None = None
    year_4_salary: float | None = None
    year_5_salary: float | None = None
    year_6_salary: float | None = None
    guaranteed_money: float | None = None
    is_active: bool | None = None


@router.get("/contracts", response_model=list[Contract])
def get_contracts(
    player_id: str | None = None,
    team_id: str | None = None,
    is_active: bool | None = None,
    limit: int = Query(100, ge=1, le=1000),
    offset: int = 0,
) -> list[dict[str, Any]]:
    query = "SELECT * FROM player_contracts"
    conditions = []
    params: list[Any] = []

    if player_id:
        conditions.append("player_id = ?")
        params.append(player_id)

    if team_id:
        conditions.append("team_id = ?")
        params.append(team_id)

    if is_active is not None:
        conditions.append("is_active = ?")
        params.append(is_active)

    if conditions:
        query += " WHERE " + " AND ".join(conditions)

    query += " ORDER BY total_value DESC NULLS LAST LIMIT ? OFFSET ?"
    params.extend([limit, offset])

    df = execute_query_df(query, params)
    df = df.replace({np.nan: None})
    return cast(list[dict[str, Any]], df.to_dict(orient="records"))
