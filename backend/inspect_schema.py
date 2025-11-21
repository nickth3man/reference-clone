from database import get_db_connection

def inspect_schema():
    conn = get_db_connection(read_only=True)
    try:
        print("Data from other_stats (first 5 rows):")
        df = conn.execute("SELECT * FROM other_stats LIMIT 5").df()
        print(df.to_string())
    finally:
        conn.close()

if __name__ == "__main__":
    inspect_schema()
