export type TableId =
  | 'per_game'
  | 'totals'
  | 'per_minute'
  | 'per_poss'
  | 'advanced'
  | 'shooting'
  | 'adj_shooting'
  | 'pbp'
  | 'pgl_basic'
  | 'splits'
  | 'roster'
  | 'tgl_basic'
  | 'games'
  | 'confs_standings_E'
  | 'confs_standings_W'
  | 'divs_standings_Atlantic'
  | 'divs_standings_Central'
  | 'divs_standings_Southeast'
  | 'divs_standings_Northwest'
  | 'divs_standings_Pacific'
  | 'divs_standings_Southwest'
  | 'line_score'
  | 'four_factors'
  | 'box_game_basic' // Generic ID, will be used with team suffix in practice
  | 'box_game_advanced'
  | 'draft_stats'
  | 'playoffs_series'
  | 'standings_regular'
  | 'standings_expanded';

export type ColumnKey =
  | 'rk'
  | 'season'
  | 'age'
  | 'tm'
  | 'lg'
  | 'pos'
  | 'g'
  | 'gs'
  | 'mp'
  | 'fg'
  | 'fga'
  | 'fg_pct'
  | 'threep'
  | 'threep_att'
  | 'threep_pct'
  | 'twop'
  | 'twop_att'
  | 'twop_pct'
  | 'efg_pct'
  | 'ft'
  | 'fta'
  | 'ft_pct'
  | 'orb'
  | 'drb'
  | 'trb'
  | 'ast'
  | 'stl'
  | 'blk'
  | 'tov'
  | 'pf'
  | 'pts'
  | 'ortg'
  | 'drtg'
  | 'per'
  | 'ts_pct'
  | 'threepar'
  | 'ftr'
  | 'orb_pct'
  | 'drb_pct'
  | 'trb_pct'
  | 'ast_pct'
  | 'stl_pct'
  | 'blk_pct'
  | 'tov_pct'
  | 'usg_pct'
  | 'ows'
  | 'dws'
  | 'ws'
  | 'ws_48'
  | 'obpm'
  | 'dbpm'
  | 'bpm'
  | 'vorp'
  | 'dist'
  | 'pct_fga_2p'
  | 'pct_fga_0_3'
  | 'pct_fga_3_10'
  | 'pct_fga_10_16'
  | 'pct_fga_16_3p'
  | 'pct_fga_3p'
  | 'fg_pct_2p'
  | 'fg_pct_0_3'
  | 'fg_pct_3_10'
  | 'fg_pct_10_16'
  | 'fg_pct_16_3p'
  | 'fg_pct_3p'
  | 'pct_ast_2p'
  | 'pct_ast_3p'
  | 'pct_fga_dunks'
  | 'num_dunks'
  | 'threep_att_corner'
  | 'threep_pct_corner'
  | 'att_heaves'
  | 'made_heaves'
  | 'fg_plus'
  | 'twop_plus'
  | 'threep_plus'
  | 'efg_plus'
  | 'ft_plus'
  | 'ts_plus'
  | 'ftr_plus'
  | 'threepar_plus'
  | 'pg_pct'
  | 'sg_pct'
  | 'sf_pct'
  | 'pf_pct'
  | 'c_pct'
  | 'on_court_plus_minus'
  | 'on_off_plus_minus'
  | 'bad_pass_to'
  | 'lost_ball_to'
  | 'shooting_fouls'
  | 'offensive_fouls'
  | 'shooting_fouls_drawn'
  | 'and1s'
  | 'blocked'
  | 'date'
  | 'opp'
  | 'result'
  | 'gmsc'
  | 'plus_minus'
  | 'player'
  | 'no'
  | 'ht'
  | 'wt'
  | 'birth_date'
  | 'country'
  | 'exp'
  | 'college'
  | 'w'
  | 'l'
  | 'wl_pct'
  | 'gb'
  | 'opp_pts'
  | 'srs'
  | 'start_et'
  | 'streak'
  | 'notes'
  | 'pace'
  | 'ft_per_fga'
  | 'q1'
  | 'q2'
  | 'q3'
  | 'q4'
  | 'ot1'
  | 'ot2'
  | 'total'
  | 'pk'
  | 'yrs'
  | 'pw'
  | 'pl'
  | 'ps_g'
  | 'pa_g'
  | 'mov'
  | 'sos'
  | 'nrtg'
  | 'efg_pct_opp'
  | 'tov_pct_opp'
  | 'drb_pct_opp'
  | 'ft_per_fga_opp'
  | 'attend'
  | 'attend_g'
  | 'round'
  | 'winner'
  | 'loser'
  | 'split_value'; // For splits table key

