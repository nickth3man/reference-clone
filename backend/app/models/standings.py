"""Standings Pydantic models."""

from pydantic import BaseModel


class StandingsItem(BaseModel):
    """Standings item model matching frontend interface."""
    
    team_id: str
    full_name: str
    abbreviation: str
    logo_url: str | None = None
    conference: str
    division: str
    wins: int
    losses: int
    win_pct: float
    games_behind: float | None = None
    points_per_game: float | None = None
    opponent_points_per_game: float | None = None
    simple_rating_system: float | None = None
    pace: float | None = None
    offensive_rating: float | None = None
    defensive_rating: float | None = None
    net_rating: float | None = None


class Standings(list[StandingsItem]):
    """Standings model."""
    pass