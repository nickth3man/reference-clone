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


class PlayerAdvancedStats(BaseModel):
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


class Award(BaseModel):
    award_id: int
    season_id: str | None = None
    award_type: str | None = None
    player_id: str | None = None
    team_id: str | None = None
    first_place_votes: int | None = None
    total_points: int | None = None
    vote_share: float | None = None
    rank: int | None = None


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


class PlayerGameLog(BoxScore):
    game_date: datetime | None = None
    opponent_team_id: str | None = None
    is_home: bool | None = None
    is_win: bool | None = None
    game_result: str | None = None  # e.g. "W (+10)"


class TeamGameStats(BaseModel):
    stat_id: int
    game_id: str
    team_id: str
    is_home: bool
    points: int | None = None
    # ... add others


# Alias for backward compatibility if needed, or just remove usage in games.py
GameStats = TeamGameStats


class Season(BaseModel):
    season_id: str
    league: str | None = None
    start_year: int | None = None
    end_year: int | None = None
    champion_team_id: str | None = None
    finals_mvp_player_id: str | None = None
    mvp_player_id: str | None = None
    roy_player_id: str | None = None
    dpoy_player_id: str | None = None
    sixth_man_player_id: str | None = None
    mip_player_id: str | None = None
    coy_coach_id: str | None = None
    salary_cap: float | None = None
    luxury_tax_threshold: float | None = None
    num_teams: int | None = None


class TeamSeasonStats(BaseModel):
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


class PlayoffSeries(BaseModel):
    series_id: int
    season_id: str | None = None
    round: str | None = None
    conference: str | None = None
    higher_seed_team_id: str | None = None
    lower_seed_team_id: str | None = None
    higher_seed_wins: int | None = None
    lower_seed_wins: int | None = None
    winner_team_id: str | None = None
    series_result: str | None = None


# Alias for clarity
Standings = TeamSeasonStats


# Supporting models
class TeamRoster(BaseModel):
    team_id: str
    season_id: str
    players: list[Player]


class Contract(BaseModel):
    contract_id: int
    player_id: str | None = None
    team_id: str | None = None
    contract_type: str | None = None
    signing_date: datetime | None = None
    total_value: float | None = None
    years: int | None = None
    year_1_salary: float | None = None
    year_2_salary: float | None = None
    year_3_salary: float | None = None
    year_4_salary: float | None = None
    year_5_salary: float | None = None
    year_6_salary: float | None = None
    guaranteed_money: float | None = None
    is_active: bool | None = None
