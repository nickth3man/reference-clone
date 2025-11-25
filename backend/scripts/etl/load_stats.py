import os
from typing import Any

import duckdb

BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
)
DB_PATH = os.path.join(BASE_DIR, "data", "nba.duckdb")

# Manual Mapping for Stats Abbreviations to Team IDs
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
}


def load_stats() -> None:
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

    # 3. Load Basic Season Stats (Existing Logic)
    print("Extracting basic stats data...")

    query = """
        SELECT
            t.player, -- Use Name to lookup ID
            t.season,
            t.tm,
            t.age,
            t.g, t.gs, t.mp,
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
    print(f"Extracted {len(all_stats)} basic stats rows.")

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

    batch_data: list[Any] = []
    batch_size = 5000

    # Clear existing data to avoid duplicates during reload
    con.execute("DELETE FROM player_season_stats")
    # player_advanced_stats deletion moved to try/except block below to prevent data loss on error

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

        if not pname:
            continue

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
        team_id = team_map.get(abbr)
        if not team_id:
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
            ),
        )

        if len(batch_data) >= batch_size:
            con.executemany(insert_sql, batch_data)
            processed += len(batch_data)
            batch_data = []
            print(f"Loaded {processed} basic stats rows...")

    if batch_data:
        con.executemany(insert_sql, batch_data)
        processed += len(batch_data)

    print(f"Basic Stats load completed. Processed {processed} rows.")

    # 4. Load Advanced Stats
    print("Extracting advanced stats data...")

    # We'll use player_stats_advanced table from DuckDB which typically matches basketball-reference advanced table
    # Columns in DuckDB player_stats_advanced:
    # player_id, season, tm, player, age, g, mp, per, ts_percent, x3p_ar, ftr, orb_percent, drb_percent, trb_percent,
    # ast_percent, stl_percent, blk_percent, tov_percent, usg_percent, ows, dws, ws, ws_48, obpm, dbpm, bpm, vorp

    # Corrected ftr column name based on schema (f_tr)
    adv_query = """
        SELECT
            player,
            season,
            tm,
            per,
            ts_percent,
            x3p_ar,
            f_tr,
            orb_percent,
            drb_percent,
            trb_percent,
            ast_percent,
            stl_percent,
            blk_percent,
            tov_percent,
            usg_percent,
            ows,
            dws,
            ws,
            ws_48,
            obpm,
            dbpm,
            bpm,
            vorp
        FROM player_stats_advanced
    """

    try:
        print("Executing advanced stats query...")
        all_adv_stats = con.execute(adv_query).fetchall()
        print(f"Extracted {len(all_adv_stats)} advanced stats rows.")

        # Clear existing data now that we have successfully extracted new data
        con.execute("DELETE FROM player_advanced_stats")

        insert_adv_sql = """
            INSERT INTO player_advanced_stats (
                player_id, season_id, team_id, season_type,
                player_efficiency_rating, true_shooting_pct, three_point_attempt_rate, free_throw_rate,
                offensive_rebound_pct, defensive_rebound_pct, total_rebound_pct,
                assist_pct, steal_pct, block_pct, turnover_pct, usage_pct,
                offensive_win_shares, defensive_win_shares, win_shares, win_shares_per_48,
                offensive_box_plus_minus, defensive_box_plus_minus, box_plus_minus, value_over_replacement
            ) VALUES (?, ?, ?, 'Regular', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """

        adv_batch_data: list[Any] = []
        adv_processed = 0

        for row in all_adv_stats:
            (
                pname,
                season,
                abbr,
                per,
                ts_pct,
                x3p_ar,
                ftr,
                orb_pct,
                drb_pct,
                trb_pct,
                ast_pct,
                stl_pct,
                blk_pct,
                tov_pct,
                usg_pct,
                ows,
                dws,
                ws,
                ws48,
                obpm,
                dbpm,
                bpm,
                vorp,
            ) = row

            if not pname:
                continue

            pname_clean = pname.replace("*", "")
            candidates = player_map.get(pname_clean)
            if not candidates:
                continue
            pid = candidates[0]  # Use first match for now

            season_id = str(season)
            team_id = team_map.get(abbr)
            if not team_id:
                continue

            # Handle potential -100000.0 values for DECIMAL(5,2) columns (percentages)
            # PER, USG%, AST%, etc. fit in (5,2) which is -999.99 to 999.99
            # Outliers or errors like -100000.0 cause overflow
            # Clean data before inserting

            def clean_decimal(val: Any, max_val: float = 999.99, min_val: float = -999.99) -> float | None:
                if val is None:
                    return None
                try:
                    f_val = float(val)
                    if f_val > max_val:
                        return max_val
                    if f_val < min_val:
                        return min_val
                    return f_val
                except Exception:
                    return None

            per = clean_decimal(per)
            orb_pct = clean_decimal(orb_pct)
            drb_pct = clean_decimal(drb_pct)
            trb_pct = clean_decimal(trb_pct)
            ast_pct = clean_decimal(ast_pct)
            stl_pct = clean_decimal(stl_pct)
            blk_pct = clean_decimal(blk_pct)
            tov_pct = clean_decimal(tov_pct)
            usg_pct = clean_decimal(usg_pct)

            # DECIMAL(5,3) fields: max 99.999
            ts_pct = clean_decimal(ts_pct, 99.999, -99.999)
            x3p_ar = clean_decimal(x3p_ar, 99.999, -99.999)
            ftr = clean_decimal(ftr, 99.999, -99.999)
            ws48 = clean_decimal(ws48, 99.999, -99.999)

            # DECIMAL(6,2) fields: max 9999.99
            ows = clean_decimal(ows, 9999.99, -9999.99)
            dws = clean_decimal(dws, 9999.99, -9999.99)
            ws = clean_decimal(ws, 9999.99, -9999.99)
            vorp = clean_decimal(vorp, 9999.99, -9999.99)

            # BPM is DECIMAL(5,2)
            obpm = clean_decimal(obpm)
            dbpm = clean_decimal(dbpm)
            bpm = clean_decimal(bpm)

            adv_batch_data.append(
                (
                    pid,
                    season_id,
                    team_id,
                    per,
                    ts_pct,
                    x3p_ar,
                    ftr,
                    orb_pct,
                    drb_pct,
                    trb_pct,
                    ast_pct,
                    stl_pct,
                    blk_pct,
                    tov_pct,
                    usg_pct,
                    ows,
                    dws,
                    ws,
                    ws48,
                    obpm,
                    dbpm,
                    bpm,
                    vorp,
                ),
            )

            if len(adv_batch_data) >= batch_size:
                con.executemany(insert_adv_sql, adv_batch_data)
                adv_processed += len(adv_batch_data)
                adv_batch_data = []
                print(f"Loaded {adv_processed} advanced stats rows...")

        if adv_batch_data:
            con.executemany(insert_adv_sql, adv_batch_data)
            adv_processed += len(adv_batch_data)

        print(f"Advanced Stats load completed. Processed {adv_processed} rows.")

    except Exception as e:
        print(f"Error loading advanced stats: {e}")
        print("Skipping advanced stats load.")

    con.close()


if __name__ == "__main__":
    load_stats()
