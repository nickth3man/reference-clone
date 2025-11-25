import { BoxScore } from "./boxscore";

export interface Team {
  team_id: string;
  franchise_id?: string;
  full_name?: string;
  abbreviation?: string;
  nickname?: string;
  city?: string;
  state?: string;
  arena?: string;
  arena_capacity?: number;
  founded_year?: number;
  folded_year?: number;
  league?: string;
  conference?: string;
  division?: string;
  primary_color?: string;
  secondary_color?: string;
  logo_url?: string;
  is_active?: boolean;
  championships?: number;
}

export interface StandingsItem {
  team_id: string;
  full_name: string;
  abbreviation: string;
  logo_url?: string;
  conference: string;
  division: string;
  wins: number;
  losses: number;
  win_pct: number;
  games_behind?: number;
  points_per_game?: number;
  opponent_points_per_game?: number;
  simple_rating_system?: number;
  pace?: number;
  offensive_rating?: number;
  defensive_rating?: number;
  net_rating?: number;
}

export interface Player {
  player_id: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  birth_date?: string; // ISO date string
  birth_city?: string;
  birth_state?: string;
  birth_country?: string;
  death_date?: string;
  height_inches?: number;
  weight_lbs?: number;
  shoots?: string;
  position?: string;
  high_school?: string;
  high_school_city?: string;
  high_school_state?: string;
  college?: string;
  draft_year?: number;
  draft_round?: number;
  draft_pick?: number;
  draft_team_id?: string;
  nba_debut?: string;
  experience_years?: number;
  is_active?: boolean;
  hof_year?: number;
  headshot_url?: string;
  instagram?: string;
  twitter?: string;
  nicknames?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Award {
  award_id: number;
  season_id?: string;
  award_type?: string;
  player_id?: string;
  team_id?: string;
  first_place_votes?: number;
  total_points?: number;
  vote_share?: number;
  rank?: number;
}

export interface PlayerGameLog extends BoxScore {
  game_date?: string;
  opponent_team_id?: string;
  is_home?: boolean;
  is_win?: boolean;
  game_result?: string;
}

export interface Game {
  game_id: string;
  season_id?: string;
  game_date?: string;
  game_time?: string;
  game_type?: string;
  home_team_id?: string;
  away_team_id?: string;
  home_team_score?: number;
  away_team_score?: number;
  home_q1?: number;
  home_q2?: number;
  home_q3?: number;
  home_q4?: number;
  home_ot1?: number;
  home_ot2?: number;
  home_ot3?: number;
  home_ot4?: number;
  away_q1?: number;
  away_q2?: number;
  away_q3?: number;
  away_q4?: number;
  away_ot1?: number;
  away_ot2?: number;
  away_ot3?: number;
  away_ot4?: number;
  arena?: string;
  attendance?: number;
  game_duration_minutes?: number;
  playoff_round?: string;
  series_game_number?: number;
  winner_team_id?: string;
}

export interface Franchise {
  franchise_id: string;
  current_team_id?: string;
  original_name?: string;
  founded_year?: number;
  total_championships?: number;
  total_seasons?: number;
  total_wins?: number;
  total_losses?: number;
}

export interface DraftPick {
  pick_id: number;
  draft_year?: number;
  round?: number;
  pick_number?: number;
  overall_pick?: number;
  player_id?: string;
  team_id?: string;
  player_name?: string;
  college?: string;
  nationality?: string;
  career_games?: number;
  career_points?: number;
  career_win_shares?: number;
  career_vorp?: number;
}

export interface Contract {
  contract_id: number;
  player_id?: string;
  team_id?: string;
  contract_type?: string;
  signing_date?: string;
  total_value?: number;
  years?: number;
  year_1_salary?: number;
  year_2_salary?: number;
  year_3_salary?: number;
  year_4_salary?: number;
  year_5_salary?: number;
  year_6_salary?: number;
  guaranteed_money?: number;
  is_active?: boolean;
}

export interface SeasonLeader {
  player_id: string;
  full_name: string;
  headshot_url?: string;
  value: number;
  team_id: string;
}

export interface SeasonLeaders {
  pts: SeasonLeader[];
  trb: SeasonLeader[];
  ast: SeasonLeader[];
  ws: SeasonLeader[];
  per: SeasonLeader[];
}

export interface PlayoffSeries {
  series_id: number;
  season_id?: string;
  round?: string;
  conference?: string;
  higher_seed_team_id?: string;
  lower_seed_team_id?: string;
  higher_seed_wins?: number;
  lower_seed_wins?: number;
  winner_team_id?: string;
  series_result?: string;
}

export * from "./season";
export * from "./boxscore";
export * from "./stats";
