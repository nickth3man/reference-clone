import sys
import os
import traceback
# Add backend directory to path to allow imports from app
backend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../'))
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

from app.database import execute_query_df  # noqa: E402

def test_leaders_query() -> None:
    output_file = os.path.join(os.path.dirname(__file__), "reproduce_output.txt")

    # Redirect stdout and stderr
    original_stdout = sys.stdout
    original_stderr = sys.stderr

    with open(output_file, "w", encoding="utf-8") as f:
        sys.stdout = f
        sys.stderr = f

        try:
            print("Starting test_leaders_query...")
            season_id = "2023-24"

            # query to get a valid season_id
            try:
                seasons_df = execute_query_df("SELECT season_id FROM seasons ORDER BY end_year DESC LIMIT 1")
                if not seasons_df.empty:
                    season_id = seasons_df.iloc[0]['season_id']
                    print(f"Testing with season_id: {season_id}")
                else:
                    print("No seasons found in DB. Cannot test.")
                    return
            except Exception as e:
                print(f"Error fetching seasons: {e}")
                traceback.print_exc()
                return

            categories = {
                "pts": ("player_season_stats", "points_per_game"),
                "trb": ("player_season_stats", "rebounds_per_game"),
                "ast": ("player_season_stats", "assists_per_game"),
                "ws": ("player_advanced_stats", "win_shares"),
                "per": ("player_advanced_stats", "player_efficiency_rating"),
            }

            for key, (table, col) in categories.items():
                print(f"\n--- Testing category: {key} ---")
                print(f"Table: {table}, Column: {col}")

                # Whitelist validation to prevent SQL injection: only allow expected tables and columns.
                allowed_tables = {"player_season_stats", "player_advanced_stats"}
                allowed_columns = {
                    "points_per_game",
                    "rebounds_per_game",
                    "assists_per_game",
                    "win_shares",
                    "player_efficiency_rating",
                }
                if table not in allowed_tables or col not in allowed_columns:
                    print(f"Invalid table ({table}) or column ({col}); skipping.")
                    continue

                # Build query using validated table/column names and keep season_id as a parameter.
                query = f"""
                    SELECT p.player_id, p.full_name, p.headshot_url, s.{col} as value, s.team_id
                    FROM {table} s
                    JOIN players p ON s.player_id = p.player_id
                    WHERE s.season_id = ?
                    ORDER BY s.{col} DESC
                    LIMIT 5
                """  # noqa: S608 - table and col are validated against a whitelist above
                print(f"Query:\n{query}\nParameters: [season_id]")

                try:
                    df = execute_query_df(query, [season_id])
                    print(f"Success for {key}. Rows: {len(df)}")
                    if not df.empty:
                        print(df.to_string())  # type: ignore
                except Exception as e:
                    print(f"FAILED for {key}: {e}")
                    traceback.print_exc()
        finally:
            sys.stdout = original_stdout
            sys.stderr = original_stderr

if __name__ == "__main__":
    test_leaders_query()
