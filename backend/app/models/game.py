"""Game-related Pydantic models."""

from datetime import datetime

from pydantic import BaseModel


class Game(BaseModel):
    """NBA game information."""

    game_id: str
    season_id: str | None = None
    game_date: datetime | None = None
    game_time: str | None = None  # Time object stringified
    game_type: str | None = None
    home_team_id: str | None = None
    away_team_id: str | None = None
    home_team_score: int | None = None
    away_team_score: int | None = None
    home_q1: int | None = None
    home_q2: int | None = None
    home_q3: int | None = None
    home_q4: int | None = None
    home_ot1: int | None = None
    home_ot2: int | None = None
    home_ot3: int | None = None
    home_ot4: int | None = None
    away_q1: int | None = None
    away_q2: int | None = None
    away_q3: int | None = None
    away_q4: int | None = None
    away_ot1: int | None = None
    away_ot2: int | None = None
    away_ot3: int | None = None
    away_ot4: int | None = None
    arena: str | None = None
    attendance: int | None = None
    game_duration_minutes: int | None = None
    playoff_round: str | None = None
    series_game_number: int | None = None
    winner_team_id: str | None = None


class BoxScore(BaseModel):
    """Player box score for a single game."""

    box_score_id: int
    game_id: str
    player_id: str
    team_id: str
    is_starter: bool | None = None
    minutes_played: int | None = None
    did_not_play: bool | None = False
    dnp_reason: str | None = None
    field_goals_made: int | None = None
    field_goals_attempted: int | None = None
    three_pointers_made: int | None = None
    three_pointers_attempted: int | None = None
    free_throws_made: int | None = None
    free_throws_attempted: int | None = None
    offensive_rebounds: int | None = None
    defensive_rebounds: int | None = None
    total_rebounds: int | None = None
    assists: int | None = None
    steals: int | None = None
    blocks: int | None = None
    turnovers: int | None = None
    personal_fouls: int | None = None
    points: int | None = None
    plus_minus: int | None = None
    game_score: float | None = None


class TeamGameStats(BaseModel):
    """Team-level game statistics."""

    stat_id: int
    game_id: str
    team_id: str
    is_home: bool
    points: int | None = None
    # Additional team game stats can be added here


# Alias for backward compatibility
GameStats = TeamGameStats
