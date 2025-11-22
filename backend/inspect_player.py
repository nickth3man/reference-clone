from database import get_db_connection


def inspect_player_schema() -> None:
    conn = get_db_connection(read_only=True)
    try:
        print("Schema for 'player':")
        schema = conn.execute("DESCRIBE player").fetchall()
        for col in schema:
            print(f"  {col[0]} ({col[1]})")

        print("\nSchema for 'common_player_info':")
        schema = conn.execute("DESCRIBE common_player_info").fetchall()
        for col in schema:
            print(f"  {col[0]} ({col[1]})")

    except Exception as e:  # pylint: disable=broad-exception-caught
        print(f"Error: {e}")
    finally:
        conn.close()


if __name__ == "__main__":
    inspect_player_schema()
