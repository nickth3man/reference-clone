export interface Season {
  season_id: string;
  league?: string;
  start_year?: number;
  end_year?: number;
  champion_team_id?: string;
  finals_mvp_player_id?: string;
  mvp_player_id?: string;
  roy_player_id?: string;
  dpoy_player_id?: string;
  sixth_man_player_id?: string;
  mip_player_id?: string;
  coy_coach_id?: string;
  salary_cap?: number;
  luxury_tax_threshold?: number;
  num_teams?: number;
}

export interface Standings {
  stat_id: number;
  team_id: string;
  season_id: string;
  season_type?: string;
  wins?: number;
  losses?: number;
  win_pct?: number;
  games_behind?: number;
  conference_rank?: number;
  division_rank?: number;
  playoff_seed?: number;
  current_streak?: string;
  home_record?: string;
  away_record?: string;
  points_per_game?: number;
  opponent_points_per_game?: number;
  point_differential?: number;
  pace?: number;
  offensive_rating?: number;
  defensive_rating?: number;
  net_rating?: number;
  pythagorean_wins?: number;
  strength_of_schedule?: number;
  simple_rating_system?: number;
  field_goal_pct?: number;
  three_point_pct?: number;
  free_throw_pct?: number;
  effective_fg_pct?: number;
  true_shooting_pct?: number;
  offensive_rebound_pct?: number;
  defensive_rebound_pct?: number;
  turnover_pct?: number;
  opponent_turnover_pct?: number;
  average_age?: number;
  // Joined fields
  full_name?: string;
  abbreviation?: string;
  logo_url?: string;
  conference?: string;
  division?: string;
}
