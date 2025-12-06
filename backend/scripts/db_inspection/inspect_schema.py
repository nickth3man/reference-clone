import pandas as pd

from app.core.database import get_db_connection


def inspect_schema() -> None:
    conn = get_db_connection(read_only=True)
    try:
        print("Data from other_stats (first 5 rows):")
        df: pd.DataFrame = conn.execute("SELECT * FROM other_stats LIMIT 5").df()
        print(df)
    finally:
        conn.close()


if __name__ == "__main__":
    inspect_schema()
