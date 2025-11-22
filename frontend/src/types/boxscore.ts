export interface BoxScore {
  box_score_id: number;
  game_id: string;
  player_id: string;
  team_id: string;
  is_starter?: boolean;
  minutes_played?: number;
  did_not_play?: boolean;
  dnp_reason?: string;
  field_goals_made?: number;
  field_goals_attempted?: number;
  three_pointers_made?: number;
  three_pointers_attempted?: number;
  free_throws_made?: number;
  free_throws_attempted?: number;
  offensive_rebounds?: number;
  defensive_rebounds?: number;
  total_rebounds?: number;
  assists?: number;
  steals?: number;
  blocks?: number;
  turnovers?: number;
  personal_fouls?: number;
  points?: number;
  plus_minus?: number;
  game_score?: number;
  // Joined fields
  full_name?: string;
  headshot_url?: string;
  team_abbreviation?: string;
  team_name?: string;
}
