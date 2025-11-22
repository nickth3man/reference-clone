from datetime import datetime
from typing import Optional

# pylint: disable=too-few-public-methods
from pydantic import BaseModel


class Team(BaseModel):
    team_id: str
    abbreviation: Optional[str] = None
    nickname: Optional[str] = None
    yearfounded: Optional[float] = None
    city: Optional[str] = None
    arena: Optional[str] = None
    arenacapacity: Optional[float] = None
    owner: Optional[str] = None
    generalmanager: Optional[str] = None
    headcoach: Optional[str] = None
    dleagueaffiliation: Optional[str] = None
    facebook: Optional[str] = None
    instagram: Optional[str] = None
    twitter: Optional[str] = None


class Player(BaseModel):
    person_id: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    display_first_last: Optional[str] = None
    display_last_comma_first: Optional[str] = None
    display_fi_last: Optional[str] = None
    player_slug: Optional[str] = None
    birthdate: Optional[datetime] = None
    school: Optional[str] = None
    country: Optional[str] = None
    last_affiliation: Optional[str] = None
    height: Optional[str] = None
    weight: Optional[str] = None
    season_exp: Optional[float] = None
    jersey: Optional[str] = None
    position: Optional[str] = None
    rosterstatus: Optional[str] = None
    games_played_current_season_flag: Optional[str] = None
    team_id: Optional[int] = None
    team_name: Optional[str] = None
    team_abbreviation: Optional[str] = None
    team_code: Optional[str] = None
    team_city: Optional[str] = None
    playercode: Optional[str] = None
    from_year: Optional[float] = None
    to_year: Optional[float] = None
    dleague_flag: Optional[str] = None
    nba_flag: Optional[str] = None
    games_played_flag: Optional[str] = None
    draft_year: Optional[str] = None
    draft_round: Optional[str] = None
    draft_number: Optional[str] = None
    greatest_75_flag: Optional[str] = None


class Game(BaseModel):
    game_id: str
    season_id: Optional[str] = None
    game_date: Optional[datetime] = None
    team_id_home: Optional[str] = None
    team_abbreviation_home: Optional[str] = None
    team_name_home: Optional[str] = None
    matchup_home: Optional[str] = None
    wl_home: Optional[str] = None
    pts_home: Optional[float] = None
    team_id_away: Optional[str] = None
    team_abbreviation_away: Optional[str] = None
    team_name_away: Optional[str] = None
    matchup_away: Optional[str] = None
    wl_away: Optional[str] = None
    pts_away: Optional[float] = None
    season_type: Optional[str] = None


class PlayerStats(BaseModel):
    seas_id: str
    season: int
    player_id: int
    player: str
    birth_year: Optional[float] = None
    pos: Optional[str] = None
    age: Optional[float] = None
    experience: Optional[float] = None
    lg: Optional[str] = None
    tm: Optional[str] = None
    g: Optional[int] = None
    gs: Optional[int] = None
    mp_per_game: Optional[float] = None
    fg_per_game: Optional[float] = None
    fga_per_game: Optional[float] = None
    fg_percent: Optional[float] = None
    x3p_per_game: Optional[float] = None
    x3pa_per_game: Optional[float] = None
    x3p_percent: Optional[float] = None
    x2p_per_game: Optional[float] = None
    x2pa_per_game: Optional[float] = None
    x2p_percent: Optional[float] = None
    e_fg_percent: Optional[float] = None
    ft_per_game: Optional[float] = None
    fta_per_game: Optional[float] = None
    ft_percent: Optional[float] = None
    orb_per_game: Optional[float] = None
    drb_per_game: Optional[float] = None
    trb_per_game: Optional[float] = None
    ast_per_game: Optional[float] = None
    stl_per_game: Optional[float] = None
    blk_per_game: Optional[float] = None
    tov_per_game: Optional[float] = None
    pf_per_game: Optional[float] = None
    pts_per_game: Optional[float] = None


class GameStats(BaseModel):
    game_id: str
    league_id: Optional[str] = None
    team_id_home: Optional[str] = None
    team_abbreviation_home: Optional[str] = None
    team_city_home: Optional[str] = None
    pts_paint_home: Optional[float] = None
    pts_2nd_chance_home: Optional[float] = None
    pts_fb_home: Optional[float] = None
    largest_lead_home: Optional[float] = None
    lead_changes: Optional[float] = None
    times_tied: Optional[float] = None
    team_turnovers_home: Optional[float] = None
    total_turnovers_home: Optional[float] = None
    team_rebounds_home: Optional[float] = None
    pts_off_to_home: Optional[float] = None
    team_id_away: Optional[str] = None
    team_abbreviation_away: Optional[str] = None
    team_city_away: Optional[str] = None
    pts_paint_away: Optional[float] = None
    pts_2nd_chance_away: Optional[float] = None
    pts_fb_away: Optional[float] = None
    largest_lead_away: Optional[float] = None
    team_turnovers_away: Optional[float] = None
    total_turnovers_away: Optional[float] = None
    team_rebounds_away: Optional[float] = None
    pts_off_to_away: Optional[float] = None
