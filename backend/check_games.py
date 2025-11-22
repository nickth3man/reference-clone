from database import execute_query_df


def check_games():
    try:
        # Check total count vs unique game_ids
        count = execute_query_df(
            "SELECT COUNT(*) as total FROM game", read_only=True
        ).iloc[0]["total"]
        unique = execute_query_df(
            "SELECT COUNT(DISTINCT game_id) as unique_ids FROM game", read_only=True
        ).iloc[0]["unique_ids"]

        print(f"Total rows: {count}")
        print(f"Unique game_ids: {unique}")

        if count == unique:
            print("game_id is unique (one row per game).")
        else:
            print("game_id is NOT unique (multiple rows per game?).")

        # Show a sample
        print("\nSample game:")
        print(
            execute_query_df(
                "SELECT game_id, game_date, team_name_home, team_name_away FROM game LIMIT 1",
                read_only=True,
            )
        )

    except Exception as e:  # pylint: disable=broad-exception-caught
        print(f"Error: {e}")


if __name__ == "__main__":
    check_games()
