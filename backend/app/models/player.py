"""Player-related Pydantic models."""

from datetime import datetime

from pydantic import BaseModel


class Player(BaseModel):
    """Player biographical information."""

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
    """Player season statistics."""

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


class PlayerAdvancedStats(BaseModel):
    """Player advanced statistics."""

    stat_id: int
    player_id: str | None = None
    season_id: str | None = None
    team_id: str | None = None
    season_type: str | None = None
    player_efficiency_rating: float | None = None
    true_shooting_pct: float | None = None
    three_point_attempt_rate: float | None = None
    free_throw_rate: float | None = None
    offensive_rebound_pct: float | None = None
    defensive_rebound_pct: float | None = None
    total_rebound_pct: float | None = None
    assist_pct: float | None = None
    steal_pct: float | None = None
    block_pct: float | None = None
    turnover_pct: float | None = None
    usage_pct: float | None = None
    offensive_win_shares: float | None = None
    defensive_win_shares: float | None = None
    win_shares: float | None = None
    win_shares_per_48: float | None = None
    offensive_box_plus_minus: float | None = None
    defensive_box_plus_minus: float | None = None
    box_plus_minus: float | None = None
    value_over_replacement: float | None = None
    offensive_rating: float | None = None
    defensive_rating: float | None = None
    net_rating: float | None = None


class PlayerSplits(BaseModel):
    """Player split statistics (by opponent, home/away, etc.)."""

    split_id: int
    player_id: str
    season_id: str
    split_type: str
    split_value: str
    games: int | None = None
    minutes: int | None = None
    field_goals_made: int | None = None
    field_goals_attempted: int | None = None
    field_goal_pct: float | None = None
    three_pointers_made: int | None = None
    three_pointers_attempted: int | None = None
    three_point_pct: float | None = None
    free_throws_made: int | None = None
    free_throws_attempted: int | None = None
    free_throw_pct: float | None = None
    rebounds: int | None = None
    assists: int | None = None
    steals: int | None = None
    blocks: int | None = None
    turnovers: int | None = None
    points: int | None = None
    points_per_game: float | None = None
    true_shooting_pct: float | None = None
    effective_fg_pct: float | None = None


class PlayerShootingStats(BaseModel):
    """Player shooting statistics by distance/zone."""

    stat_id: int
    player_id: str | None = None
    season_id: str | None = None
    team_id: str | None = None
    fg_pct_at_rim: float | None = None
    fga_at_rim: int | None = None
    fg_pct_3_10: float | None = None
    fga_3_10: int | None = None
    fg_pct_10_16: float | None = None
    fga_10_16: int | None = None
    fg_pct_16_3pt: float | None = None
    fga_16_3pt: int | None = None
    fg_pct_3pt: float | None = None
    fga_3pt: int | None = None
    pct_fga_2pt: float | None = None
    pct_fga_3pt: float | None = None
    pct_fg_assisted_2pt: float | None = None
    pct_fg_assisted_3pt: float | None = None
    dunks: int | None = None
    pct_fga_dunks: float | None = None
    corner_3_pct: float | None = None
    corner_3_attempts: int | None = None
    heaves_attempted: int | None = None
    heaves_made: int | None = None


class PlayerPlayByPlayStats(BaseModel):
    """Player play-by-play derived statistics."""

    stat_id: int
    player_id: str | None = None
    season_id: str | None = None
    team_id: str | None = None
    pct_pg: float | None = None
    pct_sg: float | None = None
    pct_sf: float | None = None
    pct_pf: float | None = None
    pct_c: float | None = None
    plus_minus_on: float | None = None
    plus_minus_off: float | None = None
    net_rating_on: float | None = None
    net_rating_off: float | None = None
    shooting_fouls_drawn: int | None = None
    shooting_fouls_committed: int | None = None
    and_one_attempts: int | None = None
    blocked_field_goal_attempts: int | None = None


class PlayerGameLog(BaseModel):
    """Player game log entry (box score with game context)."""

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
    # Game context fields
    game_date: datetime | None = None
    opponent_team_id: str | None = None
    is_home: bool | None = None
    is_win: bool | None = None
    game_result: str | None = None  # e.g. "W (+10)"
