import os

import duckdb

BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
)
DB_PATH = os.path.join(BASE_DIR, "data", "nba.duckdb")


def check_players() -> None:
    print(f"Connecting to {DB_PATH}...")
    con = duckdb.connect(DB_PATH)

    print("\n--- Columns in 'common_player_info' table ---")
    # Check if common_player_info exists
    tables = [t[0] for t in con.execute("SHOW TABLES").fetchall()]
    if "common_player_info" in tables:
        cols = con.execute("DESCRIBE common_player_info").fetchall()
        for col in cols:
            print(col)

        print("\n--- Sample data from 'common_player_info' table ---")
        sample = con.execute("SELECT * FROM common_player_info LIMIT 3").fetchall()
        for row in sample:
            print(row)
    else:
        print("Table 'common_player_info' does not exist.")

    con.close()


if __name__ == "__main__":
    check_players()
