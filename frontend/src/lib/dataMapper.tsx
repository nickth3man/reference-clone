import React from 'react';
import Link from 'next/link';
import { 
  PlayerSeasonStats, 
  PlayerAdvancedStats, 
  PlayerShootingStats, 
  PlayerPlayByPlayStats,
  PlayerAdjustedShooting,
  PlayerGameLog,
  PlayerSplits,
  Player,
  Team,
  Game,
  DraftPick,
} from '../types';
import { TeamSeasonStats } from '../types/season';
import { ColumnKey } from './tableSchema';

type RowData = Record<ColumnKey, any>;

export const mapToAdvanced = (
  stats: PlayerAdvancedStats[],
  basicStats: PlayerSeasonStats[],
  player: Player
): RowData[] => {
  return stats.map(stat => {
    const basic = basicStats.find(b => b.season_id === stat.season_id && b.team_id === stat.team_id);
    return {
      season: <Link href={`/leagues/${stat.season_id}`} className="text-blue-600 hover:underline">{stat.season_id}</Link>,
      age: basic?.age,
      tm: stat.team_id === "TOT" ? "TOT" : <Link href={`/teams/${stat.team_id}`} className="text-blue-600 hover:underline">{stat.team_id}</Link>,
      lg: basic?.league,
      pos: player.position,
      g: basic?.games_played,
      mp: basic?.minutes_played,
      per: stat.player_efficiency_rating,
      ts_pct: stat.true_shooting_pct,
      threepar: stat.three_point_attempt_rate,
      ftr: stat.free_throw_rate,
      orb_pct: stat.offensive_rebound_pct,
      drb_pct: stat.defensive_rebound_pct,
      trb_pct: stat.total_rebound_pct,
      ast_pct: stat.assist_pct,
      stl_pct: stat.steal_pct,
      blk_pct: stat.block_pct,
      tov_pct: stat.turnover_pct,
      usg_pct: stat.usage_pct,
      ows: stat.offensive_win_shares,
      dws: stat.defensive_win_shares,
      ws: stat.win_shares,
      ws_48: stat.win_shares_per_48,
      obpm: stat.offensive_box_plus_minus,
      dbpm: stat.defensive_box_plus_minus,
      bpm: stat.box_plus_minus,
      vorp: stat.value_over_replacement,
    } as RowData;
  });
};

export const mapToPerGame = (stats: PlayerSeasonStats[], player: Player): RowData[] => {
  return stats.map(stat => {
    const g = stat.games_played || 1;
    const mp = stat.minutes_played || 0;
    
    // Helper to calculate per game
    const perGame = (val: number | undefined) => (val ? val / g : 0);

    return {
      season: <Link href={`/leagues/${stat.season_id}`} className="text-blue-600 hover:underline">{stat.season_id}</Link>,
      age: stat.age,
      tm: stat.team_id === "TOT" ? "TOT" : <Link href={`/teams/${stat.team_id}`} className="text-blue-600 hover:underline">{stat.team_id}</Link>,
      lg: stat.league,
      pos: player.position, // Or stat.pos if available in future
      g: stat.games_played,
      gs: stat.games_started,
      mp: perGame(stat.minutes_played),
      fg: perGame(stat.field_goals_made),
      fga: perGame(stat.field_goals_attempted),
      fg_pct: stat.field_goal_pct, // Already percent (0-1 or 0-100? usually 0-1)
      threep: perGame(stat.three_pointers_made),
      threep_att: perGame(stat.three_pointers_attempted),
      threep_pct: stat.three_point_pct,
      twop: perGame(stat.two_pointers_made),
      twop_att: perGame(stat.two_pointers_attempted),
      twop_pct: stat.two_point_pct,
      efg_pct: stat.effective_fg_pct,
      ft: perGame(stat.free_throws_made),
      fta: perGame(stat.free_throws_attempted),
      ft_pct: stat.free_throw_pct,
      orb: perGame(stat.offensive_rebounds),
      drb: perGame(stat.defensive_rebounds),
      trb: perGame(stat.total_rebounds),
      ast: perGame(stat.assists),
      stl: perGame(stat.steals),
      blk: perGame(stat.blocks),
      tov: perGame(stat.turnovers),
      pf: perGame(stat.personal_fouls),
      pts: perGame(stat.points),
    } as RowData;
  });
};

