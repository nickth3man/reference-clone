import os
import sys

# Add backend to path to import app
sys.path.append(os.path.join(os.path.dirname(__file__), "../../"))

from app.core.database import execute_query


def list_tables() -> None:
    print("Listing all tables in DB...")
    try:
        # DuckDB specific query to list tables
        tables = execute_query("SHOW TABLES")
        for t in tables:
            print(t[0])
    except Exception as e:
        print(f"ERROR: {e}")


if __name__ == "__main__":
    list_tables()
