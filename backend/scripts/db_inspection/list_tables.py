from app.core.database import get_db_connection


def list_tables() -> None:
    conn = get_db_connection(read_only=True)
    try:
        tables = conn.execute("SHOW TABLES").fetchall()
        print("All Tables:")
        for t in tables:
            print(t[0])
    except Exception as e:  # pylint: disable=broad-exception-caught
        print(f"Error: {e}")
    finally:
        conn.close()


if __name__ == "__main__":
    list_tables()
