import os
import duckdb

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
DB_PATH = os.path.join(BASE_DIR, "data", "nba.duckdb")

def update_games_linescore():
    print(f"Connecting to {DB_PATH}...")
    con = duckdb.connect(DB_PATH)

    print("Updating games with line scores...")
    
    # DuckDB supports UPDATE FROM syntax
    query = """
        UPDATE games
        SET
            home_q1 = TRY_CAST(ls.pts_qtr1_home AS INTEGER),
            home_q2 = TRY_CAST(ls.pts_qtr2_home AS INTEGER),
            home_q3 = TRY_CAST(ls.pts_qtr3_home AS INTEGER),
            home_q4 = TRY_CAST(ls.pts_qtr4_home AS INTEGER),
            home_ot1 = TRY_CAST(ls.pts_ot1_home AS INTEGER),
            home_ot2 = TRY_CAST(ls.pts_ot2_home AS INTEGER),
            home_ot3 = TRY_CAST(ls.pts_ot3_home AS INTEGER),
            home_ot4 = TRY_CAST(ls.pts_ot4_home AS INTEGER),
            
            away_q1 = TRY_CAST(ls.pts_qtr1_away AS INTEGER),
            away_q2 = TRY_CAST(ls.pts_qtr2_away AS INTEGER),
            away_q3 = TRY_CAST(ls.pts_qtr3_away AS INTEGER),
            away_q4 = TRY_CAST(ls.pts_qtr4_away AS INTEGER),
            away_ot1 = TRY_CAST(ls.pts_ot1_away AS INTEGER),
            away_ot2 = TRY_CAST(ls.pts_ot2_away AS INTEGER),
            away_ot3 = TRY_CAST(ls.pts_ot3_away AS INTEGER),
            away_ot4 = TRY_CAST(ls.pts_ot4_away AS INTEGER)
        FROM line_score ls
        WHERE games.game_id = ls.game_id
    """
    
    con.execute(query)
    print("Games updated with line scores.")
    con.close()

if __name__ == "__main__":
    update_games_linescore()

