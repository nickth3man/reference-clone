"""Team-related Pydantic models."""

from pydantic import BaseModel

from app.models.player import Player


class Team(BaseModel):
    """Team information."""

    team_id: str
    franchise_id: str | None = None
    full_name: str | None = None
    abbreviation: str | None = None
    nickname: str | None = None
    city: str | None = None
    state: str | None = None
    arena: str | None = None
    arena_capacity: int | None = None
    founded_year: int | None = None
    folded_year: int | None = None
    league: str | None = None
    conference: str | None = None
    division: str | None = None
    primary_color: str | None = None
    secondary_color: str | None = None
    logo_url: str | None = None
    is_active: bool | None = None
    championships: int | None = None


class TeamSeasonStats(BaseModel):
    """Team season statistics and standings."""

    stat_id: int
    team_id: str
    season_id: str
    season_type: str | None = None
    wins: int | None = None
    losses: int | None = None
    win_pct: float | None = None
    games_behind: float | None = None
    conference_rank: int | None = None
    division_rank: int | None = None
    playoff_seed: int | None = None
    current_streak: str | None = None
    home_record: str | None = None
    away_record: str | None = None
    points_per_game: float | None = None
    opponent_points_per_game: float | None = None
    point_differential: float | None = None
    pace: float | None = None
    offensive_rating: float | None = None
    defensive_rating: float | None = None
    net_rating: float | None = None
    pythagorean_wins: float | None = None
    strength_of_schedule: float | None = None
    simple_rating_system: float | None = None
    field_goal_pct: float | None = None
    three_point_pct: float | None = None
    free_throw_pct: float | None = None
    effective_fg_pct: float | None = None
    true_shooting_pct: float | None = None
    offensive_rebound_pct: float | None = None
    defensive_rebound_pct: float | None = None
    turnover_pct: float | None = None
    opponent_turnover_pct: float | None = None
    average_age: float | None = None


class TeamRoster(BaseModel):
    """Team roster for a specific season."""

    team_id: str
    season_id: str
    players: list[Player]


# Alias for clarity in standings contexts
Standings = TeamSeasonStats