export interface ColumnDef {
  key: ColumnKey;
  label: string;
  description?: string;
  type: 'int' | 'float' | 'string' | 'date' | 'ratio' | 'percent';
  group?: string;
  width?: number;
  align?: 'left' | 'right' | 'center';
}

export const COLUMN_METADATA: Record<ColumnKey, ColumnDef> = {
  rk: { key: 'rk', label: 'Rk', type: 'int' },
  season: { key: 'season', label: 'Season', type: 'string' },
  age: { key: 'age', label: 'Age', type: 'int' },
  tm: { key: 'tm', label: 'Tm', type: 'string' },
  lg: { key: 'lg', label: 'Lg', type: 'string' },
  pos: { key: 'pos', label: 'Pos', type: 'string' },
  g: { key: 'g', label: 'G', type: 'int', description: 'Games' },
  gs: { key: 'gs', label: 'GS', type: 'int', description: 'Games Started' },
  mp: { key: 'mp', label: 'MP', type: 'float', description: 'Minutes Played' },
  fg: { key: 'fg', label: 'FG', type: 'float', description: 'Field Goals' },
  fga: { key: 'fga', label: 'FGA', type: 'float', description: 'Field Goal Attempts' },
  fg_pct: { key: 'fg_pct', label: 'FG%', type: 'percent', description: 'Field Goal Percentage' },
  threep: { key: 'threep', label: '3P', type: 'float', description: '3-Point Field Goals' },
  threep_att: { key: 'threep_att', label: '3PA', type: 'float', description: '3-Point Field Goal Attempts' },
  threep_pct: { key: 'threep_pct', label: '3P%', type: 'percent', description: '3-Point Field Goal Percentage' },
  twop: { key: 'twop', label: '2P', type: 'float', description: '2-Point Field Goals' },
  twop_att: { key: 'twop_att', label: '2PA', type: 'float', description: '2-Point Field Goal Attempts' },
  twop_pct: { key: 'twop_pct', label: '2P%', type: 'percent', description: '2-Point Field Goal Percentage' },
  efg_pct: { key: 'efg_pct', label: 'eFG%', type: 'percent', description: 'Effective Field Goal Percentage' },
  ft: { key: 'ft', label: 'FT', type: 'float', description: 'Free Throws' },
  fta: { key: 'fta', label: 'FTA', type: 'float', description: 'Free Throw Attempts' },
  ft_pct: { key: 'ft_pct', label: 'FT%', type: 'percent', description: 'Free Throw Percentage' },
  orb: { key: 'orb', label: 'ORB', type: 'float', description: 'Offensive Rebounds' },
  drb: { key: 'drb', label: 'DRB', type: 'float', description: 'Defensive Rebounds' },
  trb: { key: 'trb', label: 'TRB', type: 'float', description: 'Total Rebounds' },
  ast: { key: 'ast', label: 'AST', type: 'float', description: 'Assists' },
  stl: { key: 'stl', label: 'STL', type: 'float', description: 'Steals' },
  blk: { key: 'blk', label: 'BLK', type: 'float', description: 'Blocks' },
  tov: { key: 'tov', label: 'TOV', type: 'float', description: 'Turnovers' },
  pf: { key: 'pf', label: 'PF', type: 'float', description: 'Personal Fouls' },
  pts: { key: 'pts', label: 'PTS', type: 'float', description: 'Points' },
  ortg: { key: 'ortg', label: 'ORtg', type: 'float', description: 'Offensive Rating' },
  drtg: { key: 'drtg', label: 'DRtg', type: 'float', description: 'Defensive Rating' },
  per: { key: 'per', label: 'PER', type: 'float', description: 'Player Efficiency Rating' },
  ts_pct: { key: 'ts_pct', label: 'TS%', type: 'percent', description: 'True Shooting Percentage' },
  threepar: { key: 'threepar', label: '3PAr', type: 'float', description: '3-Point Attempt Rate' },
  ftr: { key: 'ftr', label: 'FTr', type: 'float', description: 'Free Throw Rate' },
  orb_pct: { key: 'orb_pct', label: 'ORB%', type: 'percent', description: 'Offensive Rebound Percentage' },
  drb_pct: { key: 'drb_pct', label: 'DRB%', type: 'percent', description: 'Defensive Rebound Percentage' },
  trb_pct: { key: 'trb_pct', label: 'TRB%', type: 'percent', description: 'Total Rebound Percentage' },
  ast_pct: { key: 'ast_pct', label: 'AST%', type: 'percent', description: 'Assist Percentage' },
  stl_pct: { key: 'stl_pct', label: 'STL%', type: 'percent', description: 'Steal Percentage' },
  blk_pct: { key: 'blk_pct', label: 'BLK%', type: 'percent', description: 'Block Percentage' },
  tov_pct: { key: 'tov_pct', label: 'TOV%', type: 'percent', description: 'Turnover Percentage' },
  usg_pct: { key: 'usg_pct', label: 'USG%', type: 'percent', description: 'Usage Percentage' },
  ows: { key: 'ows', label: 'OWS', type: 'float', description: 'Offensive Win Shares' },
  dws: { key: 'dws', label: 'DWS', type: 'float', description: 'Defensive Win Shares' },
  ws: { key: 'ws', label: 'WS', type: 'float', description: 'Win Shares' },
  ws_48: { key: 'ws_48', label: 'WS/48', type: 'float', description: 'Win Shares Per 48 Minutes' },
  obpm: { key: 'obpm', label: 'OBPM', type: 'float', description: 'Offensive Box Plus/Minus' },
  dbpm: { key: 'dbpm', label: 'DBPM', type: 'float', description: 'Defensive Box Plus/Minus' },
  bpm: { key: 'bpm', label: 'BPM', type: 'float', description: 'Box Plus/Minus' },
  vorp: { key: 'vorp', label: 'VORP', type: 'float', description: 'Value Over Replacement Player' },
  dist: { key: 'dist', label: 'Dist.', type: 'float', description: 'Average Shot Distance' },
  pct_fga_2p: { key: 'pct_fga_2p', label: '2P', type: 'percent' },
  pct_fga_0_3: { key: 'pct_fga_0_3', label: '0-3', type: 'percent' },
  pct_fga_3_10: { key: 'pct_fga_3_10', label: '3-10', type: 'percent' },
  pct_fga_10_16: { key: 'pct_fga_10_16', label: '10-16', type: 'percent' },
  pct_fga_16_3p: { key: 'pct_fga_16_3p', label: '16-3P', type: 'percent' },
  pct_fga_3p: { key: 'pct_fga_3p', label: '3P', type: 'percent' },
  fg_pct_2p: { key: 'fg_pct_2p', label: '2P', type: 'percent' },
  fg_pct_0_3: { key: 'fg_pct_0_3', label: '0-3', type: 'percent' },
  fg_pct_3_10: { key: 'fg_pct_3_10', label: '3-10', type: 'percent' },
  fg_pct_10_16: { key: 'fg_pct_10_16', label: '10-16', type: 'percent' },
  fg_pct_16_3p: { key: 'fg_pct_16_3p', label: '16-3P', type: 'percent' },
  fg_pct_3p: { key: 'fg_pct_3p', label: '3P', type: 'percent' },
  pct_ast_2p: { key: 'pct_ast_2p', label: '2P', type: 'percent' },
  pct_ast_3p: { key: 'pct_ast_3p', label: '3P', type: 'percent' },
  pct_fga_dunks: { key: 'pct_fga_dunks', label: '%FGA', type: 'percent' },
  num_dunks: { key: 'num_dunks', label: '#', type: 'int' },
  threep_att_corner: { key: 'threep_att_corner', label: '%3PA', type: 'percent' },
  threep_pct_corner: { key: 'threep_pct_corner', label: '3P%', type: 'percent' },
  att_heaves: { key: 'att_heaves', label: 'Att', type: 'int' },
  made_heaves: { key: 'made_heaves', label: 'Md', type: 'int' },
  fg_plus: { key: 'fg_plus', label: 'FG+', type: 'int' },
  twop_plus: { key: 'twop_plus', label: '2P+', type: 'int' },
  threep_plus: { key: 'threep_plus', label: '3P+', type: 'int' },
  efg_plus: { key: 'efg_plus', label: 'eFG+', type: 'int' },
  ft_plus: { key: 'ft_plus', label: 'FT+', type: 'int' },
  ts_plus: { key: 'ts_plus', label: 'TS+', type: 'int' },
  ftr_plus: { key: 'ftr_plus', label: 'FTr+', type: 'int' },
  threepar_plus: { key: 'threepar_plus', label: '3PAr+', type: 'int' },
  pg_pct: { key: 'pg_pct', label: 'PG%', type: 'percent' },
  sg_pct: { key: 'sg_pct', label: 'SG%', type: 'percent' },
  sf_pct: { key: 'sf_pct', label: 'SF%', type: 'percent' },
  pf_pct: { key: 'pf_pct', label: 'PF%', type: 'percent' },
  c_pct: { key: 'c_pct', label: 'C%', type: 'percent' },
  on_court_plus_minus: { key: 'on_court_plus_minus', label: 'OnCourt', type: 'float' },
  on_off_plus_minus: { key: 'on_off_plus_minus', label: 'On-Off', type: 'float' },
  bad_pass_to: { key: 'bad_pass_to', label: 'BadPass', type: 'int' },
  lost_ball_to: { key: 'lost_ball_to', label: 'LostBall', type: 'int' },
  shooting_fouls: { key: 'shooting_fouls', label: 'Shoot', type: 'int' },
  offensive_fouls: { key: 'offensive_fouls', label: 'Off.', type: 'int' },
  shooting_fouls_drawn: { key: 'shooting_fouls_drawn', label: 'Shoot', type: 'int' },
  and1s: { key: 'and1s', label: 'And1', type: 'int' },
  blocked: { key: 'blocked', label: 'Blkd', type: 'int' },
  date: { key: 'date', label: 'Date', type: 'date' },
  opp: { key: 'opp', label: 'Opp', type: 'string' },
  result: { key: 'result', label: 'Result', type: 'string' },
  gmsc: { key: 'gmsc', label: 'GmSc', type: 'float' },
  plus_minus: { key: 'plus_minus', label: '+/-', type: 'int' },
  player: { key: 'player', label: 'Player', type: 'string' },
  no: { key: 'no', label: 'No.', type: 'string' },
  ht: { key: 'ht', label: 'Ht', type: 'string' },
  wt: { key: 'wt', label: 'Wt', type: 'string' },
  birth_date: { key: 'birth_date', label: 'Birth Date', type: 'date' },
  country: { key: 'country', label: 'Country', type: 'string' },
  exp: { key: 'exp', label: 'Exp', type: 'string' },
  college: { key: 'college', label: 'College', type: 'string' },
  w: { key: 'w', label: 'W', type: 'int' },
  l: { key: 'l', label: 'L', type: 'int' },
  wl_pct: { key: 'wl_pct', label: 'W/L%', type: 'percent' },
  gb: { key: 'gb', label: 'GB', type: 'float' },
  opp_pts: { key: 'opp_pts', label: 'Opp PTS', type: 'float' },
  srs: { key: 'srs', label: 'SRS', type: 'float' },
  start_et: { key: 'start_et', label: 'Start (ET)', type: 'string' },
  streak: { key: 'streak', label: 'Streak', type: 'string' },
  notes: { key: 'notes', label: 'Notes', type: 'string' },
  pace: { key: 'pace', label: 'Pace', type: 'float' },
  ft_per_fga: { key: 'ft_per_fga', label: 'FT/FGA', type: 'float' },
  q1: { key: 'q1', label: 'Q1', type: 'int' },
  q2: { key: 'q2', label: 'Q2', type: 'int' },
  q3: { key: 'q3', label: 'Q3', type: 'int' },
  q4: { key: 'q4', label: 'Q4', type: 'int' },
  ot1: { key: 'ot1', label: 'OT1', type: 'int' },
  ot2: { key: 'ot2', label: 'OT2', type: 'int' },
  total: { key: 'total', label: 'Total', type: 'int' },
  pk: { key: 'pk', label: 'Pk', type: 'int' },
  yrs: { key: 'yrs', label: 'Yrs', type: 'int' },
  pw: { key: 'pw', label: 'PW', type: 'int' },
  pl: { key: 'pl', label: 'PL', type: 'int' },
  ps_g: { key: 'ps_g', label: 'PS/G', type: 'float' },
  pa_g: { key: 'pa_g', label: 'PA/G', type: 'float' },
  mov: { key: 'mov', label: 'MOV', type: 'float' },
  sos: { key: 'sos', label: 'SOS', type: 'float' },
  nrtg: { key: 'nrtg', label: 'NRtg', type: 'float' },
  efg_pct_opp: { key: 'efg_pct_opp', label: 'eFG%', type: 'percent' },
  tov_pct_opp: { key: 'tov_pct_opp', label: 'TOV%', type: 'percent' },
  drb_pct_opp: { key: 'drb_pct_opp', label: 'DRB%', type: 'percent' },
  ft_per_fga_opp: { key: 'ft_per_fga_opp', label: 'FT/FGA', type: 'float' },
  attend: { key: 'attend', label: 'Attend.', type: 'int' },
  attend_g: { key: 'attend_g', label: 'Attend./G', type: 'int' },
  round: { key: 'round', label: 'Round', type: 'string' },
  winner: { key: 'winner', label: 'Winner', type: 'string' },
  loser: { key: 'loser', label: 'Loser', type: 'string' },
  split_value: { key: 'split_value', label: 'Split', type: 'string' },
};

