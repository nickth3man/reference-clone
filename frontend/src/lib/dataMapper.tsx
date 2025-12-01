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
  Player
} from '../types';
import { ColumnKey } from './tableSchema';

type RowData = Record<ColumnKey, any>;

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
    // We don't have possessions count, so we can't calculate per 100 accurately for all fields.
    // We'll use what's available in stats or leave blank/calculate if possible.
    // For now, let's map what we have and maybe use per game as placeholder or 0.
    // Actually, if we don't have it, we should probably show what we have.
    // But the schema expects all columns.
    // Let's use 0 or null for missing values for now.
    
    return {
      season: <Link href={`/leagues/${stat.season_id}`} className="text-blue-600 hover:underline">{stat.season_id}</Link>,
      age: stat.age,
      tm: stat.team_id === "TOT" ? "TOT" : <Link href={`/teams/${stat.team_id}`} className="text-blue-600 hover:underline">{stat.team_id}</Link>,
      lg: stat.league,
      pos: player.position,
      g: stat.games_played,
      gs: stat.games_started,
      mp: stat.minutes_played,
      fg: null, // Missing
      fga: null,
      fg_pct: stat.field_goal_pct,
      threep: null,
      threep_att: null,
      threep_pct: stat.three_point_pct,
      twop: null,
      twop_att: null,
      twop_pct: stat.two_point_pct,
      efg_pct: stat.effective_fg_pct,
      ft: null,
      fta: null,
      ft_pct: stat.free_throw_pct,
      orb: null,
      drb: null,
      trb: stat.rebounds_per_100_poss, // Available
      ast: stat.assists_per_100_poss, // Available
      stl: null,
      blk: null,
      tov: null,
      pf: null,
      pts: stat.points_per_100_poss, // Available
      ortg: null, // In advanced stats, not here
      drtg: null, // In advanced stats
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
      dist: stat.avg_dist_fga,
      pct_fga_2p: stat.pct_fga_2pt,
      pct_fga_0_3: stat.pct_fga_0_3,
      pct_fga_3_10: stat.pct_fga_3_10,
      pct_fga_10_16: stat.pct_fga_10_16,
      pct_fga_16_3p: stat.pct_fga_16_3pt,
      pct_fga_3p: stat.pct_fga_3pt,
      fg_pct_2p: stat.fg_pct_2pt,
      fg_pct_0_3: stat.fg_pct_0_3,
      fg_pct_3_10: stat.fg_pct_3_10,
      fg_pct_10_16: stat.fg_pct_10_16,
      fg_pct_16_3p: stat.fg_pct_16_3pt,
      fg_pct_3p: stat.fg_pct_3pt,
      pct_ast_2p: stat.pct_ast_2pt,
      pct_ast_3p: stat.pct_ast_3pt,
      num_dunks: stat.dunks_made,
      pct_fga_dunks: stat.pct_fga_dunks,
      threep_att_corner: stat.corner_3_att,
      threep_pct_corner: stat.corner_3_pct,
      att_heaves: stat.heaves_att,
      made_heaves: stat.heaves_made,
    } as RowData;
  });
};

export const mapToPbp = (stats: PlayerPlayByPlayStats[], basicStats: PlayerSeasonStats[], player: Player): RowData[] => {
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
      pg_pct: stat.pct_pg,
      sg_pct: stat.pct_sg,
      sf_pct: stat.pct_sf,
      pf_pct: stat.pct_pf,
      c_pct: stat.pct_c,
      on_court_plus_minus: stat.plus_minus_on,
      on_off_plus_minus: stat.plus_minus_off,
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
    return {
      season: <Link href={`/leagues/${stat.season_id}`} className="text-blue-600 hover:underline">{stat.season_id}</Link>,
      age: 0, // Need age from somewhere, maybe join with season stats or calculate
      tm: stat.team_id === "TOT" ? "TOT" : <Link href={`/teams/${stat.team_id}`} className="text-blue-600 hover:underline">{stat.team_id}</Link>,
      lg: "NBA", // Assuming NBA
      pos: player.position,
      g: 0, // Not in AdjustedShooting model
      mp: 0, // Not in AdjustedShooting model
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
    return {
      rk: index + 1,
      g: stat.game_number,
      date: stat.game_date,
      age: stat.age,
      tm: <Link href={`/teams/${stat.team_id}`} className="text-blue-600 hover:underline">{stat.team_id}</Link>,
      opp: <Link href={`/teams/${stat.opponent_team_id}`} className="text-blue-600 hover:underline">{stat.opponent_team_id}</Link>,
      result: stat.game_result, // e.g. "W (+5)"
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
      gmsc: 0, // Game Score not in model yet
      plus_minus: stat.plus_minus,
    } as RowData;
  });
};

export const mapToSplits = (stats: PlayerSplits[], player: Player): RowData[] => {
  return stats.map(stat => {
    return {
      split_value: stat.split_value,
      g: stat.games,
      gs: 0, // Not in Splits model
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
      orb: 0, // Not in Splits model
      drb: 0, // Not in Splits model
      trb: stat.rebounds,
      ast: stat.assists,
      stl: stat.steals,
      blk: stat.blocks,
      tov: stat.turnovers,
      pf: 0, // Not in Splits model
      pts: stat.points,
    } as RowData;
  });
};
// But I can infer them from the file I read earlier or just map what I know.
// I'll add them as I go or if I can see the types.