export const mapToTotals = (stats: PlayerSeasonStats[], player: Player): RowData[] => {
  return stats.map(stat => {
    return {
      season: <Link href={`/leagues/${stat.season_id}`} className="text-blue-600 hover:underline">{stat.season_id}</Link>,
      age: stat.age,
      tm: stat.team_id === "TOT" ? "TOT" : <Link href={`/teams/${stat.team_id}`} className="text-blue-600 hover:underline">{stat.team_id}</Link>,
      lg: stat.league,
      pos: player.position,
      g: stat.games_played,
      gs: stat.games_started,
      mp: stat.minutes_played,
      fg: stat.field_goals_made,
      fga: stat.field_goals_attempted,
      fg_pct: stat.field_goal_pct,
      threep: stat.three_pointers_made,
      threep_att: stat.three_pointers_attempted,
      threep_pct: stat.three_point_pct,
      twop: stat.two_pointers_made,
      twop_att: stat.two_pointers_attempted,
      twop_pct: stat.two_point_pct,
      efg_pct: stat.effective_fg_pct,
      ft: stat.free_throws_made,
      fta: stat.free_throws_attempted,
      ft_pct: stat.free_throw_pct,
      orb: stat.offensive_rebounds,
      drb: stat.defensive_rebounds,
      trb: stat.total_rebounds,
      ast: stat.assists,
      stl: stat.steals,
      blk: stat.blocks,
      tov: stat.turnovers,
      pf: stat.personal_fouls,
      pts: stat.points,
    } as RowData;
  });
};

export const mapToPerMinute = (stats: PlayerSeasonStats[], player: Player): RowData[] => {
  return stats.map(stat => {
    const mp = stat.minutes_played || 0;
    const factor = mp > 0 ? 36 / mp : 0;

    const per36 = (val: number | undefined) => (val ? val * factor : 0);

    return {
      season: <Link href={`/leagues/${stat.season_id}`} className="text-blue-600 hover:underline">{stat.season_id}</Link>,
      age: stat.age,
      tm: stat.team_id === "TOT" ? "TOT" : <Link href={`/teams/${stat.team_id}`} className="text-blue-600 hover:underline">{stat.team_id}</Link>,
      lg: stat.league,
      pos: player.position,
      g: stat.games_played,
      gs: stat.games_started,
      mp: stat.minutes_played, 
      fg: per36(stat.field_goals_made),
      fga: per36(stat.field_goals_attempted),
      fg_pct: stat.field_goal_pct,
      threep: per36(stat.three_pointers_made),
      threep_att: per36(stat.three_pointers_attempted),
      threep_pct: stat.three_point_pct,
      twop: per36(stat.two_pointers_made),
      twop_att: per36(stat.two_pointers_attempted),
      twop_pct: stat.two_point_pct,
      efg_pct: stat.effective_fg_pct,
      ft: per36(stat.free_throws_made),
      fta: per36(stat.free_throws_attempted),
      ft_pct: stat.free_throw_pct,
      orb: per36(stat.offensive_rebounds),
      drb: per36(stat.defensive_rebounds),
      trb: per36(stat.total_rebounds),
      ast: per36(stat.assists),
      stl: per36(stat.steals),
      blk: per36(stat.blocks),
      tov: per36(stat.turnovers),
      pf: per36(stat.personal_fouls),
      pts: per36(stat.points),
    } as RowData;
  });
};

