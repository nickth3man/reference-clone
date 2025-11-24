import os

import duckdb

BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
)
DB_PATH = os.path.join(BASE_DIR, "data", "nba.duckdb")


def load_splits() -> None:
    print(f"Connecting to {DB_PATH}...")
    con = duckdb.connect(DB_PATH)

    print("Clearing existing splits...")
    con.execute("DELETE FROM player_splits")

    print("Calculating Total splits...")
    # 1. Total (Season)
    con.execute("""
        INSERT INTO player_splits (
            player_id, season_id, split_type, split_value,
            games, minutes,
            field_goals_made, field_goals_attempted, field_goal_pct,
            three_pointers_made, three_pointers_attempted, three_point_pct,
            free_throws_made, free_throws_attempted, free_throw_pct,
            rebounds, assists, steals, blocks, turnovers, points,
            points_per_game,
            true_shooting_pct, effective_fg_pct
        )
        SELECT
            b.player_id,
            g.season_id,
            'Total',
            'Season',
            COUNT(DISTINCT b.game_id) as games,
            SUM(COALESCE(b.minutes_played, 0)) as minutes,
            SUM(b.field_goals_made) as fgm,
            SUM(b.field_goals_attempted) as fga,
            CASE WHEN SUM(b.field_goals_attempted) > 0 THEN CAST(SUM(b.field_goals_made) AS DOUBLE) / SUM(b.field_goals_attempted) ELSE 0 END as fg_pct,
            SUM(b.three_pointers_made) as fg3m,
            SUM(b.three_pointers_attempted) as fg3a,
            CASE WHEN SUM(b.three_pointers_attempted) > 0 THEN CAST(SUM(b.three_pointers_made) AS DOUBLE) / SUM(b.three_pointers_attempted) ELSE 0 END as fg3_pct,
            SUM(b.free_throws_made) as ftm,
            SUM(b.free_throws_attempted) as fta,
            CASE WHEN SUM(b.free_throws_attempted) > 0 THEN CAST(SUM(b.free_throws_made) AS DOUBLE) / SUM(b.free_throws_attempted) ELSE 0 END as ft_pct,
            SUM(b.total_rebounds) as trb,
            SUM(b.assists) as ast,
            SUM(b.steals) as stl,
            SUM(b.blocks) as blk,
            SUM(b.turnovers) as tov,
            SUM(b.points) as pts,
            CASE WHEN COUNT(DISTINCT b.game_id) > 0 THEN CAST(SUM(b.points) AS DOUBLE) / COUNT(DISTINCT b.game_id) ELSE 0 END as ppg,

            -- TS%: PTS / (2 * (FGA + 0.44 * FTA))
            CASE WHEN (2 * (SUM(b.field_goals_attempted) + 0.44 * SUM(b.free_throws_attempted))) > 0
                 THEN CAST(SUM(b.points) AS DOUBLE) / (2 * (SUM(b.field_goals_attempted) + 0.44 * SUM(b.free_throws_attempted)))
                 ELSE 0 END as ts_pct,

            -- eFG%: (FGM + 0.5 * 3PM) / FGA
            CASE WHEN SUM(b.field_goals_attempted) > 0
                 THEN (CAST(SUM(b.field_goals_made) AS DOUBLE) + 0.5 * CAST(SUM(b.three_pointers_made) AS DOUBLE)) / SUM(b.field_goals_attempted)
                 ELSE 0 END as efg_pct

        FROM box_scores b
        JOIN games g ON b.game_id = g.game_id
        GROUP BY b.player_id, g.season_id
    """)

    print("Calculating Location splits (Home/Away)...")
    # 2. Location
    con.execute("""
        INSERT INTO player_splits (
            player_id, season_id, split_type, split_value,
            games, minutes,
            field_goals_made, field_goals_attempted, field_goal_pct,
            three_pointers_made, three_pointers_attempted, three_point_pct,
            free_throws_made, free_throws_attempted, free_throw_pct,
            rebounds, assists, steals, blocks, turnovers, points,
            points_per_game,
            true_shooting_pct, effective_fg_pct
        )
        SELECT
            b.player_id,
            g.season_id,
            'Location',
            CASE WHEN b.team_id = g.home_team_id THEN 'Home' ELSE 'Away' END as split_value,
            COUNT(DISTINCT b.game_id) as games,
            SUM(COALESCE(b.minutes_played, 0)) as minutes,
            SUM(b.field_goals_made) as fgm,
            SUM(b.field_goals_attempted) as fga,
            CASE WHEN SUM(b.field_goals_attempted) > 0 THEN CAST(SUM(b.field_goals_made) AS DOUBLE) / SUM(b.field_goals_attempted) ELSE 0 END as fg_pct,
            SUM(b.three_pointers_made) as fg3m,
            SUM(b.three_pointers_attempted) as fg3a,
            CASE WHEN SUM(b.three_pointers_attempted) > 0 THEN CAST(SUM(b.three_pointers_made) AS DOUBLE) / SUM(b.three_pointers_attempted) ELSE 0 END as fg3_pct,
            SUM(b.free_throws_made) as ftm,
            SUM(b.free_throws_attempted) as fta,
            CASE WHEN SUM(b.free_throws_attempted) > 0 THEN CAST(SUM(b.free_throws_made) AS DOUBLE) / SUM(b.free_throws_attempted) ELSE 0 END as ft_pct,
            SUM(b.total_rebounds) as trb,
            SUM(b.assists) as ast,
            SUM(b.steals) as stl,
            SUM(b.blocks) as blk,
            SUM(b.turnovers) as tov,
            SUM(b.points) as pts,
            CASE WHEN COUNT(DISTINCT b.game_id) > 0 THEN CAST(SUM(b.points) AS DOUBLE) / COUNT(DISTINCT b.game_id) ELSE 0 END as ppg,

            CASE WHEN (2 * (SUM(b.field_goals_attempted) + 0.44 * SUM(b.free_throws_attempted))) > 0
                 THEN CAST(SUM(b.points) AS DOUBLE) / (2 * (SUM(b.field_goals_attempted) + 0.44 * SUM(b.free_throws_attempted)))
                 ELSE 0 END as ts_pct,

            CASE WHEN SUM(b.field_goals_attempted) > 0
                 THEN (CAST(SUM(b.field_goals_made) AS DOUBLE) + 0.5 * CAST(SUM(b.three_pointers_made) AS DOUBLE)) / SUM(b.field_goals_attempted)
                 ELSE 0 END as efg_pct

        FROM box_scores b
        JOIN games g ON b.game_id = g.game_id
        WHERE b.team_id IS NOT NULL AND (b.team_id = g.home_team_id OR b.team_id = g.away_team_id)
        GROUP BY b.player_id, g.season_id, CASE WHEN b.team_id = g.home_team_id THEN 'Home' ELSE 'Away' END
    """)

    print("Calculating Result splits (Win/Loss)...")
    # 3. Result
    con.execute("""
        INSERT INTO player_splits (
            player_id, season_id, split_type, split_value,
            games, minutes,
            field_goals_made, field_goals_attempted, field_goal_pct,
            three_pointers_made, three_pointers_attempted, three_point_pct,
            free_throws_made, free_throws_attempted, free_throw_pct,
            rebounds, assists, steals, blocks, turnovers, points,
            points_per_game,
            true_shooting_pct, effective_fg_pct
        )
        SELECT
            b.player_id,
            g.season_id,
            'Result',
            CASE WHEN b.team_id = g.winner_team_id THEN 'Win' ELSE 'Loss' END as split_value,
            COUNT(DISTINCT b.game_id) as games,
            SUM(COALESCE(b.minutes_played, 0)) as minutes,
            SUM(b.field_goals_made) as fgm,
            SUM(b.field_goals_attempted) as fga,
            CASE WHEN SUM(b.field_goals_attempted) > 0 THEN CAST(SUM(b.field_goals_made) AS DOUBLE) / SUM(b.field_goals_attempted) ELSE 0 END as fg_pct,
            SUM(b.three_pointers_made) as fg3m,
            SUM(b.three_pointers_attempted) as fg3a,
            CASE WHEN SUM(b.three_pointers_attempted) > 0 THEN CAST(SUM(b.three_pointers_made) AS DOUBLE) / SUM(b.three_pointers_attempted) ELSE 0 END as fg3_pct,
            SUM(b.free_throws_made) as ftm,
            SUM(b.free_throws_attempted) as fta,
            CASE WHEN SUM(b.free_throws_attempted) > 0 THEN CAST(SUM(b.free_throws_made) AS DOUBLE) / SUM(b.free_throws_attempted) ELSE 0 END as ft_pct,
            SUM(b.total_rebounds) as trb,
            SUM(b.assists) as ast,
            SUM(b.steals) as stl,
            SUM(b.blocks) as blk,
            SUM(b.turnovers) as tov,
            SUM(b.points) as pts,
            CASE WHEN COUNT(DISTINCT b.game_id) > 0 THEN CAST(SUM(b.points) AS DOUBLE) / COUNT(DISTINCT b.game_id) ELSE 0 END as ppg,

            CASE WHEN (2 * (SUM(b.field_goals_attempted) + 0.44 * SUM(b.free_throws_attempted))) > 0
                 THEN CAST(SUM(b.points) AS DOUBLE) / (2 * (SUM(b.field_goals_attempted) + 0.44 * SUM(b.free_throws_attempted)))
                 ELSE 0 END as ts_pct,

            CASE WHEN SUM(b.field_goals_attempted) > 0
                 THEN (CAST(SUM(b.field_goals_made) AS DOUBLE) + 0.5 * CAST(SUM(b.three_pointers_made) AS DOUBLE)) / SUM(b.field_goals_attempted)
                 ELSE 0 END as efg_pct

        FROM box_scores b
        JOIN games g ON b.game_id = g.game_id
        WHERE b.team_id IS NOT NULL AND g.winner_team_id IS NOT NULL
        GROUP BY b.player_id, g.season_id, CASE WHEN b.team_id = g.winner_team_id THEN 'Win' ELSE 'Loss' END
    """)

    result = con.execute("SELECT COUNT(*) FROM player_splits").fetchone()
    count = result[0] if result else 0
    print(f"Successfully loaded {count} split records.")
    con.close()


if __name__ == "__main__":
    load_splits()
