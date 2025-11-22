from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel

class Team(BaseModel):
    team_id: str
    franchise_id: Optional[str] = None
    full_name: Optional[str] = None
    abbreviation: Optional[str] = None
    nickname: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    arena: Optional[str] = None
    arena_capacity: Optional[int] = None
    founded_year: Optional[int] = None
    folded_year: Optional[int] = None
    league: Optional[str] = None
    conference: Optional[str] = None
    division: Optional[str] = None
    primary_color: Optional[str] = None
    secondary_color: Optional[str] = None
    logo_url: Optional[str] = None
    is_active: Optional[bool] = None
    championships: Optional[int] = None

class Player(BaseModel):
    player_id: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    full_name: Optional[str] = None
    birth_date: Optional[datetime] = None
    birth_city: Optional[str] = None
    birth_state: Optional[str] = None
    birth_country: Optional[str] = None
    death_date: Optional[datetime] = None
    height_inches: Optional[int] = None
    weight_lbs: Optional[int] = None
    shoots: Optional[str] = None
    position: Optional[str] = None
    high_school: Optional[str] = None
    high_school_city: Optional[str] = None
    high_school_state: Optional[str] = None
    college: Optional[str] = None
    draft_year: Optional[int] = None
    draft_round: Optional[int] = None
    draft_pick: Optional[int] = None
    draft_team_id: Optional[str] = None
    nba_debut: Optional[datetime] = None
    experience_years: Optional[int] = None
    is_active: Optional[bool] = None
    hof_year: Optional[int] = None
    headshot_url: Optional[str] = None
    instagram: Optional[str] = None
    twitter: Optional[str] = None
    nicknames: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class PlayerSeasonStats(BaseModel):
    stat_id: int
    player_id: Optional[str] = None
    season_id: Optional[str] = None
    team_id: Optional[str] = None
    league: Optional[str] = None
    season_type: Optional[str] = None
    age: Optional[int] = None
    games_played: Optional[int] = None
    games_started: Optional[int] = None
    minutes_played: Optional[int] = None
    minutes_per_game: Optional[float] = None
    field_goals_made: Optional[int] = None
    field_goals_attempted: Optional[int] = None
    field_goal_pct: Optional[float] = None
    three_pointers_made: Optional[int] = None
    three_pointers_attempted: Optional[int] = None
    three_point_pct: Optional[float] = None
    two_pointers_made: Optional[int] = None
    two_pointers_attempted: Optional[int] = None
    two_point_pct: Optional[float] = None
    effective_fg_pct: Optional[float] = None
    free_throws_made: Optional[int] = None
    free_throws_attempted: Optional[int] = None
    free_throw_pct: Optional[float] = None
    points: Optional[int] = None
    points_per_game: Optional[float] = None
    offensive_rebounds: Optional[int] = None
    defensive_rebounds: Optional[int] = None
    total_rebounds: Optional[int] = None
    rebounds_per_game: Optional[float] = None
    assists: Optional[int] = None
    assists_per_game: Optional[float] = None
    turnovers: Optional[int] = None
    turnovers_per_game: Optional[float] = None
    steals: Optional[int] = None
    steals_per_game: Optional[float] = None
    blocks: Optional[int] = None
    blocks_per_game: Optional[float] = None
    personal_fouls: Optional[int] = None
    personal_fouls_per_game: Optional[float] = None
    points_per_36: Optional[float] = None
    rebounds_per_36: Optional[float] = None
    assists_per_36: Optional[float] = None
    points_per_100_poss: Optional[float] = None
    rebounds_per_100_poss: Optional[float] = None
    assists_per_100_poss: Optional[float] = None

class Game(BaseModel):
    game_id: str
    season_id: Optional[str] = None
    game_date: Optional[datetime] = None
    game_time: Optional[str] = None # Time object stringified?
    game_type: Optional[str] = None
    home_team_id: Optional[str] = None
    away_team_id: Optional[str] = None
    home_team_score: Optional[int] = None
    away_team_score: Optional[int] = None
    arena: Optional[str] = None
    attendance: Optional[int] = None
    game_duration_minutes: Optional[int] = None
    playoff_round: Optional[str] = None
    series_game_number: Optional[int] = None
    winner_team_id: Optional[str] = None

class BoxScore(BaseModel):
    box_score_id: int
    game_id: str
    player_id: str
    team_id: str
    is_starter: Optional[bool] = None
    minutes_played: Optional[int] = None
    points: Optional[int] = None
    rebounds: Optional[int] = None
    assists: Optional[int] = None
    # ... add others as needed

class TeamGameStats(BaseModel):
    stat_id: int
    game_id: str
    team_id: str
    is_home: bool
    points: Optional[int] = None
    # ... add others

# Alias for backward compatibility if needed, or just remove usage in games.py
GameStats = TeamGameStats 

# Supporting models
class TeamRoster(BaseModel):
    team_id: str
    season_id: str
    players: List[Player]