export const mapToPerPoss = (stats: PlayerSeasonStats[], player: Player): RowData[] => {
  return stats.map(stat => {
    const per100OrNull = (value?: number | null) => (value === null || value === undefined ? null : value);
    return {
      season: <Link href={`/leagues/${stat.season_id}`} className="text-blue-600 hover:underline">{stat.season_id}</Link>,
      age: stat.age,
      tm: stat.team_id === "TOT" ? "TOT" : <Link href={`/teams/${stat.team_id}`} className="text-blue-600 hover:underline">{stat.team_id}</Link>,
      lg: stat.league,
      pos: player.position,
      g: stat.games_played,
      gs: stat.games_started,
      mp: stat.minutes_played,
      fg: per100OrNull(stat.field_goals_per_100_poss),
      fga: per100OrNull(stat.field_goals_attempted_per_100_poss),
      fg_pct: stat.field_goal_pct,
      threep: per100OrNull(stat.three_pointers_per_100_poss),
      threep_att: per100OrNull(stat.three_pointers_attempted_per_100_poss),
      threep_pct: stat.three_point_pct,
      twop: per100OrNull(stat.two_pointers_per_100_poss),
      twop_att: per100OrNull(stat.two_pointers_attempted_per_100_poss),
      twop_pct: stat.two_point_pct,
      efg_pct: stat.effective_fg_pct,
      ft: per100OrNull(stat.free_throws_per_100_poss),
      fta: per100OrNull(stat.free_throws_attempted_per_100_poss),
      ft_pct: stat.free_throw_pct,
      orb: per100OrNull(stat.offensive_rebounds_per_100_poss),
      drb: per100OrNull(stat.defensive_rebounds_per_100_poss),
      trb: per100OrNull(stat.rebounds_per_100_poss),
      ast: per100OrNull(stat.assists_per_100_poss),
      stl: per100OrNull(stat.steals_per_100_poss),
      blk: per100OrNull(stat.blocks_per_100_poss),
      tov: per100OrNull(stat.turnovers_per_100_poss),
      pf: per100OrNull(stat.personal_fouls_per_100_poss),
      pts: per100OrNull(stat.points_per_100_poss),
      ortg: per100OrNull(stat.offensive_rating),
      drtg: per100OrNull(stat.defensive_rating),
    } as RowData;
  });
};

export const mapToShooting = (stats: PlayerShootingStats[], basicStats: PlayerSeasonStats[], player: Player): RowData[] => {
  return stats.map(stat => {
    const basic = basicStats.find(b => b.season_id === stat.season_id && b.team_id === stat.team_id);
    return {
      season: <Link href={`/leagues/${stat.season_id}`} className="text-blue-600 hover:underline">{stat.season_id}</Link>,
      age: basic?.age,
      tm: stat.team_id === "TOT" ? "TOT" : <Link href={`/teams/${stat.team_id}`} className="text-blue-600 hover:underline">{stat.team_id}</Link>,
      lg: basic?.league,
      pos: player.position,
      g: basic?.games_played,
      mp: basic?.minutes_played,
      fg_pct: basic?.field_goal_pct,
      dist: stat.average_shot_distance,
      pct_fga_2p: stat.pct_fga_2pt,
      pct_fga_0_3: stat.pct_fga_at_rim,
      pct_fga_3_10: stat.pct_fga_3_10,
      pct_fga_10_16: stat.pct_fga_10_16,
      pct_fga_16_3p: stat.pct_fga_16_3pt,
      pct_fga_3p: stat.pct_fga_3pt,
      fg_pct_2p: basic?.two_point_pct,
      fg_pct_0_3: stat.fg_pct_at_rim,
      fg_pct_3_10: stat.fg_pct_3_10,
      fg_pct_10_16: stat.fg_pct_10_16,
      fg_pct_16_3p: stat.fg_pct_16_3pt,
      fg_pct_3p: stat.fg_pct_3pt,
      pct_ast_2p: stat.pct_fg_assisted_2pt,
      pct_ast_3p: stat.pct_fg_assisted_3pt,
      num_dunks: stat.dunks,
      pct_fga_dunks: stat.pct_fga_dunks,
      threep_att_corner: stat.corner_3_attempts,
      threep_pct_corner: stat.corner_3_pct,
      att_heaves: stat.heaves_attempted,
      made_heaves: stat.heaves_made,
    } as RowData;
  });
};

