from typing import Any, cast

import numpy as np
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.database import execute_query_df

router = APIRouter()


class Franchise(BaseModel):
    franchise_id: str
    current_team_id: str | None = None
    original_name: str | None = None
    founded_year: int | None = None
    total_championships: int | None = None
    total_seasons: int | None = None
    total_wins: int | None = None
    total_losses: int | None = None


@router.get("/franchises", response_model=list[Franchise])
def get_franchises() -> list[dict[str, Any]]:
    query = "SELECT * FROM franchises"
    try:
        df = execute_query_df(query)
        df = df.replace({np.nan: None})
        return cast(list[dict[str, Any]], df.to_dict(orient="records"))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.get("/franchises/{franchise_id}", response_model=Franchise)
def get_franchise(franchise_id: str) -> dict[str, Any]:
    query = "SELECT * FROM franchises WHERE franchise_id = ?"
    try:
        df = execute_query_df(query, [franchise_id])
        if df.empty:
            raise HTTPException(status_code=404, detail="Franchise not found")
        df = df.replace({np.nan: None})
        return cast(list[dict[str, Any]], df.to_dict(orient="records"))[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
