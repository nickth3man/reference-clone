from app.core.database import execute_query_df


def check_teams() -> None:
    try:
        df = execute_query_df("SELECT * FROM team_details LIMIT 5", read_only=True)
        print(df[["team_id", "abbreviation", "nickname"]])
    except Exception as e:  # pylint: disable=broad-exception-caught
        print(f"Error: {e}")


if __name__ == "__main__":
    check_teams()
