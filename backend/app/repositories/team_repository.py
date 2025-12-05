from typing import Any

import pandas as pd

from app.database import execute_query_df
from app.models import Team, TeamSeasonStats
from app.repositories.base import BaseRepository


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
        """Helper to resolve a team ID from an ID or abbreviation."""
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

        df = df.where(pd.notnull(df), None)
        records = cast(list[dict[str, Any]], df.to_dict(orient="records"))
        return [TeamSeasonStats(**record) for record in records]

    def get_team_game_log(self, team_id: str) -> list[dict[str, Any]]:
        """Return team game log (tgl_basic) rows."""
        resolved_id = self.resolve_team_id(team_id)
        if not resolved_id:
            return []

        query = """
            WITH base AS (
                SELECT
                    g.game_id,
                    g.game_date AS Date,
                    g.game_time,
                    s.is_home,
                    CASE WHEN s.is_home THEN '' ELSE '@' END AS " ",
                    CASE WHEN s.is_home THEN g.away_team_id ELSE g.home_team_id END AS opponent_id,
                    opp.abbreviation AS Opp,
                    CASE WHEN g.winner_team_id = s.team_id THEN 'W' ELSE 'L' END AS "W/L",
                    COALESCE(s.points, CASE WHEN s.team_id = g.home_team_id THEN g.home_team_score ELSE g.away_team_score END) AS Tm,
                    CASE WHEN s.team_id = g.home_team_id THEN g.away_team_score ELSE g.home_team_score END AS OppScore,
                    s.field_goals_made AS FG,
                    s.field_goals_attempted AS FGA,
                    CASE WHEN s.field_goals_attempted > 0 THEN ROUND(s.field_goals_made * 1.0 / s.field_goals_attempted, 3) ELSE NULL END AS "FG%",
                    s.three_pointers_made AS "3P",
                    s.three_pointers_attempted AS "3PA",
                    CASE WHEN s.three_pointers_attempted > 0 THEN ROUND(s.three_pointers_made * 1.0 / s.three_pointers_attempted, 3) ELSE NULL END AS "3P%",
                    s.free_throws_made AS FT,
                    s.free_throws_attempted AS FTA,
                    CASE WHEN s.free_throws_attempted > 0 THEN ROUND(s.free_throws_made * 1.0 / s.free_throws_attempted, 3) ELSE NULL END AS "FT%",
                    s.offensive_rebounds AS ORB,
                    s.defensive_rebounds AS DRB,
                    s.total_rebounds AS TRB,
                    s.assists AS AST,
                    s.steals AS STL,
                    s.blocks AS BLK,
                    s.turnovers AS TOV,
                    s.personal_fouls AS PF,
                    COALESCE(s.points, CASE WHEN s.team_id = g.home_team_id THEN g.home_team_score ELSE g.away_team_score END) AS PTS
                FROM team_game_stats s
                JOIN games g ON g.game_id = s.game_id
                LEFT JOIN teams opp ON opp.team_id = CASE WHEN s.is_home THEN g.away_team_id ELSE g.home_team_id END
                WHERE s.team_id = ?
            )
            SELECT
                ROW_NUMBER() OVER (ORDER BY Date, game_time, game_id) AS Rk,
                ROW_NUMBER() OVER (ORDER BY Date, game_time, game_id) AS G,
                Date,
                " ",
                Opp,
                "W/L",
                Tm,
                OppScore AS Opp,
                FG,
                FGA,
                "FG%",
                "3P",
                "3PA",
                "3P%",
                FT,
                FTA,
                "FT%",
                ORB,
                DRB,
                TRB,
                AST,
                STL,
                BLK,
                TOV,
                PF,
                PTS
            FROM base
            ORDER BY Date, game_time, game_id
        """
        df = execute_query_df(query, [resolved_id])
        if df.empty:
            return []
        df = df.where(pd.notnull(df), None)
        return cast(list[dict[str, Any]], df.to_dict(orient="records"))

    def get_team_schedule(self, team_id: str) -> list[dict[str, Any]]:
        """Return team schedule/results (games table)."""
        resolved_id = self.resolve_team_id(team_id)
        if not resolved_id:
            return []

        query = """
            WITH base AS (
                SELECT
                    g.game_id,
                    g.game_date AS Date,
                    g.game_time AS "Start (ET)",
                    CASE WHEN g.home_team_id = ? THEN '' ELSE '@' END AS " ",
                    COALESCE(opp.abbreviation, CASE WHEN g.home_team_id = ? THEN g.away_team_id ELSE g.home_team_id END) AS Opponent,
                    CASE WHEN g.winner_team_id = ? THEN 'W' ELSE 'L' END AS "W/L",
                    CASE
                        WHEN COALESCE(g.home_ot1, g.away_ot1, g.home_ot2, g.away_ot2, g.home_ot3, g.away_ot3, g.home_ot4, g.away_ot4) IS NOT NULL
                        THEN 'OT' ELSE '' END AS OT,
                    CASE WHEN g.home_team_id = ? THEN g.home_team_score ELSE g.away_team_score END AS Tm,
                    CASE WHEN g.home_team_id = ? THEN g.away_team_score ELSE g.home_team_score END AS Opp,
                    CASE WHEN g.winner_team_id = ? THEN 1 ELSE 0 END AS is_win
                FROM games g
                LEFT JOIN teams opp ON opp.team_id = CASE WHEN g.home_team_id = ? THEN g.away_team_id ELSE g.home_team_id END
                WHERE g.home_team_id = ? OR g.away_team_id = ?
            ),
            numbered AS (
                SELECT
                    *,
                    ROW_NUMBER() OVER (ORDER BY Date, "Start (ET)", game_id) AS G,
                    SUM(CASE WHEN is_win = 1 THEN 1 ELSE 0 END)
                        OVER (ORDER BY Date, "Start (ET)", game_id ROWS UNBOUNDED PRECEDING) AS W,
                    SUM(CASE WHEN is_win = 0 THEN 1 ELSE 0 END)
                        OVER (ORDER BY Date, "Start (ET)", game_id ROWS UNBOUNDED PRECEDING) AS L,
                    CASE
                        WHEN is_win = LAG(is_win, 1, is_win) OVER (ORDER BY Date, "Start (ET)", game_id)
                        THEN 0 ELSE 1 END AS change_flag
                FROM base
            ),
            streaked AS (
                SELECT
                    *,
                    SUM(change_flag) OVER (ORDER BY Date, "Start (ET)", game_id ROWS UNBOUNDED PRECEDING) AS grp
                FROM numbered
            )
            SELECT
                G,
                Date,
                "Start (ET)",
                " ",
                Opponent,
                "W/L",
                OT,
                Tm,
                Opp,
                W,
                L,
                (CASE WHEN is_win = 1 THEN 'W' ELSE 'L' END) ||
                    ROW_NUMBER() OVER (PARTITION BY grp ORDER BY Date, "Start (ET)", game_id) AS Streak,
                NULL AS Notes
            FROM streaked
            ORDER BY Date, "Start (ET)", game_id
        """
        params = [resolved_id] * 9
        df = execute_query_df(query, params)
        if df.empty:
            return []
        df = df.where(pd.notnull(df), None)
        return cast(list[dict[str, Any]], df.to_dict(orient="records"))

    def get_roster(self, team_id: str) -> list[dict[str, Any]]:
        """Return team roster matching Basketball-Reference roster table columns."""
        resolved_id = self.resolve_team_id(team_id)
        if not resolved_id:
            return []

        query = """
            SELECT
                c.jersey AS "No.",
                COALESCE(p.full_name, c.display_first_last) AS "Player",
                c.position AS "Pos",
                c.height AS "Ht",
                c.weight AS "Wt",
                p.birth_date AS "Birth Date",
                c.country AS "Country",
                c.season_exp AS "Exp",
                COALESCE(p.college, c.school, c.last_affiliation) AS "College"
            FROM common_player_info c
            LEFT JOIN players p
                ON p.player_id = c.person_id
            WHERE c.team_id = ?
            ORDER BY "No." NULLS LAST, "Player"
        """
        df = execute_query_df(query, [resolved_id])

        if df.empty:
            return []

        df = df.where(pd.notnull(df), None)
        return cast(list[dict[str, Any]], df.to_dict(orient="records"))
