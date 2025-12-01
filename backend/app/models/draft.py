"""Draft-related Pydantic models."""

from pydantic import BaseModel


class DraftPick(BaseModel):
    """Draft pick information."""

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
    years_in_nba: int | None = None
    career_games: int | None = None
    career_minutes_played: int | None = None
    career_minutes_per_game: float | None = None
    career_points: int | None = None
    career_points_per_game: float | None = None
    career_total_rebounds: int | None = None
    career_rebounds_per_game: float | None = None
    career_total_assists: int | None = None
    career_assists_per_game: float | None = None
    career_fg_pct: float | None = None
    career_three_point_pct: float | None = None
    career_ft_pct: float | None = None
    career_win_shares: float | None = None
    career_ws_per_48: float | None = None
    career_box_plus_minus: float | None = None
    career_vorp: float | None = None
