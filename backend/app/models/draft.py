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
    career_games: int | None = None
    career_points: int | None = None
    career_win_shares: float | None = None
    career_vorp: float | None = None
