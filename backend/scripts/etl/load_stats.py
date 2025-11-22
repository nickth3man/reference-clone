import os

import duckdb

BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
)
DB_PATH = os.path.join(BASE_DIR, "data", "nba.duckdb")

# Manual Mapping for Stats Abbreviations to Team IDs
# We need to map abbreviations found in stats (e.g. BRK) to the abbreviations in our 'teams' table (e.g. BKN) -> then to ID
# OR map directly to IDs if we know them.
# Since we don't know IDs easily without querying, we will query the DB for the 'teams' table first.

# Common Stats Abbr -> Standard/Teams Table Abbr
ABBR_MAP = {
    "BRK": "BKN",
    "PHO": "PHX",
    "CHO": "CHA",
    "CHH": "CHA",
    "NOH": "NOP",
    "NOK": "NOP",
    "NJN": "BKN",  # History
    "SEA": "OKC",  # History
    "VAN": "MEM",  # History
    "WSB": "WAS",  # Washington Bullets
    "KCK": "SAC",  # Kansas City Kings
    "SDC": "LAC",  # San Diego Clippers
    # Add more as discovered
}


def load_stats():
    print(f"Connecting to {DB_PATH}...")
    con = duckdb.connect(DB_PATH)

    # 1. Build Team Map (Abbr -> ID)
    print("Building Team Map...")
    teams = con.execute("SELECT team_id, abbreviation FROM teams").fetchall()

    # Primary map from DB
    team_map = {t[1]: t[0] for t in teams}

    # Add manual mappings
    for stats_abbr, db_abbr in ABBR_MAP.items():
        if db_abbr in team_map:
            team_map[stats_abbr] = team_map[db_abbr]

    if "TOT" not in team_map:
        print("Adding TOT team placeholder...")
        try:
            con.execute("""
                INSERT INTO teams (team_id, full_name, abbreviation, nickname, city, is_active)
                VALUES ('TOT', 'Total', 'TOT', 'Total', 'N/A', FALSE)
            """)
            team_map["TOT"] = "TOT"
        except Exception as e:
            print(f"Could not add TOT team: {e}")

    # 2. Build Player Map (Name -> ID)
    print("Building Player Map...")
    players = con.execute("SELECT full_name, player_id FROM players").fetchall()
    player_map: dict[str, list[str]] = {}
    for name, pid in players:
        if name not in player_map:
            player_map[name] = []
        player_map[name].append(pid)

    print(f"Mapped {len(player_map)} unique player names.")
    # 3. Load Stats
    print("Extracting stats data...")

    query = """
        SELECT
            t.player, -- Use Name to lookup ID
            t.season,
            t.tm,
            t.age,
            t.g, t.gs, t.mp
            pg.mp_per_game,
            t.fg, t.fga, t.fg_percent,
            t.x3p, t.x3pa, t.x3p_percent,
            t.x2p, t.x2pa, t.x2p_percent,
            t.e_fg_percent,
            t.ft, t.fta, t.ft_percent,
            t.pts, pg.pts_per_game,
            t.orb, t.drb, t.trb, pg.trb_per_game,
            t.ast, pg.ast_per_game,
            t.tov, pg.tov_per_game,
            t.stl, pg.stl_per_game,
            t.blk, pg.blk_per_game,
            t.pf, pg.pf_per_game,
            p36.pts_per_36_min, p36.trb_per_36_min, p36.ast_per_36_min,
            p100.pts_per_100_poss, p100.trb_per_100_poss, p100.ast_per_100_poss
        FROM player_stats_totals t
        LEFT JOIN player_stats_per_game pg ON t.player_id = pg.player_id AND t.season = pg.season AND t.tm = pg.tm
        LEFT JOIN player_stats_per_36 p36 ON t.player_id = p36.player_id AND t.season = p36.season AND t.tm = p36.tm
        LEFT JOIN player_stats_per_100_poss p100 ON t.player_id = p100.player_id AND t.season = p100.season AND t.tm = p100.tm
    """

    print("Executing extraction query...")
    all_stats = con.execute(query).fetchall()
    print(f"Extracted {len(all_stats)} stats rows.")

    insert_sql = """
        INSERT INTO player_season_stats (
            player_id, season_id, team_id, league, season_type, age,
            games_played, games_started, minutes_played, minutes_per_game,
            field_goals_made, field_goals_attempted, field_goal_pct,
            three_pointers_made, three_pointers_attempted, three_point_pct,
            two_pointers_made, two_pointers_attempted, two_point_pct,
            effective_fg_pct,
            free_throws_made, free_throws_attempted, free_throw_pct,
            points, points_per_game,
            offensive_rebounds, defensive_rebounds, total_rebounds, rebounds_per_game,
            assists, assists_per_game,
            turnovers, turnovers_per_game,
            steals, steals_per_game,
            blocks, blocks_per_game,
            personal_fouls, personal_fouls_per_game,
            points_per_36, rebounds_per_36, assists_per_36,
            points_per_100_poss, rebounds_per_100_poss, assists_per_100_poss
        ) VALUES (?, ?, ?, 'NBA', 'Regular', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """

    processed = 0
    skipped_names = 0
    ambiguous_names = 0
    skipped_teams = 0

    batch_data = []
    batch_size = 5000

    for row in all_stats:
        (
            pname,
            season,
            abbr,
            age,
            g,
            gs,
            mp,
            mpg,
            fg,
            fga,
            fg_pct,
            x3p,
            x3pa,
            x3p_pct,
            x2p,
            x2pa,
            x2p_pct,
            efg,
            ft,
            fta,
            ft_pct,
            pts,
            ppg,
            orb,
            drb,
            trb,
            rpg,
            ast,
            apg,
            tov,
            tovpg,
            stl,
            stlpg,
            blk,
            blkpg,
            pf,
            pfpg,
            pts36,
            trb36,
            ast36,
            pts100,
            trb100,
            ast100,
        ) = row

        # Resolve Player ID
        if not pname:
            continue

        # Basic name cleaning if needed (e.g. remove *)
        pname_clean = pname.replace("*", "")

        candidates = player_map.get(pname_clean)
        if not candidates:
            skipped_names += 1
            continue

        if len(candidates) > 1:
            ambiguous_names += 1
            pid = candidates[0]
        else:
            pid = candidates[0]

        season_id = str(season)

        # Map Team
        team_id = team_map.get(abbr)
        if not team_id:
            # Check if it's an unknown historical team we missed
            # For now, skip
            skipped_teams += 1
            continue

        batch_data.append(
            (
                pid,
                season_id,
                team_id,
                age,
                g,
                gs,
                mp,
                mpg,
                fg,
                fga,
                fg_pct,
                x3p,
                x3pa,
                x3p_pct,
                x2p,
                x2pa,
                x2p_pct,
                efg,
                ft,
                fta,
                ft_pct,
                pts,
                ppg,
                orb,
                drb,
                trb,
                rpg,
                ast,
                apg,
                tov,
                tovpg,
                stl,
                stlpg,
                blk,
                blkpg,
                pf,
                pfpg,
                pts36,
                trb36,
                ast36,
                pts100,
                trb100,
                ast100,
            )
        )

        if len(batch_data) >= batch_size:
            con.executemany(insert_sql, batch_data)
            processed += len(batch_data)
            batch_data = []
            print(f"Loaded {processed} rows...")

    if batch_data:
        con.executemany(insert_sql, batch_data)
        processed += len(batch_data)

    print(f"Stats load completed. Processed {processed} rows.")
    print(
        f"Skipped Names: {skipped_names}, Ambiguous: {ambiguous_names}, Skipped Teams: {skipped_teams}"
    )

    con.close()


if __name__ == "__main__":
    load_stats()
