import os

import duckdb

BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
)
DB_PATH = os.path.join(BASE_DIR, "data", "nba.duckdb")

ABBR_MAP = {
    "BRK": "BKN",
    "PHO": "PHX",
    "CHO": "CHA",
    "CHH": "CHA",
    "NOH": "NOP",
    "NOK": "NOP",
    "NJN": "BKN",
    "SEA": "OKC",
    "VAN": "MEM",
    "WSB": "WAS",
    "KCK": "SAC",
    "SDC": "LAC",
}


def load_team_stats() -> None:
    print(f"Connecting to {DB_PATH}...")
    con = duckdb.connect(DB_PATH)

    # Build Team Map
    print("Building Team Map...")
    teams = con.execute("SELECT team_id, abbreviation FROM teams").fetchall()
    team_map = {t[1]: t[0] for t in teams}
    for stats_abbr, db_abbr in ABBR_MAP.items():
        if db_abbr in team_map:
            team_map[stats_abbr] = team_map[db_abbr]

    print("Extracting team stats...")
    # Join summaries, per_game, and opp_per_game
    # We filter for non-playoff (Regular season) entries in team_summaries if needed,
    # usually team_summaries has playoffs=FALSE for regular season totals.
    query = """
        SELECT
            s.season,
            s.abbreviation,
            s.w,
            s.l,
            s.srs,
            s.pace,
            s.o_rtg,
            s.d_rtg,
            s.n_rtg,
            pg.pts_per_game,
            opp.opp_pts_per_game as opp_pts_per_game
        FROM team_summaries s
        LEFT JOIN team_stats_per_game pg ON s.season = pg.season AND s.abbreviation = pg.abbreviation
        LEFT JOIN opp_team_stats_per_game opp ON s.season = opp.season AND s.abbreviation = opp.abbreviation
        WHERE s.playoffs = FALSE
    """

    rows = con.execute(query).fetchall()
    print(f"Extracted {len(rows)} team stats rows.")

    insert_sql = """
        INSERT INTO team_season_stats (
            team_id, season_id, season_type,
            wins, losses, win_pct,
            simple_rating_system, pace,
            offensive_rating, defensive_rating, net_rating,
            points_per_game, opponent_points_per_game,
            games_behind, conference_rank, division_rank, playoff_seed
        ) VALUES (?, ?, 'Regular', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, 0)
    """

    batch_data = []

    # Clear existing data
    print("Clearing existing team_season_stats...")
    con.execute("DELETE FROM team_season_stats")

    for row in rows:
        (season, abbr, w, losses, srs, pace, ortg, drtg, nrtg, ppg, opp_ppg) = row

        if not abbr:
            continue

        team_id = team_map.get(abbr)
        if not team_id:
            # Try cleaning abbreviation or mapping
            # Some abbreviations might mismatch (e.g. NOP vs NOK)
            continue

        # Handle None values
        w = w or 0
        losses = losses or 0

        season_id = str(season)
        win_pct = w / (w + losses) if (w + losses) > 0 else 0.0

        batch_data.append(
            (team_id, season_id, w, losses, win_pct, srs, pace, ortg, drtg, nrtg, ppg, opp_ppg)
        )

    if batch_data:
        con.executemany(insert_sql, batch_data)

    print(f"Loaded {len(batch_data)} team stats.")
    con.close()


if __name__ == "__main__":
    load_team_stats()