export interface TableSchema {
  id: TableId;
  columns: ColumnKey[];
  columnGroups?: {
    title: string;
    columns: ColumnKey[];
  }[];
}

export const TABLE_SCHEMAS: Record<TableId, TableSchema> = {
  per_game: {
    id: 'per_game',
    columns: [
      'season', 'age', 'tm', 'lg', 'pos',
      'g', 'gs', 'mp',
      'fg', 'fga', 'fg_pct',
      'threep', 'threep_att', 'threep_pct',
      'twop', 'twop_att', 'twop_pct',
      'efg_pct',
      'ft', 'fta', 'ft_pct',
      'orb', 'drb', 'trb',
      'ast', 'stl', 'blk', 'tov', 'pf', 'pts',
    ],
  },
  totals: {
    id: 'totals',
    columns: [
      'season', 'age', 'tm', 'lg', 'pos',
      'g', 'gs', 'mp',
      'fg', 'fga', 'fg_pct',
      'threep', 'threep_att', 'threep_pct',
      'twop', 'twop_att', 'twop_pct',
      'efg_pct',
      'ft', 'fta', 'ft_pct',
      'orb', 'drb', 'trb',
      'ast', 'stl', 'blk', 'tov', 'pf', 'pts',
    ],
  },
  per_minute: {
    id: 'per_minute',
    columns: [
      'season', 'age', 'tm', 'lg', 'pos',
      'g', 'gs', 'mp',
      'fg', 'fga', 'fg_pct',
      'threep', 'threep_att', 'threep_pct',
      'twop', 'twop_att', 'twop_pct',
      'efg_pct',
      'ft', 'fta', 'ft_pct',
      'orb', 'drb', 'trb',
      'ast', 'stl', 'blk', 'tov', 'pf', 'pts',
    ],
  },
  per_poss: {
    id: 'per_poss',
    columns: [
      'season', 'age', 'tm', 'lg', 'pos',
      'g', 'gs', 'mp',
      'fg', 'fga', 'fg_pct',
      'threep', 'threep_att', 'threep_pct',
      'twop', 'twop_att', 'twop_pct',
      'efg_pct',
      'ft', 'fta', 'ft_pct',
      'orb', 'drb', 'trb',
      'ast', 'stl', 'blk', 'tov', 'pf', 'pts',
      'ortg', 'drtg',
    ],
  },
  advanced: {
    id: 'advanced',
    columns: [
      'season', 'age', 'tm', 'lg', 'pos',
      'g', 'mp',
      'per', 'ts_pct', 'threepar', 'ftr',
      'orb_pct', 'drb_pct', 'trb_pct', 'ast_pct', 'stl_pct', 'blk_pct', 'tov_pct', 'usg_pct',
      'ows', 'dws', 'ws', 'ws_48',
      'obpm', 'dbpm', 'bpm', 'vorp',
    ],
  },
  shooting: {
    id: 'shooting',
    columns: [
      'season', 'age', 'tm', 'lg', 'pos', 'g', 'mp', 'fg_pct', 'dist',
      'pct_fga_2p', 'pct_fga_0_3', 'pct_fga_3_10', 'pct_fga_10_16', 'pct_fga_16_3p', 'pct_fga_3p',
      'fg_pct_2p', 'fg_pct_0_3', 'fg_pct_3_10', 'fg_pct_10_16', 'fg_pct_16_3p', 'fg_pct_3p',
      'pct_ast_2p', 'pct_ast_3p',
      'num_dunks', 'pct_fga_dunks',
      'threep_att_corner', 'threep_pct_corner',
      'att_heaves', 'made_heaves',
    ],
    columnGroups: [
      { title: 'Basic', columns: ['season', 'age', 'tm', 'lg', 'pos', 'g', 'mp', 'fg_pct', 'dist'] },
      { title: '% of FGA by Distance', columns: ['pct_fga_2p', 'pct_fga_0_3', 'pct_fga_3_10', 'pct_fga_10_16', 'pct_fga_16_3p', 'pct_fga_3p'] },
      { title: 'FG% by Distance', columns: ['fg_pct_2p', 'fg_pct_0_3', 'fg_pct_3_10', 'fg_pct_10_16', 'fg_pct_16_3p', 'fg_pct_3p'] },
      { title: '% of FGA by Type', columns: ['pct_ast_2p', 'pct_ast_3p'] },
      { title: 'Dunks', columns: ['num_dunks', 'pct_fga_dunks'] },
      { title: 'Corner 3s', columns: ['threep_att_corner', 'threep_pct_corner'] },
      { title: 'Heaves', columns: ['att_heaves', 'made_heaves'] },
    ],
  },
  adj_shooting: {
    id: 'adj_shooting',
    columns: [
      'season', 'age', 'tm', 'lg', 'pos', 'g', 'mp',
      'fg', 'fga', 'fg_pct',
      'twop', 'twop_att', 'twop_pct',
      'threep', 'threep_att', 'threep_pct',
      'efg_pct', 'ft', 'fta', 'ft_pct', 'ts_pct', 'ftr', 'threepar',
      'fg_plus', 'twop_plus', 'threep_plus', 'efg_plus', 'ft_plus', 'ts_plus', 'ftr_plus', 'threepar_plus',
    ],
  },
  pbp: {
    id: 'pbp',
    columns: [
      'season', 'age', 'tm', 'lg', 'pos', 'g', 'mp',
      'pg_pct', 'sg_pct', 'sf_pct', 'pf_pct', 'c_pct',
      'on_court_plus_minus', 'on_off_plus_minus',
      'bad_pass_to', 'lost_ball_to',
      'shooting_fouls', 'offensive_fouls', 'shooting_fouls_drawn',
      'and1s', 'blocked',
    ],
  },
  pgl_basic: {
    id: 'pgl_basic',
    columns: [
      'rk', 'g', 'date', 'age', 'tm', 'opp', 'result', 'gs', 'mp',
      'fg', 'fga', 'fg_pct',
      'threep', 'threep_att', 'threep_pct',
      'ft', 'fta', 'ft_pct',
      'orb', 'drb', 'trb',
      'ast', 'stl', 'blk', 'tov', 'pf', 'pts',
      'gmsc', 'plus_minus',
    ],
  },
  splits: {
    id: 'splits',
    columns: [
      'split_value', 'g', 'gs', 'mp',
      'fg', 'fga', 'fg_pct',
      'threep', 'threep_att', 'threep_pct',
      'ft', 'fta', 'ft_pct',
      'orb', 'drb', 'trb',
      'ast', 'stl', 'blk', 'tov', 'pf', 'pts',
    ],
  },
  roster: {
    id: 'roster',
    columns: [
      'no', 'player', 'pos', 'ht', 'wt', 'birth_date', 'country', 'exp', 'college',
    ],
  },
  tgl_basic: {
    id: 'tgl_basic',
    columns: [
      'rk', 'g', 'date', 'opp', 'w', 'l', 'tm', 'opp_pts',
      'fg', 'fga', 'fg_pct',
      'threep', 'threep_att', 'threep_pct',
      'ft', 'fta', 'ft_pct',
      'orb', 'drb', 'trb',
      'ast', 'stl', 'blk', 'tov', 'pf', 'pts',
    ],
  },
  games: {
    id: 'games',
    columns: [
      'g', 'date', 'start_et', 'opp', 'w', 'l', 'tm', 'opp_pts', 'streak', 'notes',
    ],
  },
  confs_standings_E: {
    id: 'confs_standings_E',
    columns: ['rk', 'tm', 'w', 'l', 'wl_pct', 'gb', 'pts', 'opp_pts', 'srs'],
  },
  confs_standings_W: {
    id: 'confs_standings_W',
    columns: ['rk', 'tm', 'w', 'l', 'wl_pct', 'gb', 'pts', 'opp_pts', 'srs'],
  },
  divs_standings_Atlantic: {
    id: 'divs_standings_Atlantic',
    columns: ['rk', 'tm', 'w', 'l', 'wl_pct', 'gb', 'pts', 'opp_pts', 'srs'],
  },
  divs_standings_Central: {
    id: 'divs_standings_Central',
    columns: ['rk', 'tm', 'w', 'l', 'wl_pct', 'gb', 'pts', 'opp_pts', 'srs'],
  },
  divs_standings_Southeast: {
    id: 'divs_standings_Southeast',
    columns: ['rk', 'tm', 'w', 'l', 'wl_pct', 'gb', 'pts', 'opp_pts', 'srs'],
  },
  divs_standings_Northwest: {
    id: 'divs_standings_Northwest',
    columns: ['rk', 'tm', 'w', 'l', 'wl_pct', 'gb', 'pts', 'opp_pts', 'srs'],
  },
  divs_standings_Pacific: {
    id: 'divs_standings_Pacific',
    columns: ['rk', 'tm', 'w', 'l', 'wl_pct', 'gb', 'pts', 'opp_pts', 'srs'],
  },
  divs_standings_Southwest: {
    id: 'divs_standings_Southwest',
    columns: ['rk', 'tm', 'w', 'l', 'wl_pct', 'gb', 'pts', 'opp_pts', 'srs'],
  },
  line_score: {
    id: 'line_score',
    columns: ['tm', 'q1', 'q2', 'q3', 'q4', 'ot1', 'ot2', 'total'],
  },
  four_factors: {
    id: 'four_factors',
    columns: ['tm', 'pace', 'efg_pct', 'tov_pct', 'orb_pct', 'ft_per_fga', 'ortg'],
  },
  box_game_basic: {
    id: 'box_game_basic',
    columns: [
      'player', 'mp',
      'fg', 'fga', 'fg_pct',
      'threep', 'threep_att', 'threep_pct',
      'ft', 'fta', 'ft_pct',
      'orb', 'drb', 'trb',
      'ast', 'stl', 'blk', 'tov', 'pf', 'pts', 'plus_minus',
    ],
  },
  box_game_advanced: {
    id: 'box_game_advanced',
    columns: [
      'player', 'mp',
      'ts_pct', 'efg_pct', 'threepar', 'ftr',
      'orb_pct', 'drb_pct', 'trb_pct', 'ast_pct', 'stl_pct', 'blk_pct', 'tov_pct', 'usg_pct',
      'ortg', 'drtg', 'bpm',
    ],
  },
  draft_stats: {
    id: 'draft_stats',
    columns: [
      'rk', 'pk', 'tm', 'player', 'college', 'yrs', 'g', 'mp', 'pts', 'trb', 'ast',
      'fg_pct', 'threep_pct', 'ft_pct',
      'mp', 'pts', 'trb', 'ast', // Totals
      'ws', 'ws_48', 'bpm', 'vorp',
    ],
  },
  playoffs_series: {
    id: 'playoffs_series',
    columns: ['round', 'winner', 'loser', 'result'],
  },
  standings_regular: {
    id: 'standings_regular',
    columns: ['tm', 'w', 'l', 'wl_pct', 'gb', 'pw', 'pl', 'ps_g', 'pa_g'],
  },
  standings_expanded: {
    id: 'standings_expanded',
    columns: [
      'tm', 'w', 'l', 'wl_pct', 'gb', 'pw', 'pl', 'ps_g', 'pa_g',
      'mov', 'sos', 'srs', 'ortg', 'drtg', 'nrtg', 'pace', 'ftr', 'threepar', 'ts_pct', 'efg_pct',
      'tov_pct', 'orb_pct', 'ft_per_fga', 'efg_pct_opp', 'tov_pct_opp', 'drb_pct_opp', 'ft_per_fga_opp',
      'attend', 'attend_g',
    ],
  },
};
