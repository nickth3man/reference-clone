"""Season-related Pydantic models."""

from pydantic import BaseModel


class Season(BaseModel):
    """NBA season information."""

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
    ppg_leader_player_id: str | None = None
    rpg_leader_player_id: str | None = None
    apg_leader_player_id: str | None = None
    ws_leader_player_id: str | None = None
    salary_cap: float | None = None
    luxury_tax_threshold: float | None = None
    num_teams: int | None = None


class PlayoffSeries(BaseModel):
    """Playoff series information."""

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


class Award(BaseModel):
    """Player or team award information."""

    award_id: int
    season_id: str | None = None
    award_type: str | None = None
    player_id: str | None = None
    team_id: str | None = None
    first_place_votes: int | None = None
    total_points: int | None = None
    vote_share: float | None = None
    rank: int | None = None

class LeagueSeasonAverage(BaseModel):
    """League-wide season averages."""

    stat_id: int
    season_id: str | None = None
    league: str | None = None
    
    # Player Averages
    avg_age: float | None = None
    avg_height_inches: float | None = None
    avg_weight_lbs: float | None = None
    
    # Per Game Averages
    points_pg: float | None = None
    rebounds_pg: float | None = None
    assists_pg: float | None = None
    steals_pg: float | None = None
    blocks_pg: float | None = None
    turnovers_pg: float | None = None
    
    # Shooting Averages
    fg_pct: float | None = None
    fg3_pct: float | None = None
    ft_pct: float | None = None
    
    # Pace/Rating
    pace: float | None = None
    off_rating: float | None = None
    def_rating: float | None = None
