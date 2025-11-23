import os
from contextlib import suppress
from datetime import datetime
from typing import Any

import duckdb

BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
)
DB_PATH = os.path.join(BASE_DIR, "data", "nba.duckdb")


def load_players():
    print(f"Connecting to {DB_PATH}...")
    con = duckdb.connect(DB_PATH)

    print("Clearing existing players...")
    con.execute("DELETE FROM players")

    print("Extracting player data from player_directory...")
    query = """
        SELECT
            slug,
            player,
            birth_date,
            ht_in_in,
            wt,
            colleges,
            pos,
            _from,
            _to
        FROM player_directory
    """

    directory_data = con.execute(query).fetchall()
    print(f"Found {len(directory_data)} players in directory.")

    insert_sql = """
        INSERT INTO players (
            player_id,
            full_name,
            first_name,
            last_name,
            birth_date,
            height_inches,
            weight_lbs,
            position,
            college,
            nba_debut,
            experience_years,
            is_active,
            headshot_url,
            created_at,
            updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    """

    batch_data: list[Any] = []

    print("Processing players...")
    for row in directory_data:
        slug, full_name, bdate, ht, wt, colleges, pos, y_from, y_to = row

        slug = str(slug)

        # Name split
        parts = full_name.split(" ", 1)
        fname = parts[0]
        lname = parts[1] if len(parts) > 1 else ""

        # Height/Weight
        height_in = int(ht) if ht else None
        weight_lbs = int(wt) if wt else None

        # Debut
        nba_debut = None
        if y_from:
            with suppress(ValueError):
                nba_debut = datetime(int(y_from), 10, 1)

        # Exp
        exp = (int(y_to) - int(y_from) + 1) if (y_to and y_from) else None

        # Is Active?
        is_active = y_to == 2025

        headshot_url = None

        batch_data.append(
            (
                slug,
                full_name,
                fname,
                lname,
                bdate,
                height_in,
                weight_lbs,
                pos,
                colleges,
                nba_debut,
                exp,
                is_active,
                headshot_url,
            )
        )

    print(f"Inserting {len(batch_data)} players...")
    try:
        con.executemany(insert_sql, batch_data)
        print("Success.")
    except Exception as e:
        print(f"Error inserting batch: {e}")

    con.close()


if __name__ == "__main__":
    load_players()
