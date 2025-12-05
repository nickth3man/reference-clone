"""Team-related Pydantic models."""

from __future__ import annotations

from datetime import date as date_type, datetime

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
    opponent_effective_fg_pct: float | None = None
    opponent_defensive_rebound_pct: float | None = None
    opponent_free_throw_rate: float | None = None
    attendance: int | None = None
    attendance_per_game: int | None = None
    average_age: float | None = None

    # Per Game & Totals
    games_played: int | None = None
    minutes_played: int | None = None
    field_goals_made: int | None = None
    field_goals_attempted: int | None = None
    field_goals_per_game: float | None = None
    field_goals_attempted_per_game: float | None = None
    three_pointers_made: int | None = None
    three_pointers_attempted: int | None = None
    three_pointers_per_game: float | None = None
    three_pointers_attempted_per_game: float | None = None
    two_pointers_made: int | None = None
    two_pointers_attempted: int | None = None
    two_point_pct: float | None = None
    two_pointers_per_game: float | None = None
    two_pointers_attempted_per_game: float | None = None
    free_throws_made: int | None = None
    free_throws_attempted: int | None = None
    free_throws_per_game: float | None = None
    free_throws_attempted_per_game: float | None = None
    offensive_rebounds: int | None = None
    defensive_rebounds: int | None = None
    total_rebounds: int | None = None
    offensive_rebounds_per_game: float | None = None
    defensive_rebounds_per_game: float | None = None
    rebounds_per_game: float | None = None
    assists: int | None = None
    assists_per_game: float | None = None
    steals: int | None = None
    steals_per_game: float | None = None
    blocks: int | None = None
    blocks_per_game: float | None = None
    turnovers: int | None = None
    turnovers_per_game: float | None = None
    personal_fouls: int | None = None
    personal_fouls_per_game: float | None = None


class TeamRoster(BaseModel):
    """Team roster for a specific season."""

    team_id: str
    season_id: str
    players: list[Player]


# Alias for clarity in standings contexts
Standings = TeamSeasonStats


class TeamGameLog(BaseModel):
    """Team game log entry."""

    game_log_id: int
    team_id: str
    game_id: str
    season_id: str
    game_date: datetime | None = None
    matchup: str | None = None
    is_home: bool | None = None
    opponent_team_id: str | None = None
    is_win: bool | None = None
    game_result: str | None = None
    team_score: int | None = None
    opponent_score: int | None = None
    
    # Basic Stats
    field_goals_made: int | None = None
    field_goals_attempted: int | None = None
    field_goal_pct: float | None = None
    three_pointers_made: int | None = None
    three_pointers_attempted: int | None = None
    three_point_pct: float | None = None
    free_throws_made: int | None = None
    free_throws_attempted: int | None = None
    free_throw_pct: float | None = None
    offensive_rebounds: int | None = None
    defensive_rebounds: int | None = None
    total_rebounds: int | None = None
    assists: int | None = None
    steals: int | None = None
    blocks: int | None = None
    turnovers: int | None = None
    personal_fouls: int | None = None
    
    # Advanced / Four Factors
    pace: float | None = None
    effective_fg_pct: float | None = None
    turnover_pct: float | None = None
    offensive_rebound_pct: float | None = None
    free_throw_rate: float | None = None
    offensive_rating: float | None = None
    defensive_rating: float | None = None


class RosterRow(BaseModel):
    """Roster row aligned to Basketball-Reference roster table."""

    no: str | None = None
    player: str | None = None
    pos: str | None = None
    ht: str | None = None
    wt: str | None = None
    birth_date: date_type | None = None
    country: str | None = None
    exp: str | None = None
    college: str | None = None


class TeamGameLogRow(BaseModel):
    """Team game log row aligned to tgl_basic table."""

    rk: int
    g: int
    date: date_type | None = None
    home_away: str | None = None
    opp: str | None = None
    wl: str | None = None
    w: int | None = None
    l: int | None = None
    tm: float | None = None
    opp_pts: float | None = None
    fg: float | None = None
    fga: float | None = None
    fg_pct: float | None = None
    threep: float | None = None
    threep_att: float | None = None
    threep_pct: float | None = None
    ft: float | None = None
    fta: float | None = None
    ft_pct: float | None = None
    orb: float | None = None
    drb: float | None = None
    trb: float | None = None
    ast: float | None = None
    stl: float | None = None
    blk: float | None = None
    tov: float | None = None
    pf: float | None = None
    pts: float | None = None


class TeamScheduleRow(BaseModel):
    """Team schedule/results row aligned to games table."""

    g: int
    date: date_type | None = None
    start_et: str | None = None
    home_away: str | None = None
    opp: str | None = None
    wl: str | None = None
    w: int | None = None
    l: int | None = None
    tm: int | None = None
    opp_pts: int | None = None
    streak: str | None = None
    notes: str | None = None
    ot: str | None = None
