from database import get_db_connection


def inspect_game_stats_schema() -> None:
    conn = get_db_connection(read_only=True)
    try:
        print("Schema for 'game':")
        schema = conn.execute("DESCRIBE game").fetchall()
        for col in schema:
            print(f"  {col[0]} ({col[1]})")

        print("\nSchema for 'player_stats_per_game':")
        schema = conn.execute("DESCRIBE player_stats_per_game").fetchall()
        for col in schema:
            print(f"  {col[0]} ({col[1]})")

    except Exception as e:  # pylint: disable=broad-exception-caught
        print(f"Error: {e}")
    finally:
        conn.close()


if __name__ == "__main__":
    inspect_game_stats_schema()
