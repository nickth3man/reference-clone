import os
import duckdb

BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
)
DB_PATH = os.path.join(BASE_DIR, "data", "nba.duckdb")

def populate_boxscores():
    print(f"Connecting to {DB_PATH}...")
    con = duckdb.connect(DB_PATH)

    # 1. Populate Seasons
    print("Ensuring seasons table is populated...")
    con.execute("""
        INSERT INTO seasons (season_id)
        SELECT DISTINCT season_id 
        FROM game 
        WHERE season_id IS NOT NULL 
        ON CONFLICT (season_id) DO NOTHING
    """)

    # 2. Populate Teams
    print("Ensuring teams table is populated...")
    con.execute("""
        INSERT INTO teams (team_id, full_name, abbreviation, city, is_active)
        SELECT id, MIN(name), MIN(abbr), NULL, TRUE
        FROM (
            SELECT team_id_home as id, team_name_home as name, team_abbreviation_home as abbr 
            FROM game 
            WHERE team_id_home IS NOT NULL
            
            UNION ALL
            
            SELECT team_id_away as id, team_name_away as name, team_abbreviation_away as abbr 
            FROM game 
            WHERE team_id_away IS NOT NULL
        ) combined_teams
        GROUP BY id
        ON CONFLICT (team_id) DO NOTHING
    """)

    # 3. Populate Players (Critical for FKs)
    print("Ensuring players table is populated from player_directory...")
    con.execute("""
        INSERT INTO players (
            player_id, full_name, first_name, last_name, birth_date, 
            height_inches, weight_lbs, position, college
        )
        SELECT 
            slug,
            player,
            NULL, -- split later if needed
            NULL,
            birth_date,
            ht_in_in,
            wt,
            pos,
            colleges
        FROM player_directory
        ON CONFLICT (player_id) DO NOTHING
    """)
    
    # 4. Populate Games
    print("Populating games table...")
    con.execute("DELETE FROM games")
    games_insert_query = """
        INSERT INTO games (
            game_id, season_id, game_date, 
            home_team_id, away_team_id, 
            home_team_score, away_team_score,
            game_type
        )
        SELECT 
            game_id, 
            MIN(season_id), 
            MIN(CAST(game_date AS DATE)), 
            MIN(team_id_home), 
            MIN(team_id_away), 
            MIN(CAST(pts_home AS INTEGER)), 
            MIN(CAST(pts_away AS INTEGER)),
            MIN(season_type)
        FROM game
        WHERE game_id IS NOT NULL
        GROUP BY game_id
    """
    con.execute(games_insert_query)
    games_count = con.execute("SELECT COUNT(*) FROM games").fetchone()[0]
    print(f"Populated games table with {games_count} rows.")

    # 5. Populate Box Scores
    print("Aggregating play-by-play data into box_scores...")
    con.execute("DELETE FROM box_scores")

    # We use a flexible mapping strategy:
    # 1. NBA ID -> Common Player Info -> Player Directory (Dob + Name)
    # 2. NBA Name -> Player Directory (Name)
    query = """
        INSERT INTO box_scores (
            game_id, player_id, team_id, 
            field_goals_made, field_goals_attempted,
            three_pointers_made, three_pointers_attempted,
            free_throws_made, free_throws_attempted,
            offensive_rebounds, defensive_rebounds, total_rebounds,
            assists, steals, blocks, turnovers, personal_fouls, points,
            plus_minus
        )
        WITH player_map_base AS (
            -- Get all distinct players from PBP
            SELECT DISTINCT player1_id, player1_name FROM play_by_play 
            WHERE player1_id IS NOT NULL AND player1_id != '0'
        ),
        player_map AS (
            SELECT 
                pmb.player1_id as nba_id,
                COALESCE(pd1.slug, pd2.slug) as br_id
            FROM player_map_base pmb
            -- Try matching via ID -> CPI -> Directory
            LEFT JOIN common_player_info cpi ON pmb.player1_id = CAST(cpi.person_id AS VARCHAR)
            LEFT JOIN player_directory pd1 
              ON cpi.display_first_last = pd1.player 
              AND CAST(cpi.birthdate AS DATE) = pd1.birth_date
            -- Try matching via Name -> Directory
            LEFT JOIN player_directory pd2 ON pmb.player1_name = pd2.player
            WHERE COALESCE(pd1.slug, pd2.slug) IS NOT NULL
        ),
        valid_games AS (
            SELECT game_id FROM games
        ),
        pbp_stats AS (
            SELECT 
                pbp.game_id,
                pm.br_id AS player_id,
                CAST(CAST(pbp.player1_team_id AS DECIMAL) AS BIGINT)::VARCHAR AS team_id,
                
                SUM(CASE WHEN eventmsgtype = 1 THEN 1 ELSE 0 END) as fgm,
                SUM(CASE WHEN eventmsgtype IN (1, 2) THEN 1 ELSE 0 END) as fga,
                SUM(CASE WHEN eventmsgtype = 1 AND (LOWER(homedescription) LIKE '%3pt%' OR LOWER(visitordescription) LIKE '%3pt%') THEN 1 ELSE 0 END) as fg3m,
                SUM(CASE WHEN eventmsgtype IN (1, 2) AND (LOWER(homedescription) LIKE '%3pt%' OR LOWER(visitordescription) LIKE '%3pt%') THEN 1 ELSE 0 END) as fg3a,
                SUM(CASE WHEN eventmsgtype = 3 AND NOT (LOWER(homedescription) LIKE '%miss%' OR LOWER(visitordescription) LIKE '%miss%') THEN 1 ELSE 0 END) as ftm,
                SUM(CASE WHEN eventmsgtype = 3 THEN 1 ELSE 0 END) as fta,
                0 as orb,
                0 as drb,
                SUM(CASE WHEN eventmsgtype = 4 THEN 1 ELSE 0 END) as trb,
                SUM(CASE WHEN eventmsgtype = 5 THEN 1 ELSE 0 END) as tov,
                SUM(CASE WHEN eventmsgtype = 6 THEN 1 ELSE 0 END) as pf
                
            FROM play_by_play pbp
            JOIN player_map pm ON pbp.player1_id = pm.nba_id
            WHERE pbp.player1_id IS NOT NULL AND pbp.player1_id != '0'
              AND pbp.game_id IN (SELECT game_id FROM valid_games)
            GROUP BY pbp.game_id, pm.br_id, pbp.player1_team_id
        ),
        
        assists_stats AS (
            SELECT 
                pbp.game_id, 
                pm.br_id as player_id, 
                CAST(CAST(pbp.player2_team_id AS DECIMAL) AS BIGINT)::VARCHAR as team_id,
                COUNT(*) as ast
            FROM play_by_play pbp
            JOIN player_map pm ON pbp.player2_id = pm.nba_id
            WHERE eventmsgtype = 1 AND pbp.player2_id IS NOT NULL AND pbp.player2_id != '0'
              AND pbp.game_id IN (SELECT game_id FROM valid_games)
            GROUP BY pbp.game_id, pm.br_id, pbp.player2_team_id
        ),
        
        steals_stats AS (
            SELECT 
                pbp.game_id, 
                pm.br_id as player_id, 
                CAST(CAST(pbp.player2_team_id AS DECIMAL) AS BIGINT)::VARCHAR as team_id,
                COUNT(*) as stl
            FROM play_by_play pbp
            JOIN player_map pm ON pbp.player2_id = pm.nba_id
            WHERE eventmsgtype = 5 AND pbp.player2_id IS NOT NULL AND pbp.player2_id != '0'
              AND pbp.game_id IN (SELECT game_id FROM valid_games)
            GROUP BY pbp.game_id, pm.br_id, pbp.player2_team_id
        ),

        blocks_stats AS (
            SELECT 
                pbp.game_id, 
                pm.br_id as player_id, 
                CAST(CAST(pbp.player3_team_id AS DECIMAL) AS BIGINT)::VARCHAR as team_id,
                COUNT(*) as blk
            FROM play_by_play pbp
            JOIN player_map pm ON pbp.player3_id = pm.nba_id
            WHERE eventmsgtype = 2 AND pbp.player3_id IS NOT NULL AND pbp.player3_id != '0'
              AND pbp.game_id IN (SELECT game_id FROM valid_games)
            GROUP BY pbp.game_id, pm.br_id, pbp.player3_team_id
        ),
        
        merged_stats AS (
            SELECT 
                COALESCE(p1.game_id, p2.game_id, p3.game_id, p4.game_id) as game_id,
                COALESCE(p1.player_id, p2.player_id, p3.player_id, p4.player_id) as player_id,
                COALESCE(p1.team_id, p2.team_id, p3.team_id, p4.team_id) as team_id,
                
                COALESCE(p1.fgm, 0) as fgm,
                COALESCE(p1.fga, 0) as fga,
                COALESCE(p1.fg3m, 0) as fg3m,
                COALESCE(p1.fg3a, 0) as fg3a,
                COALESCE(p1.ftm, 0) as ftm,
                COALESCE(p1.fta, 0) as fta,
                COALESCE(p1.trb, 0) as trb,
                COALESCE(p1.tov, 0) as tov,
                COALESCE(p1.pf, 0) as pf,
                
                COALESCE(p2.ast, 0) as ast,
                COALESCE(p3.stl, 0) as stl,
                COALESCE(p4.blk, 0) as blk
                
            FROM pbp_stats p1
            FULL OUTER JOIN assists_stats p2 ON p1.game_id = p2.game_id AND p1.player_id = p2.player_id
            FULL OUTER JOIN steals_stats p3 ON (COALESCE(p1.game_id, p2.game_id) = p3.game_id AND COALESCE(p1.player_id, p2.player_id) = p3.player_id)
            FULL OUTER JOIN blocks_stats p4 ON (COALESCE(p1.game_id, p2.game_id, p3.game_id) = p4.game_id AND COALESCE(p1.player_id, p2.player_id, p3.player_id) = p4.player_id)
        )
        
        SELECT 
            game_id, player_id, team_id,
            fgm, fga, fg3m, fg3a, ftm, fta,
            0 as orb,
            trb - 0 as drb,
            trb,
            ast, stl, blk, tov, pf,
            (fgm * 2) + fg3m + ftm as pts,
            0 as plus_minus
        FROM merged_stats
        WHERE team_id IS NOT NULL
          AND player_id IN (SELECT player_id FROM players)
    """
    
    try:
        con.execute(query)
        print("Box scores populated successfully.")
        count = con.execute("SELECT COUNT(*) FROM box_scores").fetchone()[0]
        print(f"Inserted {count} rows into box_scores.")
    except Exception as e:
        print(f"Error populating box scores: {e}")
    
    con.close()

if __name__ == "__main__":
    populate_boxscores()
