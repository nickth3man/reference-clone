from datetime import datetime

# pylint: disable=too-few-public-methods
from pydantic import BaseModel


class Team(BaseModel):
    team_id: str
    abbreviation: str | None = None
    nickname: str | None = None
    yearfounded: float | None = None
    city: str | None = None
    arena: str | None = None
    arenacapacity: float | None = None
    owner: str | None = None
    generalmanager: str | None = None
    headcoach: str | None = None
    dleagueaffiliation: str | None = None
    facebook: str | None = None
    instagram: str | None = None
    twitter: str | None = None


class Player(BaseModel):
    person_id: str
    first_name: str | None = None
    last_name: str | None = None
    display_first_last: str | None = None
    display_last_comma_first: str | None = None
    display_fi_last: str | None = None
    player_slug: str | None = None
    birthdate: datetime | None = None
    school: str | None = None
    country: str | None = None
    last_affiliation: str | None = None
    height: str | None = None
    weight: str | None = None
    season_exp: float | None = None
    jersey: str | None = None
    position: str | None = None
    rosterstatus: str | None = None
    games_played_current_season_flag: str | None = None
    team_id: int | None = None
    team_name: str | None = None
    team_abbreviation: str | None = None
    team_code: str | None = None
    team_city: str | None = None
    playercode: str | None = None
    from_year: float | None = None
    to_year: float | None = None
    dleague_flag: str | None = None
    nba_flag: str | None = None
    games_played_flag: str | None = None
    draft_year: str | None = None
    draft_round: str | None = None
    draft_number: str | None = None
    greatest_75_flag: str | None = None


class Game(BaseModel):
    game_id: str
    season_id: str | None = None
    game_date: datetime | None = None
    team_id_home: str | None = None
    team_abbreviation_home: str | None = None
    team_name_home: str | None = None
    matchup_home: str | None = None
    wl_home: str | None = None
    pts_home: float | None = None
    team_id_away: str | None = None
    team_abbreviation_away: str | None = None
    team_name_away: str | None = None
    matchup_away: str | None = None
    wl_away: str | None = None
    pts_away: float | None = None
    season_type: str | None = None


class PlayerStats(BaseModel):
    seas_id: str
    season: int
    player_id: int
    player: str
    birth_year: float | None = None
    pos: str | None = None
    age: float | None = None
    experience: float | None = None
    lg: str | None = None
    tm: str | None = None
    g: int | None = None
    gs: int | None = None
    mp_per_game: float | None = None
    fg_per_game: float | None = None
    fga_per_game: float | None = None
    fg_percent: float | None = None
    x3p_per_game: float | None = None
    x3pa_per_game: float | None = None
    x3p_percent: float | None = None
    x2p_per_game: float | None = None
    x2pa_per_game: float | None = None
    x2p_percent: float | None = None
    e_fg_percent: float | None = None
    ft_per_game: float | None = None
    fta_per_game: float | None = None
    ft_percent: float | None = None
    orb_per_game: float | None = None
    drb_per_game: float | None = None
    trb_per_game: float | None = None
    ast_per_game: float | None = None
    stl_per_game: float | None = None
    blk_per_game: float | None = None
    tov_per_game: float | None = None
    pf_per_game: float | None = None
    pts_per_game: float | None = None


class GameStats(BaseModel):
    game_id: str
    league_id: str | None = None
    team_id_home: str | None = None
    team_abbreviation_home: str | None = None
    team_city_home: str | None = None
    pts_paint_home: float | None = None
    pts_2nd_chance_home: float | None = None
    pts_fb_home: float | None = None
    largest_lead_home: float | None = None
    lead_changes: float | None = None
    times_tied: float | None = None
    team_turnovers_home: float | None = None
    total_turnovers_home: float | None = None
    team_rebounds_home: float | None = None
    pts_off_to_home: float | None = None
    team_id_away: str | None = None
    team_abbreviation_away: str | None = None
    team_city_away: str | None = None
    pts_paint_away: float | None = None
    pts_2nd_chance_away: float | None = None
    pts_fb_away: float | None = None
    largest_lead_away: float | None = None
    team_turnovers_away: float | None = None
    total_turnovers_away: float | None = None
    team_rebounds_away: float | None = None
    pts_off_to_away: float | None = None
