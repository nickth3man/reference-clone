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

export interface PlayerShootingStats {
  stat_id: number;
  player_id?: string;
  season_id?: string;
  team_id?: string;
  fg_pct_at_rim?: number;
  fga_at_rim?: number;
  fg_pct_3_10?: number;
  fga_3_10?: number;
  fg_pct_10_16?: number;
  fga_10_16?: number;
  fg_pct_16_3pt?: number;
  fga_16_3pt?: number;
  fg_pct_3pt?: number;
  fga_3pt?: number;
  pct_fga_2pt?: number;
  pct_fga_3pt?: number;
  pct_fg_assisted_2pt?: number;
  pct_fg_assisted_3pt?: number;
  dunks?: number;
  pct_fga_dunks?: number;
  corner_3_pct?: number;
  corner_3_attempts?: number;
  heaves_attempted?: number;
  heaves_made?: number;
}

export interface PlayerPlayByPlayStats {
  stat_id: number;
  player_id?: string;
  season_id?: string;
  team_id?: string;
  pct_pg?: number;
  pct_sg?: number;
  pct_sf?: number;
  pct_pf?: number;
  pct_c?: number;
  plus_minus_on?: number;
  plus_minus_off?: number;
  net_rating_on?: number;
  net_rating_off?: number;
  shooting_fouls_drawn?: number;
  shooting_fouls_committed?: number;
  and_one_attempts?: number;
  blocked_field_goal_attempts?: number;
}

