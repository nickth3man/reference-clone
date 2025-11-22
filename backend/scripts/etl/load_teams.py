import duckdb
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
DB_PATH = os.path.join(BASE_DIR, "data", "nba.duckdb")

# Hardcoded mapping for Conference and Division (Active NBA teams)
TEAM_CONF_DIV = {
    'ATL': {'conf': 'Eastern', 'div': 'Southeast'},
    'BOS': {'conf': 'Eastern', 'div': 'Atlantic'},
    'BKN': {'conf': 'Eastern', 'div': 'Atlantic'},
    'CHA': {'conf': 'Eastern', 'div': 'Southeast'},
    'CHI': {'conf': 'Eastern', 'div': 'Central'},
    'CLE': {'conf': 'Eastern', 'div': 'Central'},
    'DAL': {'conf': 'Western', 'div': 'Southwest'},
    'DEN': {'conf': 'Western', 'div': 'Northwest'},
    'DET': {'conf': 'Eastern', 'div': 'Central'},
    'GSW': {'conf': 'Western', 'div': 'Pacific'},
    'HOU': {'conf': 'Western', 'div': 'Southwest'},
    'IND': {'conf': 'Eastern', 'div': 'Central'},
    'LAC': {'conf': 'Western', 'div': 'Pacific'},
    'LAL': {'conf': 'Western', 'div': 'Pacific'},
    'MEM': {'conf': 'Western', 'div': 'Southwest'},
    'MIA': {'conf': 'Eastern', 'div': 'Southeast'},
    'MIL': {'conf': 'Eastern', 'div': 'Central'},
    'MIN': {'conf': 'Western', 'div': 'Northwest'},
    'NOP': {'conf': 'Western', 'div': 'Southwest'},
    'NYK': {'conf': 'Eastern', 'div': 'Atlantic'},
    'OKC': {'conf': 'Western', 'div': 'Northwest'},
    'ORL': {'conf': 'Eastern', 'div': 'Southeast'},
    'PHI': {'conf': 'Eastern', 'div': 'Atlantic'},
    'PHX': {'conf': 'Western', 'div': 'Pacific'},
    'POR': {'conf': 'Western', 'div': 'Northwest'},
    'SAC': {'conf': 'Western', 'div': 'Pacific'},
    'SAS': {'conf': 'Western', 'div': 'Southwest'},
    'TOR': {'conf': 'Eastern', 'div': 'Atlantic'},
    'UTA': {'conf': 'Western', 'div': 'Northwest'},
    'WAS': {'conf': 'Eastern', 'div': 'Southeast'},
}

def load_teams():
    print(f"Connecting to {DB_PATH}...")
    con = duckdb.connect(DB_PATH)
    
    print("Extracting team data...")
    # Join 'team' and 'team_details'
    # Note: team_details might not have all teams or might have different keys. 
    # We use LEFT JOIN on team.id = team_details.team_id to be safe.
    query = """
        SELECT 
            t.id, 
            t.full_name, 
            t.abbreviation, 
            t.nickname, 
            t.city, 
            t.state, 
            t.year_founded,
            td.arena,
            td.arenacapacity
        FROM team t
        LEFT JOIN team_details td ON t.id = td.team_id
    """
    
    teams_data = con.execute(query).fetchall()
    print(f"Found {len(teams_data)} teams.")

    print("Transforming and loading data into 'teams' and 'franchises'...")
    
    # Prepare statements
    insert_team = """
        INSERT INTO teams (
            team_id, franchise_id, full_name, abbreviation, nickname, city, state, 
            arena, arena_capacity, founded_year, league, conference, division, 
            logo_url, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """
    
    insert_franchise = """
        INSERT INTO franchises (
            franchise_id, current_team_id, original_name, founded_year, total_seasons
        ) VALUES (?, ?, ?, ?, ?)
    """

    processed_count = 0
    for row in teams_data:
        tid, full_name, abbr, nickname, city, state, year_founded, arena, capacity = row
        
        # Data Cleaning/Transformation
        tid = str(tid)
        year_founded = int(year_founded) if year_founded else None
        capacity = int(capacity) if capacity else None
        
        # Lookup Conf/Div
        conf = None
        div = None
        if abbr in TEAM_CONF_DIV:
            conf = TEAM_CONF_DIV[abbr]['conf']
            div = TEAM_CONF_DIV[abbr]['div']
        
        # Active Check (Assuming if in TEAM_CONF_DIV it's currently active, others might be historical or G-league if mixed)
        # But 'team' table generally contains current NBA teams if sourced from commonTeamYears or similar active list.
        # Let's assume is_active = True for now if it's in our list or generic.
        is_active = True 
        
        logo_url = f"https://cdn.nba.com/logos/nba/{tid}/global/L/logo.svg"
        
        # Insert Franchises (One-to-one for now)
        try:
            # Verify if franchise exists to avoid dupes if re-running (though primary key constraint will hit)
            # Since we recreated tables, empty.
            con.execute(insert_franchise, (tid, tid, full_name, year_founded, 0))
            
            # Insert Teams
            con.execute(insert_team, (
                tid, tid, full_name, abbr, nickname, city, state,
                arena, capacity, year_founded, 'NBA', conf, div,
                logo_url, is_active
            ))
            processed_count += 1
        except Exception as e:
            print(f"Error inserting team {abbr} ({tid}): {e}")
            
    print(f"Successfully loaded {processed_count} teams and franchises.")
    con.close()

if __name__ == "__main__":
    load_teams()
