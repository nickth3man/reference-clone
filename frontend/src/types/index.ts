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

export interface PlayerSeasonStats {
  stat_id: number;
  player_id?: string;
  season_id?: string;
  team_id?: string;
  league?: string;
  season_type?: string;
  age?: number;
  games_played?: number;
  games_started?: number;
  minutes_played?: number;
  minutes_per_game?: number;
  field_goals_made?: number;
  field_goals_attempted?: number;
  field_goal_pct?: number;
  three_pointers_made?: number;
  three_pointers_attempted?: number;
  three_point_pct?: number;
  two_pointers_made?: number;
  two_pointers_attempted?: number;
  two_point_pct?: number;
  effective_fg_pct?: number;
  free_throws_made?: number;
  free_throws_attempted?: number;
  free_throw_pct?: number;
  points?: number;
  points_per_game?: number;
  offensive_rebounds?: number;
  defensive_rebounds?: number;
  total_rebounds?: number;
  rebounds_per_game?: number;
  assists?: number;
  assists_per_game?: number;
  turnovers?: number;
  turnovers_per_game?: number;
  steals?: number;
  steals_per_game?: number;
  blocks?: number;
  blocks_per_game?: number;
  personal_fouls?: number;
  personal_fouls_per_game?: number;
  points_per_36?: number;
  rebounds_per_36?: number;
  assists_per_36?: number;
  points_per_100_poss?: number;
  rebounds_per_100_poss?: number;
  assists_per_100_poss?: number;
}

export interface PlayerAdvancedStats {
  stat_id: number;
  player_id?: string;
  season_id?: string;
  team_id?: string;
  season_type?: string;
  player_efficiency_rating?: number;
  true_shooting_pct?: number;
  three_point_attempt_rate?: number;
  free_throw_rate?: number;
  offensive_rebound_pct?: number;
  defensive_rebound_pct?: number;
  total_rebound_pct?: number;
  assist_pct?: number;
  steal_pct?: number;
  block_pct?: number;
  turnover_pct?: number;
  usage_pct?: number;
  offensive_win_shares?: number;
  defensive_win_shares?: number;
  win_shares?: number;
  win_shares_per_48?: number;
  offensive_box_plus_minus?: number;
  defensive_box_plus_minus?: number;
  box_plus_minus?: number;
  value_over_replacement?: number;
  offensive_rating?: number;
  defensive_rating?: number;
  net_rating?: number;
}

export interface PlayerSplits {
  split_id: number;
  player_id: string;
  season_id: string;
  split_type: string;
  split_value: string;
  games?: number;
  minutes?: number;
  field_goals_made?: number;
  field_goals_attempted?: number;
  field_goal_pct?: number;
  three_pointers_made?: number;
  three_pointers_attempted?: number;
  three_point_pct?: number;
  free_throws_made?: number;
  free_throws_attempted?: number;
  free_throw_pct?: number;
  rebounds?: number;
  assists?: number;
  steals?: number;
  blocks?: number;
  turnovers?: number;
  points?: number;
  points_per_game?: number;
  true_shooting_pct?: number;
  effective_fg_pct?: number;
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

export * from "./season";
export * from "./boxscore";
