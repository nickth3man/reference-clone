# pylint: disable=duplicate-code
import duckdb

from app.database import DB_PATH


def test_connection() -> None:
    # pylint: disable=duplicate-code
    try:
        # Query to list tables in DuckDB
        conn = duckdb.connect(DB_PATH, read_only=False)
        tables = conn.execute("SHOW TABLES").fetchall()
        print("Connection successful (Read/Write)!")
        print("Tables found:", tables)
        conn.close()
    except Exception as e:  # pylint: disable=broad-exception-caught
        print(f"Read/Write connection failed: {e}")
        try:
            print("Attempting Read-Only connection...")
            conn = duckdb.connect(DB_PATH, read_only=True)
            tables = conn.execute("SHOW TABLES").fetchall()
            print("Connection successful (Read-Only)!")
            print("Tables found:", tables)
            conn.close()
        except Exception as e2:  # pylint: disable=broad-exception-caught
            print(f"Read-Only connection failed: {e2}")


if __name__ == "__main__":
    test_connection()
