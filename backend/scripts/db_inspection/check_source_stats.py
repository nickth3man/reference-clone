import os

import duckdb

BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
)
DB_PATH = os.path.join(BASE_DIR, "data", "nba.duckdb")


def check_stats():
    print(f"Connecting to {DB_PATH}...")
    con = duckdb.connect(DB_PATH)

    tables_to_check = [
        "player_stats_totals",
        "player_stats_per_game",
        "player_stats_per_36",
        "player_stats_per_100_poss",
    ]

    existing_tables = [t[0] for t in con.execute("SHOW TABLES").fetchall()]

    for table in tables_to_check:
        if table in existing_tables:
            print(f"\n--- Columns in '{table}' ---")
            cols = con.execute(f"DESCRIBE {table}").fetchall()
            # Print first 5 columns and any ID columns to save space, usually they are standard
            # But let's print all to be sure about keys
            for col in cols:
                print(col)

            print(f"--- Sample data from '{table}' ---")
            sample = con.execute(f"SELECT * FROM {table} LIMIT 1").fetchall()
            print(sample)
        else:
            print(f"\nTable '{table}' does not exist.")

    con.close()


if __name__ == "__main__":
    check_stats()
