from typing import Any


from app.core.database import execute_query_df
from app.models import (
    RosterRow,
    Team,
    TeamGameLogRow,
    TeamScheduleRow,
    TeamSeasonStats,
)
from app.repositories.base import BaseRepository
from app.utils.dataframe import clean_nan, df_to_records


class TeamRepository(BaseRepository[Team]):
    def __init__(self) -> None:
        super().__init__(Team)

    def get_teams(self, active_only: bool = True) -> list[Team]:
        query = "SELECT * FROM teams"
        params: list[Any] = []

        if active_only:
            query += " WHERE is_active = TRUE AND league = 'NBA'"

        query += " ORDER BY full_name"

        df = execute_query_df(query, params)
        return self._to_models(df)

    def get_by_id(self, team_id: str) -> Team | None:
        # Try by ID first
        query = "SELECT * FROM teams WHERE team_id = ?"
        df = execute_query_df(query, [team_id])

        if df.empty:
            # Try by abbreviation
            query = "SELECT * FROM teams WHERE abbreviation = ?"
            df = execute_query_df(query, [team_id])

        return self._to_model(df)

    def resolve_team_id(self, team_id_or_abbr: str) -> str | None:
        """Resolve a team ID from an ID or abbreviation."""
        team = self.get_by_id(team_id_or_abbr)
        return team.team_id if team else None

    def get_stats(self, team_id: str) -> list[TeamSeasonStats]:
        # Resolve ID first
        resolved_id = self.resolve_team_id(team_id)
        if not resolved_id:
            return []

        query = """
            SELECT *
            FROM team_season_stats
            WHERE team_id = ?
            ORDER BY season_id DESC
        """
        df = execute_query_df(query, [resolved_id])
        if df.empty:
            return []

        df = clean_nan(df)
        records = df_to_records(df)
        return [TeamSeasonStats(**record) for record in records]

    def get_team_game_log(self, team_id: str) -> list[TeamGameLogRow]:
        """Return team game log (tgl_basic) rows with source-of-truth columns."""
        resolved_id = self.resolve_team_id(team_id)
        if not resolved_id:
            return []

        query = """
            WITH team_games AS (
                SELECT
                    g.game_id,
                    CAST(g.game_date AS DATE) AS date,
                    g.team_id_home AS team_id,
                    g.team_abbreviation_home AS team_abbr,
                    g.matchup_home AS matchup_text,
                    g.wl_home AS wl,
                    g.pts_home AS tm_pts,
                    g.fgm_home AS fg,
                    g.fga_home AS fga,
                    g.fg_pct_home AS fg_pct,
                    g.fg3m_home AS threep,
                    g.fg3a_home AS threep_att,
                    g.fg3_pct_home AS threep_pct,
                    g.ftm_home AS ft,
                    g.fta_home AS fta,
                    g.ft_pct_home AS ft_pct,
                    g.oreb_home AS orb,
                    g.dreb_home AS drb,
                    g.reb_home AS trb,
                    g.ast_home AS ast,
                    g.stl_home AS stl,
                    g.blk_home AS blk,
                    g.tov_home AS tov,
                    g.pf_home AS pf,
                    g.pts_home AS pts
                FROM game g
                WHERE g.team_id_home = ?
            ),
            opponents AS (
                SELECT
                    game_id,
                    team_id_home AS opp_team_id,
                    team_abbreviation_home AS opp_abbr,
                    pts_home AS opp_pts
                FROM game
            ),
            game_scores AS (
                SELECT
                    g.game_id,
                    g.home_team_id,
                    g.away_team_id,
                    g.home_team_score,
                    g.away_team_score,
                    home.abbreviation AS home_abbr,
                    away.abbreviation AS away_abbr
                FROM games g
                LEFT JOIN teams home ON home.team_id = g.home_team_id
                LEFT JOIN teams away ON away.team_id = g.away_team_id
            )
            SELECT
                ROW_NUMBER() OVER (ORDER BY tg.date, tg.game_id) AS rk,
                ROW_NUMBER() OVER (ORDER BY tg.date, tg.game_id) AS g,
                tg.date,
                CASE
                    WHEN gs.home_team_id = tg.team_id THEN ''
                    WHEN gs.away_team_id = tg.team_id THEN '@'
                    WHEN tg.matchup_text ILIKE '%@%' THEN '@'
                    ELSE ''
                END AS home_away,
                COALESCE(
                    o.opp_abbr,
                    CASE WHEN gs.home_team_id = tg.team_id THEN gs.away_abbr ELSE gs.home_abbr END,
                    CASE WHEN gs.home_team_id = tg.team_id THEN gs.away_team_id ELSE gs.home_team_id END
                ) AS opp,
                CASE
                    WHEN tg.wl = 'W' THEN 'W'
                    WHEN tg.wl = 'L' THEN 'L'
                    ELSE NULL
                END AS wl,
                CASE WHEN tg.wl = 'W' THEN 1 WHEN tg.wl = 'L' THEN 0 END AS w,
                CASE WHEN tg.wl = 'L' THEN 1 WHEN tg.wl = 'W' THEN 0 END AS l,
                COALESCE(
                    tg.tm_pts,
                    CASE WHEN gs.home_team_id = tg.team_id THEN gs.home_team_score ELSE gs.away_team_score END
                ) AS tm,
                COALESCE(
                    o.opp_pts,
                    CASE WHEN gs.home_team_id = tg.team_id THEN gs.away_team_score ELSE gs.home_team_score END
                ) AS opp_pts,
                tg.fg,
                tg.fga,
                tg.fg_pct,
                tg.threep,
                tg.threep_att,
                tg.threep_pct,
                tg.ft,
                tg.fta,
                tg.ft_pct,
                tg.orb,
                tg.drb,
                tg.trb,
                tg.ast,
                tg.stl,
                tg.blk,
                tg.tov,
                tg.pf,
                tg.pts
            FROM team_games tg
            LEFT JOIN opponents o
                ON o.game_id = tg.game_id
               AND o.opp_team_id <> tg.team_id
            LEFT JOIN game_scores gs
                ON gs.game_id = tg.game_id
            ORDER BY tg.date, tg.game_id
        """
        df = execute_query_df(query, [resolved_id])
        if df.empty:
            return []
        df = clean_nan(df)
        records = df_to_records(df)
        return [TeamGameLogRow(**record) for record in records]

    def get_team_schedule(self, team_id: str) -> list[TeamScheduleRow]:
        """Return team schedule/results (games table) with source-of-truth columns."""
        resolved_id = self.resolve_team_id(team_id)
        if not resolved_id:
            return []

        query = """
            WITH base AS (
                SELECT
                    g.game_id,
                    CAST(g.game_date AS DATE) AS date,
                    CAST(g.game_time AS VARCHAR) AS start_et,
                    CASE WHEN g.home_team_id = ? THEN '' ELSE '@' END AS home_away,
                    COALESCE(opp.abbreviation, CASE WHEN g.home_team_id = ? THEN g.away_team_id ELSE g.home_team_id END) AS opp,
                    CASE
                        WHEN g.home_team_score IS NULL OR g.away_team_score IS NULL THEN NULL
                        WHEN (g.home_team_id = ? AND g.home_team_score > g.away_team_score)
                             OR (g.away_team_id = ? AND g.away_team_score > g.home_team_score)
                        THEN 'W' ELSE 'L'
                    END AS wl,
                    CASE
                        WHEN g.home_team_score IS NULL OR g.away_team_score IS NULL THEN NULL
                        WHEN (g.home_team_id = ? AND g.home_team_score > g.away_team_score)
                             OR (g.away_team_id = ? AND g.away_team_score > g.home_team_score)
                        THEN 1 ELSE 0
                    END AS is_win,
                    CASE WHEN g.home_team_id = ? THEN g.home_team_score ELSE g.away_team_score END AS tm,
                    CASE WHEN g.home_team_id = ? THEN g.away_team_score ELSE g.home_team_score END AS opp_pts,
                    CASE
                        WHEN COALESCE(g.home_ot1, g.away_ot1, g.home_ot2, g.away_ot2, g.home_ot3, g.away_ot3, g.home_ot4, g.away_ot4) IS NOT NULL THEN 'OT'
                        ELSE ''
                    END AS ot
                FROM games g
                LEFT JOIN teams opp ON opp.team_id = CASE WHEN g.home_team_id = ? THEN g.away_team_id ELSE g.home_team_id END
                WHERE g.home_team_id = ? OR g.away_team_id = ?
            ),
            numbered AS (
                SELECT
                    *,
                    ROW_NUMBER() OVER (ORDER BY date, start_et, game_id) AS g_num,
                    SUM(CASE WHEN is_win = 1 THEN 1 ELSE 0 END)
                        OVER (ORDER BY date, start_et, game_id ROWS UNBOUNDED PRECEDING) AS w_total,
                    SUM(CASE WHEN is_win = 0 THEN 1 ELSE 0 END)
                        OVER (ORDER BY date, start_et, game_id ROWS UNBOUNDED PRECEDING) AS l_total,
                    CASE
                        WHEN is_win IS NULL THEN NULL
                        WHEN is_win = LAG(is_win, 1, is_win) OVER (ORDER BY date, start_et, game_id)
                        THEN 0 ELSE 1 END AS change_flag
                FROM base
            ),
            streaked AS (
                SELECT
                    *,
                    CASE
                        WHEN change_flag IS NULL THEN NULL
                        ELSE SUM(change_flag) OVER (ORDER BY date, start_et, game_id ROWS UNBOUNDED PRECEDING)
                    END AS grp
                FROM numbered
            )
            SELECT
                g_num AS g,
                date,
                start_et,
                home_away,
                opp,
                CASE
                    WHEN is_win IS NULL THEN NULL
                    WHEN is_win = 1 THEN 'W'
                    ELSE 'L'
                END AS wl,
                w_total AS w,
                l_total AS l,
                tm,
                opp_pts,
                CASE
                    WHEN is_win IS NULL THEN NULL
                    ELSE (CASE WHEN is_win = 1 THEN 'W' ELSE 'L' END) ||
                        ROW_NUMBER() OVER (PARTITION BY grp ORDER BY date, start_et, game_id)
                END AS streak,
                NULL AS notes,
                ot
            FROM streaked
            ORDER BY date, start_et, game_id
        """
        params = [resolved_id] * 11
        df = execute_query_df(query, params)
        if df.empty:
            return []
        df = clean_nan(df)
        records = df_to_records(df)
        return [TeamScheduleRow(**record) for record in records]

    def get_roster(self, team_id: str) -> list[RosterRow]:
        """Return team roster matching Basketball-Reference roster table columns."""
        resolved_id = self.resolve_team_id(team_id)
        if not resolved_id:
            return []

        query = """
            SELECT
                c.jersey AS no,
                COALESCE(p.full_name, c.display_first_last) AS player,
                c.position AS pos,
                c.height AS ht,
                c.weight AS wt,
                CAST(p.birth_date AS DATE) AS birth_date,
                c.country AS country,
                CAST(c.season_exp AS VARCHAR) AS exp,
                COALESCE(p.college, c.school, c.last_affiliation) AS college
            FROM common_player_info c
            LEFT JOIN players p
                ON p.player_id = c.person_id
            WHERE c.team_id = ?
              AND c.rosterstatus = 'Active'
            ORDER BY no NULLS LAST, player
        """
        df = execute_query_df(query, [resolved_id])

        if df.empty:
            return []

        df = clean_nan(df)
        records = df_to_records(df)
        return [RosterRow(**record) for record in records]