export const mapToPbp = (stats: PlayerPlayByPlayStats[], basicStats: PlayerSeasonStats[], player: Player): RowData[] => {
  return stats.map(stat => {
    const basic = basicStats.find(b => b.season_id === stat.season_id && b.team_id === stat.team_id);
    const on_court = stat.plus_minus_on ?? null;
    const on_off = (stat.plus_minus_on ?? 0) - (stat.plus_minus_off ?? 0);
    return {
      season: <Link href={`/leagues/${stat.season_id}`} className="text-blue-600 hover:underline">{stat.season_id}</Link>,
      age: basic?.age,
      tm: stat.team_id === "TOT" ? "TOT" : <Link href={`/teams/${stat.team_id}`} className="text-blue-600 hover:underline">{stat.team_id}</Link>,
      lg: basic?.league,
      pos: player.position,
      g: basic?.games_played,
      mp: basic?.minutes_played,
      pg_pct: stat.pct_pg,
      sg_pct: stat.pct_sg,
      sf_pct: stat.pct_sf,
      pf_pct: stat.pct_pf,
      c_pct: stat.pct_c,
      on_court_plus_minus: on_court,
      on_off_plus_minus: on_off,
      bad_pass_to: stat.bad_pass_turnovers,
      lost_ball_to: stat.lost_ball_turnovers,
      shooting_fouls: stat.shooting_fouls_committed,
      offensive_fouls: stat.offensive_fouls_committed,
      shooting_fouls_drawn: stat.shooting_fouls_drawn,
      and1s: stat.and_one_attempts,
      blocked: stat.blocked_field_goal_attempts,
    } as RowData;
  });
};

export const mapToAdjustedShooting = (stats: PlayerAdjustedShooting[], player: Player): RowData[] => {
  return stats.map(stat => {
    // We do not have season-type separation here; age/g/mp pulled from totals are unavailable, so keep nulls where missing.
    return {
      season: <Link href={`/leagues/${stat.season_id}`} className="text-blue-600 hover:underline">{stat.season_id}</Link>,
      age: undefined,
      tm: stat.team_id === "TOT" ? "TOT" : <Link href={`/teams/${stat.team_id}`} className="text-blue-600 hover:underline">{stat.team_id}</Link>,
      lg: "NBA", // Assuming NBA
      pos: player.position,
      g: undefined,
      mp: undefined,
      fg: stat.fg_made,
      fga: stat.fg_attempted,
      fg_pct: stat.fg_pct,
      twop: stat.fg2_made,
      twop_att: stat.fg2_attempted,
      twop_pct: stat.fg2_pct,
      threep: stat.fg3_made,
      threep_att: stat.fg3_attempted,
      threep_pct: stat.fg3_pct,
      efg_pct: stat.efg_pct,
      ft: stat.ft_made,
      fta: stat.ft_attempted,
      ft_pct: stat.ft_pct,
      ts_pct: stat.ts_pct,
      ftr: stat.ft_rate,
      threepar: stat.fg3_rate,
      fg_plus: stat.fg_plus,
      twop_plus: stat.fg2_plus,
      threep_plus: stat.fg3_plus,
      efg_plus: stat.efg_plus,
      ft_plus: stat.ft_plus,
      ts_plus: stat.ts_plus,
      ftr_plus: stat.ft_rate_plus,
      threepar_plus: stat.fg3_rate_plus,
    } as RowData;
  });
};

export const mapToGameLog = (stats: PlayerGameLog[], player: Player): RowData[] => {
  return stats.map((stat, index) => {
    const result = stat.game_result ?? (stat.is_win === undefined ? undefined : (stat.is_win ? "W" : "L"));
    return {
      rk: index + 1,
      g: stat.game_number,
      date: stat.game_date,
      age: stat.age,
      tm: <Link href={`/teams/${stat.team_id}`} className="text-blue-600 hover:underline">{stat.team_id}</Link>,
      home_away: stat.is_home ? '' : '@',
      opp: <Link href={`/teams/${stat.opponent_team_id}`} className="text-blue-600 hover:underline">{stat.opponent_team_id}</Link>,
      result,
      gs: stat.is_starter ? 1 : 0,
      mp: stat.minutes_played,
      fg: stat.field_goals_made,
      fga: stat.field_goals_attempted,
      fg_pct: stat.field_goal_pct,
      threep: stat.three_pointers_made,
      threep_att: stat.three_pointers_attempted,
      threep_pct: stat.three_point_pct,
      ft: stat.free_throws_made,
      fta: stat.free_throws_attempted,
      ft_pct: stat.free_throw_pct,
      orb: stat.offensive_rebounds,
      drb: stat.defensive_rebounds,
      trb: stat.total_rebounds,
      ast: stat.assists,
      stl: stat.steals,
      blk: stat.blocks,
      tov: stat.turnovers,
      pf: stat.personal_fouls,
      pts: stat.points,
      gmsc: stat.game_score,
      plus_minus: stat.plus_minus,
    } as RowData;
  });
};

