"""Box score API endpoints."""

from typing import Any

from fastapi import APIRouter, Depends

from app.dependencies import get_boxscore_repository
from app.models.game import LineScore, FourFactors
from app.repositories.boxscore_repository import BoxscoreRepository

router = APIRouter()


@router.get("/{game_id}", response_model=list[dict[str, Any]])
def get_box_score(
    game_id: str,
    repo: BoxscoreRepository = Depends(get_boxscore_repository),
) -> list[dict[str, Any]]:
    """Get box score for a specific game."""
    return repo.get_by_game_id(game_id)


@router.get("/{game_id}/linescore", response_model=LineScore)
def get_line_score(game_id: str) -> LineScore:
    """Get line score for a specific game."""
    # Execute query to get line score data from games table
    query = """
        SELECT 
            'Home' as team,
            home_q1, home_q2, home_q3, home_q4, 
            home_ot1, home_ot2, home_ot3, home_ot4,
            home_team_score as total
        FROM games
        WHERE game_id = ?
        UNION ALL
        SELECT 
            'Away' as team,
            away_q1, away_q2, away_q3, away_q4, 
            away_ot1, away_ot2, away_ot3, away_ot4,
            away_team_score as total
        FROM games
        WHERE game_id = ?
    """
    
    from app.database import execute_query_df
    df = execute_query_df(query, [game_id, game_id])
    
    if df.empty:
        raise Exception(f"Game {game_id} not found")
    
    # Process the dataframe to create LineScore objects
    if not df.empty and 'team' in df.columns:
        # Get home team line score
        home_df = df[df['team'] == 'Home']
        if not home_df.empty:
            home_row = home_df.iloc[0]
            return LineScore(
                team="Home",
                q1=home_row['home_q1'],
                q2=home_row['home_q2'],
                q3=home_row['home_q3'],
                q4=home_row['home_q4'],
                ot1=home_row['home_ot1'],
                ot2=home_row['home_ot2'],
                ot3=home_row['home_ot3'],
                ot4=home_row['home_ot4'],
                total=home_row['total']
            )
    
    # Fallback - return a default LineScore
    return LineScore(team="Home")


@router.get("/{game_id}/fourfactors", response_model=FourFactors)
def get_four_factors(game_id: str) -> FourFactors:
    """Get four factors for a specific game."""
    # Execute query to get four factors data from team_game_stats table
    query = """
        SELECT 
            'Home' as team,
            pace,
            effective_fg_pct,
            turnover_pct,
            offensive_rebound_pct,
            free_throw_rate,
            offensive_rating
        FROM team_game_stats
        WHERE game_id = ? AND is_home = true
        UNION ALL
        SELECT 
            'Away' as team,
            pace,
            effective_fg_pct,
            turnover_pct,
            offensive_rebound_pct,
            free_throw_rate,
            offensive_rating
        FROM team_game_stats
        WHERE game_id = ? AND is_home = false
    """
    
    from app.database import execute_query_df
    df = execute_query_df(query, [game_id, game_id])
    
    if df.empty:
        raise Exception(f"Game {game_id} not found")
    
    # Process the dataframe to create FourFactors objects
    if not df.empty and 'team' in df.columns:
        # Get home team four factors
        home_df = df[df['team'] == 'Home']
        if not home_df.empty:
            home_row = home_df.iloc[0]
            return FourFactors(
                team="Home",
                pace=home_row['pace'],
                effective_fg_pct=home_row['effective_fg_pct'],
                turnover_pct=home_row['turnover_pct'],
                offensive_rebound_pct=home_row['offensive_rebound_pct'],
                free_throw_rate=home_row['free_throw_rate'],
                offensive_rating=home_row['offensive_rating']
            )
    
    # Fallback - return a default FourFactors
    return FourFactors(team="Home")
