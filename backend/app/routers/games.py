from typing import Any, cast

import numpy as np
import pandas as pd
from fastapi import APIRouter, HTTPException

from app.database import execute_query_df
from app.models import Game, GameStats

router = APIRouter()


@router.get("/games", response_model=list[Game])
def get_games(
    date: str | None = None,
    team_id: str | None = None,
    limit: int = 50,
    offset: int = 0,
) -> list[dict[str, Any]]:
    # [REVIEW] Severity: Medium. Performance. Avoid 'SELECT *'.
    query = """
        SELECT
            game_id, season_id, game_date, game_time, game_type,
            home_team_id, away_team_id, home_team_score, away_team_score,
            home_q1, home_q2, home_q3, home_q4, home_ot1, home_ot2, home_ot3, home_ot4,
            away_q1, away_q2, away_q3, away_q4, away_ot1, away_ot2, away_ot3, away_ot4,
            arena, attendance, game_duration_minutes, playoff_round,
            series_game_number, winner_team_id
        FROM games
    """
    conditions: list[str] = []
    params: list[Any] = []

    if date:
        conditions.append("game_date = ?")
        params.append(date)

    if team_id:
        # [REVIEW] Severity: Low. Performance. Consider caching team lookups to reduce DB load.
        # Resolve abbreviation to ID if needed
        team_lookup = execute_query_df(
            "SELECT team_id FROM teams WHERE team_id = ? OR abbreviation = ?", [team_id, team_id],
        )

        if not team_lookup.empty:
            resolved_team_id = team_lookup.iloc[0]["team_id"]
            conditions.append("(home_team_id = ? OR away_team_id = ?)")
            params.extend([resolved_team_id, resolved_team_id])
        else:
            conditions.append("(home_team_id = ? OR away_team_id = ?)")
            params.extend([team_id, team_id])

    if conditions:
        query += " WHERE " + " AND ".join(conditions)

    query += " ORDER BY game_date DESC, game_time DESC"
    query += " LIMIT ? OFFSET ?"
    params.extend([limit, offset])

    df = execute_query_df(query, params)
    df = cast(pd.DataFrame, df.replace({np.nan: None}))
    return cast(list[dict[str, Any]], df.to_dict(orient="records"))


@router.get("/games/{game_id}", response_model=Game)
def get_game(game_id: str) -> dict[str, Any]:
    query = """
        SELECT
            game_id, season_id, game_date, game_time, game_type,
            home_team_id, away_team_id, home_team_score, away_team_score,
            home_q1, home_q2, home_q3, home_q4, home_ot1, home_ot2, home_ot3, home_ot4,
            away_q1, away_q2, away_q3, away_q4, away_ot1, away_ot2, away_ot3, away_ot4,
            arena, attendance, game_duration_minutes, playoff_round,
            series_game_number, winner_team_id
        FROM games WHERE game_id = ?
    """
    df = execute_query_df(query, [game_id])
    if df.empty:
        raise HTTPException(status_code=404, detail="Game not found")

    df = cast(pd.DataFrame, df.replace({np.nan: None}))
    return cast(list[dict[str, Any]], df.to_dict(orient="records"))[0]


@router.get("/games/{game_id}/stats", response_model=GameStats | None)
def get_game_stats(game_id: str) -> dict[str, Any] | None:
    query = "SELECT * FROM team_game_stats WHERE game_id = ?"
    df = execute_query_df(query, [game_id])
    if df.empty:
        return None

    df = cast(pd.DataFrame, df.replace({np.nan: None}))
    return cast(list[dict[str, Any]], df.to_dict(orient="records"))[0]