export const mapToSplits = (stats: PlayerSplits[], player: Player): RowData[] => {
  return stats.map(stat => {
    return {
      split_value: stat.split_value,
      g: stat.games,
      gs: stat.games ?? 0, // Splits model lacks starts; best effort
      mp: stat.minutes,
      fg: stat.field_goals_made,
      fga: stat.field_goals_attempted,
      fg_pct: stat.field_goal_pct,
      threep: stat.three_pointers_made,
      threep_att: stat.three_pointers_attempted,
      threep_pct: stat.three_point_pct,
      ft: stat.free_throws_made,
      fta: stat.free_throws_attempted,
      ft_pct: stat.free_throw_pct,
      orb: 0,
      drb: 0,
      trb: stat.rebounds,
      ast: stat.assists,
      stl: stat.steals,
      blk: stat.blocks,
      tov: stat.turnovers,
      pf: 0,
      pts: stat.points,
    } as RowData;
  });
};

export const mapTeamPerGame = (stats: TeamSeasonStats[], team: Team): RowData[] => {
  const perGame = (total?: number, g?: number | null) => {
    if (!g || g === 0 || total === undefined || total === null) return null;
    return total / g;
  };

  return stats.map(stat => {
    const g = stat.games_played ?? (stat.wins !== undefined && stat.losses !== undefined ? stat.wins + stat.losses : undefined);
    return {
      season: <Link href={`/leagues/${stat.season_id}`} className="text-blue-600 hover:underline">{stat.season_id}</Link>,
      age: stat.average_age,
      tm: team.team_id,
      lg: "NBA",
      pos: "-",
      g,
      gs: null,
      mp: perGame(stat.minutes_played, g),
      fg: stat.field_goals_per_game ?? perGame(stat.field_goals_made, g),
      fga: stat.field_goals_attempted_per_game ?? perGame(stat.field_goals_attempted, g),
      fg_pct: stat.field_goal_pct,
      threep: stat.three_pointers_per_game ?? perGame(stat.three_pointers_made, g),
      threep_att: stat.three_pointers_attempted_per_game ?? perGame(stat.three_pointers_attempted, g),
      threep_pct: stat.three_point_pct,
      twop: stat.two_pointers_per_game ?? perGame(stat.two_pointers_made, g),
      twop_att: stat.two_pointers_attempted_per_game ?? perGame(stat.two_pointers_attempted, g),
      twop_pct: stat.two_point_pct,
      efg_pct: stat.effective_fg_pct,
      ft: stat.free_throws_per_game ?? perGame(stat.free_throws_made, g),
      fta: stat.free_throws_attempted_per_game ?? perGame(stat.free_throws_attempted, g),
      ft_pct: stat.free_throw_pct,
      orb: stat.offensive_rebounds_per_game ?? perGame(stat.offensive_rebounds, g),
      drb: stat.defensive_rebounds_per_game ?? perGame(stat.defensive_rebounds, g),
      trb: stat.rebounds_per_game ?? perGame(stat.total_rebounds, g),
      ast: stat.assists_per_game ?? perGame(stat.assists, g),
      stl: stat.steals_per_game ?? perGame(stat.steals, g),
      blk: stat.blocks_per_game ?? perGame(stat.blocks, g),
      tov: stat.turnovers_per_game ?? perGame(stat.turnovers, g),
      pf: stat.personal_fouls_per_game ?? perGame(stat.personal_fouls, g),
      pts: stat.points_per_game ?? perGame(stat.points_per_game ? stat.points_per_game * (g ?? 0) : stat.points_per_game, g),
    } as RowData;
  });
};

