import os

import duckdb

# Define paths
BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
)
DB_PATH = os.path.join(BASE_DIR, "data", "nba.duckdb")
SCHEMA_PATH = os.path.join(BASE_DIR, "backend", "db", "schema.sql")


def migrate():
    print(f"Connecting to database at {DB_PATH}...")
    con = duckdb.connect(DB_PATH)

    print(f"Reading schema from {SCHEMA_PATH}...")
    with open(SCHEMA_PATH) as f:
        schema_sql = f.read()

    # DuckDB doesn't support ENUM syntax exactly like Postgres in CREATE TABLE sometimes without headers?
    # But the schema uses VARCHAR(10) -- ENUM(...) which is just a comment.
    # So it should be fine as standard SQL.

    print("Executing schema migration...")
    try:
        # Execute the schema
        # We might need to drop existing tables first if we want a clean slate
        # But verify what existing tables are first

        # List existing tables
        tables = con.execute("SHOW TABLES").fetchall()
        if tables:
            print("Existing tables found:", [t[0] for t in tables])
            # For this task, we likely want to overwrite/recreate core tables.
            # To be safe and follow 'Initial Implementation', let's drop tables if they exist
            # based on the creation order in schema.sql (reverse order for drops due to FKs)

            # List of tables in reverse dependency order
            tables_to_drop = [
                "coach_seasons",
                "coaches",
                "playoff_series",
                "hall_of_fame",
                "all_nba_teams",
                "awards",
                "team_payrolls",
                "player_contracts",
                "draft_picks",
                "player_splits",
                "team_season_stats",
                "team_game_stats",
                "box_scores",
                "games",
                "player_play_by_play_stats",
                "player_shooting_stats",
                "player_advanced_stats",
                "player_season_stats",
                "seasons",
                "franchises",
                "teams",
                "players",
            ]

            for table in tables_to_drop:
                print(f"Dropping table {table} if exists...")
                con.execute(f"DROP TABLE IF EXISTS {table} CASCADE")

            # Sequences also need to be dropped/reset
            sequences = [
                "seq_player_season_stats_id",
                "seq_player_advanced_stats_id",
                "seq_player_shooting_stats_id",
                "seq_player_play_by_play_stats_id",
                "seq_box_scores_id",
                "seq_team_game_stats_id",
                "seq_team_season_stats_id",
                "seq_player_splits_id",
                "seq_draft_picks_id",
                "seq_player_contracts_id",
                "seq_team_payrolls_id",
                "seq_awards_id",
                "seq_all_nba_teams_id",
                "seq_hall_of_fame_id",
                "seq_playoff_series_id",
                "seq_coach_seasons_id",
            ]
            for seq in sequences:
                con.execute(f"DROP SEQUENCE IF EXISTS {seq}")

        con.execute(schema_sql)
        print("Schema migration completed successfully.")

        # Verify tables
        new_tables = con.execute("SHOW TABLES").fetchall()
        print("New tables:", [t[0] for t in new_tables])

    except Exception as e:
        print(f"Error processing schema: {e}")
    finally:
        con.close()


if __name__ == "__main__":
    migrate()
