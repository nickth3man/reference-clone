import os

import duckdb

BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
)
DB_PATH = os.path.join(BASE_DIR, "data", "nba.duckdb")


def check_teams() -> None:
    print(f"Connecting to {DB_PATH}...")
    con = duckdb.connect(DB_PATH)

    print("\n--- Columns in 'team' table ---")
    cols = con.execute("DESCRIBE team").fetchall()
    for col in cols:
        print(col)

    print("\n--- Sample data from 'team' table ---")
    sample = con.execute("SELECT * FROM team LIMIT 3").fetchall()
    for row in sample:
        print(row)

    print("\n--- Columns in 'team_details' table ---")
    # Check if team_details exists
    tables = [t[0] for t in con.execute("SHOW TABLES").fetchall()]
    if "team_details" in tables:
        cols = con.execute("DESCRIBE team_details").fetchall()
        for col in cols:
            print(col)

        print("\n--- Sample data from 'team_details' table ---")
        sample = con.execute("SELECT * FROM team_details LIMIT 3").fetchall()
        for row in sample:
            print(row)
    else:
        print("Table 'team_details' does not exist.")

    con.close()


if __name__ == "__main__":
    check_teams()