export const mapTeamTotals = (stats: TeamSeasonStats[], team: Team): RowData[] => {
  return stats.map(stat => {
    const g = stat.games_played ?? (stat.wins !== undefined && stat.losses !== undefined ? stat.wins + stat.losses : undefined);
    return {
      season: <Link href={`/leagues/${stat.season_id}`} className="text-blue-600 hover:underline">{stat.season_id}</Link>,
      age: stat.average_age,
      tm: team.team_id,
      lg: "NBA",
      pos: "-",
      g,
      gs: null,
      mp: stat.minutes_played,
      fg: stat.field_goals_made,
      fga: stat.field_goals_attempted,
      fg_pct: stat.field_goal_pct,
      threep: stat.three_pointers_made,
      threep_att: stat.three_pointers_attempted,
      threep_pct: stat.three_point_pct,
      twop: stat.two_pointers_made,
      twop_att: stat.two_pointers_attempted,
      twop_pct: stat.two_point_pct,
      efg_pct: stat.effective_fg_pct,
      ft: stat.free_throws_made,
      fta: stat.free_throws_attempted,
      ft_pct: stat.free_throw_pct,
      orb: stat.offensive_rebounds,
      drb: stat.defensive_rebounds,
      trb: stat.total_rebounds,
      ast: stat.assists,
      stl: stat.steals,
      blk: stat.blocks,
      tov: stat.turnovers,
      pf: stat.personal_fouls,
      pts: stat.points_per_game ? stat.points_per_game * (g ?? 0) : undefined,
    } as RowData;
  });
};

export const mapTeamAdvanced = (stats: TeamSeasonStats[], team: Team): RowData[] => {
  return stats.map(stat => {
    const g = stat.games_played ?? (stat.wins !== undefined && stat.losses !== undefined ? stat.wins + stat.losses : undefined);
    return {
      season: <Link href={`/leagues/${stat.season_id}`} className="text-blue-600 hover:underline">{stat.season_id}</Link>,
      age: stat.average_age,
      tm: team.team_id,
      lg: "NBA",
      pos: "-",
      g,
      mp: stat.minutes_played,
      per: null,
      ts_pct: stat.true_shooting_pct,
      threepar: null,
      ftr: stat.free_throw_rate,
      orb_pct: stat.offensive_rebound_pct,
      drb_pct: stat.defensive_rebound_pct,
      trb_pct: null,
      ast_pct: null,
      stl_pct: null,
      blk_pct: null,
      tov_pct: stat.turnover_pct,
      usg_pct: null,
      ows: null,
      dws: null,
      ws: null,
      ws_48: null,
      obpm: stat.offensive_rating,
      dbpm: stat.defensive_rating,
      bpm: stat.net_rating,
      vorp: null,
    } as RowData;
  });
};

export const mapTeamGameLog = (games: Game[], teamId: string): RowData[] => {
  return games.map((game, idx) => {
    const isHome = game.home_team_id === teamId;
    const teamScore = isHome ? game.home_team_score : game.away_team_score;
    const oppScore = isHome ? game.away_team_score : game.home_team_score;
    const opponentId = isHome ? game.away_team_id : game.home_team_id;
    const win = teamScore !== undefined && oppScore !== undefined ? teamScore > oppScore : null;
    return {
      rk: idx + 1,
      g: idx + 1,
      date: game.game_date,
      opp: <Link href={`/teams/${opponentId}`} className="text-blue-600 hover:underline">{opponentId}</Link>,
      w: win === null ? null : win ? 1 : 0,
      l: win === null ? null : win ? 0 : 1,
      tm: teamScore,
      opp_pts: oppScore,
      fg: null,
      fga: null,
      fg_pct: null,
      threep: null,
      threep_att: null,
      threep_pct: null,
      ft: null,
      fta: null,
      ft_pct: null,
      orb: null,
      drb: null,
      trb: null,
      ast: null,
      stl: null,
      blk: null,
      tov: null,
      pf: null,
      pts: teamScore,
    } as RowData;
  });
};

export const mapDraftPicks = (picks: DraftPick[]): RowData[] => {
  return picks.map((pick, idx) => ({
    rk: pick.overall_pick ?? idx + 1,
    pk: pick.pick_number ?? pick.overall_pick,
    tm: pick.team_id,
    player: pick.player_name,
    college: pick.college,
    yrs: null,
    g: pick.career_games,
    mp: null,
    pts: pick.career_points,
    trb: null,
    ast: null,
    fg_pct: null,
    threep_pct: null,
    ft_pct: null,
    mp_total: null,
    pts_total: pick.career_points,
    trb_total: null,
    ast_total: null,
    ws: pick.career_win_shares,
    ws_48: null,
    bpm: null,
    vorp: pick.career_vorp,
  }));
};
// I'll add them as I go or if I can see the types.
