from typing import Any, cast

from app.database import execute_query_df
from app.models import Team


def reproduce() -> None:
    query = "SELECT * FROM team_details"
    try:
        df = execute_query_df(query, read_only=True)
        df = df.where(df.notnull(), None)
        records = cast(list[dict[str, Any]], df.to_dict(orient="records"))  # type: ignore

        print(f"Found {len(records)} records.")

        for i, record in enumerate(records):
            try:
                Team(**record)
            except Exception as e:  # pylint: disable=broad-exception-caught
                print(f"Error at record {i}: {record}")
                print(f"Error details: {e}")
                break
        else:
            print("All records validated successfully!")

    except Exception as e:  # pylint: disable=broad-exception-caught
        print(f"Global Error: {e}")


if __name__ == "__main__":
    reproduce()
