from datetime import datetime

from pydantic import BaseModel


class Team(BaseModel):
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


class Player(BaseModel):
    player_id: str
    first_name: str | None = None
    last_name: str | None = None
    full_name: str | None = None
    birth_date: datetime | None = None
    birth_city: str | None = None
    birth_state: str | None = None
    birth_country: str | None = None
    death_date: datetime | None = None
    height_inches: int | None = None
    weight_lbs: int | None = None
    shoots: str | None = None
    position: str | None = None
    high_school: str | None = None
    high_school_city: str | None = None
    high_school_state: str | None = None
    college: str | None = None
    draft_year: int | None = None
    draft_round: int | None = None
    draft_pick: int | None = None
    draft_team_id: str | None = None
    nba_debut: datetime | None = None
    experience_years: int | None = None
    is_active: bool | None = None
    hof_year: int | None = None
    headshot_url: str | None = None
    instagram: str | None = None
    twitter: str | None = None
    nicknames: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None


class PlayerSeasonStats(BaseModel):
    stat_id: int
    player_id: str | None = None
    season_id: str | None = None
    team_id: str | None = None
    league: str | None = None
    season_type: str | None = None
    age: int | None = None
    games_played: int | None = None
    games_started: int | None = None
    minutes_played: int | None = None
    minutes_per_game: float | None = None
    field_goals_made: int | None = None
    field_goals_attempted: int | None = None
    field_goal_pct: float | None = None
    three_pointers_made: int | None = None
    three_pointers_attempted: int | None = None
    three_point_pct: float | None = None
    two_pointers_made: int | None = None
    two_pointers_attempted: int | None = None
    two_point_pct: float | None = None
    effective_fg_pct: float | None = None
    free_throws_made: int | None = None
    free_throws_attempted: int | None = None
    free_throw_pct: float | None = None
    points: int | None = None
    points_per_game: float | None = None
    offensive_rebounds: int | None = None
    defensive_rebounds: int | None = None
    total_rebounds: int | None = None
    rebounds_per_game: float | None = None
    assists: int | None = None
    assists_per_game: float | None = None
    turnovers: int | None = None
    turnovers_per_game: float | None = None
    steals: int | None = None
    steals_per_game: float | None = None
    blocks: int | None = None
    blocks_per_game: float | None = None
    personal_fouls: int | None = None
    personal_fouls_per_game: float | None = None
    points_per_36: float | None = None
    rebounds_per_36: float | None = None
    assists_per_36: float | None = None
    points_per_100_poss: float | None = None
    rebounds_per_100_poss: float | None = None
    assists_per_100_poss: float | None = None


class Game(BaseModel):
    game_id: str
    season_id: str | None = None
    game_date: datetime | None = None
    game_time: str | None = None  # Time object stringified?
    game_type: str | None = None
    home_team_id: str | None = None
    away_team_id: str | None = None
    home_team_score: int | None = None
    away_team_score: int | None = None
    arena: str | None = None
    attendance: int | None = None
    game_duration_minutes: int | None = None
    playoff_round: str | None = None
    series_game_number: int | None = None
    winner_team_id: str | None = None


class BoxScore(BaseModel):
    box_score_id: int
    game_id: str
    player_id: str
    team_id: str
    is_starter: bool | None = None
    minutes_played: int | None = None
    points: int | None = None
    rebounds: int | None = None
    assists: int | None = None
    # ... add others as needed


class TeamGameStats(BaseModel):
    stat_id: int
    game_id: str
    team_id: str
    is_home: bool
    points: int | None = None
    # ... add others


# Alias for backward compatibility if needed, or just remove usage in games.py
GameStats = TeamGameStats


# Supporting models
class TeamRoster(BaseModel):
    team_id: str
    season_id: str
    players: list[Player]
