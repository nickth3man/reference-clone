from fastapi import APIRouter, HTTPException
from typing import List, Optional, Any
from database import execute_query_df
from models import Game, GameStats
import numpy as np

router = APIRouter()

@router.get("/games", response_model=List[Game])
def get_games(
    date: Optional[str] = None, 
    team_id: Optional[str] = None, 
    limit: int = 50, 
    offset: int = 0
):
    query = "SELECT * FROM game"
    conditions = []
    params: List[Any] = []
    
    if date:
        conditions.append("game_date = ?")
        params.append(date)
        
    if team_id:
        conditions.append("(team_id_home = ? OR team_id_away = ?)")
        params.extend([team_id, team_id])
        
    if conditions:
        query += " WHERE " + " AND ".join(conditions)
        
    query += " LIMIT ? OFFSET ?"
    params.extend([limit, offset])
    
    try:
        df = execute_query_df(query, params)
        df = df.replace({np.nan: None})
        return df.to_dict(orient="records")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e

@router.get("/games/{game_id}", response_model=Game)
def get_game(game_id: str):
    query = "SELECT * FROM game WHERE game_id = ?"
    try:
        df = execute_query_df(query, [game_id])
        if df.empty:
            raise HTTPException(status_code=404, detail="Game not found")
        
        df = df.replace({np.nan: None})
        return df.to_dict(orient="records")[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e

@router.get("/games/{game_id}/stats", response_model=Optional[GameStats])
def get_game_stats(game_id: str):
    query = "SELECT * FROM other_stats WHERE game_id = ?"
    try:
        df = execute_query_df(query, [game_id])
        if df.empty:
            return None
        
        df = df.replace({np.nan: None})
        return df.to_dict(orient="records")[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
