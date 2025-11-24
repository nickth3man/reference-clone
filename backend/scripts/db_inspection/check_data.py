import os
import sys

# Add backend to path to import app
sys.path.append(os.path.join(os.path.dirname(__file__), "../../"))

from app.database import execute_query


def check_data():
    tables = [
        "games",
        "team_game_stats",
        "players",
        "teams",
        "seasons",
        "player_season_stats",
        "box_scores",
        "franchises",
        "draft_picks",
        "player_contracts",
        "team_payrolls",
        "awards",
        "all_nba_teams",
        "hall_of_fame",
        "playoff_series",
        "coaches",
        "coach_seasons",
        "player_shooting_stats",
        "player_play_by_play_stats",
        "other_stats",
    ]

    print("Checking data counts...")
    for table in tables:
        try:
            result = execute_query(f"SELECT COUNT(*) FROM {table}")
            count = result[0][0]
            print(f"{table}: {count} rows")
        except Exception as e:
            print(f"{table}: ERROR - {e}")


if __name__ == "__main__":
    check_data()
