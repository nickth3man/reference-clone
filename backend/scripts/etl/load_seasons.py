import os

import duckdb

BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
)
DB_PATH = os.path.join(BASE_DIR, "data", "nba.duckdb")


def load_seasons() -> None:
    print(f"Connecting to {DB_PATH}...")
    con = duckdb.connect(DB_PATH)

    print("Extracting distinct seasons from player stats...")
    # We can check player_stats_totals
    try:
        # Check if table exists
        con.execute("SELECT 1 FROM player_stats_totals LIMIT 1")
        query = "SELECT DISTINCT season FROM player_stats_totals ORDER BY season"
        seasons = con.execute(query).fetchall()
    except duckdb.Error:
        print("player_stats_totals does not exist or empty. Using default range.")
        seasons = [(y,) for y in range(1947, 2026)]

    print(f"Found {len(seasons)} seasons.")

    insert_sql = """
        INSERT INTO seasons (
            season_id, league, start_year, end_year
        ) VALUES (?, 'NBA', ?, ?)
    """

    # We need to handle duplicates if re-running.
    # But we migrated schema (recreated tables), so it should be empty.
    # Just in case, we can use INSERT OR IGNORE or similar if DuckDB supports, or try/except.

    count = 0
    for row in seasons:
        year = int(row[0])
        season_id = str(year)
        start_year = year - 1
        end_year = year

        try:
            con.execute(insert_sql, (season_id, start_year, end_year))
            count += 1
        except Exception as e:
            print(f"Error inserting season {season_id}: {e}")

    print(f"Loaded {count} seasons.")
    con.close()


if __name__ == "__main__":
    load_seasons()
