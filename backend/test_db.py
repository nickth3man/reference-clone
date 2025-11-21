from database import execute_query, DB_PATH
import duckdb

def test_connection():
    try:
        # Query to list tables in DuckDB
        conn = duckdb.connect(DB_PATH, read_only=False)
        tables = conn.execute("SHOW TABLES").fetchall()
        print("Connection successful (Read/Write)!")
        print("Tables found:", tables)
        conn.close()
    except Exception as e:
        print(f"Read/Write connection failed: {e}")
        try:
            print("Attempting Read-Only connection...")
            conn = duckdb.connect(DB_PATH, read_only=True)
            tables = conn.execute("SHOW TABLES").fetchall()
            print("Connection successful (Read-Only)!")
            print("Tables found:", tables)
            conn.close()
        except Exception as e2:
            print(f"Read-Only connection failed: {e2}")

if __name__ == "__main__":
    test_connection()
