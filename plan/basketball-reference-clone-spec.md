# Basketball-Reference.com Clone Specification

## Complete Database Schema, Page Structure, and Site Architecture

---

## 1. SITE ARCHITECTURE OVERVIEW

### 1.1 Main Navigation Categories

```text
├── Players
│   ├── Player Index (A-Z)
│   ├── Active Players
│   ├── Birth Year Index
│   ├── College Index
│   ├── High School Index
│   └── International Players
├── Teams
│   ├── Active Franchises (30 teams)
│   ├── Defunct Franchises
│   └── Historical Team Index
├── Seasons
│   ├── League Season Pages (1946-present)
│   ├── Playoffs
│   └── All-Star Games
├── Leaders
│   ├── Career Leaders
│   ├── Season Leaders
│   ├── Active Leaders
│   ├── Progressive Leaders
│   └── Playoff Leaders
├── Scores/Box Scores
│   ├── Daily Scores
│   ├── Schedule
│   └── Box Score Archive
├── Draft
│   ├── Draft History Index
│   ├── Draft by Year
│   └── Draft Combine Stats
├── Awards
│   ├── MVP
│   ├── All-NBA Teams
│   ├── All-Defensive Teams
│   ├── Rookie of the Year
│   └── Hall of Fame
├── Contracts
│   ├── Salary Cap History
│   ├── Team Payrolls
│   └── Player Contracts
└── Standings
    ├── Current Standings
    └── Historical Standings
```

---

## 2. DATABASE SCHEMA

### 2.1 Core Entity Tables

#### `players`

```sql
CREATE TABLE players (
    player_id VARCHAR(20) PRIMARY KEY,  -- e.g., 'jamesle01'
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    full_name VARCHAR(200),
    birth_date DATE,
    birth_city VARCHAR(100),
    birth_state VARCHAR(100),
    birth_country VARCHAR(100),
    death_date DATE,
    height_inches INTEGER,
    weight_lbs INTEGER,
    shoots ENUM('Right', 'Left', 'Both'),
    position VARCHAR(100),  -- Can be multiple: 'SF, PF, PG'
    high_school VARCHAR(200),
    high_school_city VARCHAR(100),
    high_school_state VARCHAR(100),
    college VARCHAR(200),
    draft_year INTEGER,
    draft_round INTEGER,
    draft_pick INTEGER,
    draft_team_id VARCHAR(10),
    nba_debut DATE,
    experience_years INTEGER,
    is_active BOOLEAN,
    hof_year INTEGER,
    headshot_url VARCHAR(500),
    instagram VARCHAR(100),
    twitter VARCHAR(100),
    nicknames TEXT,  -- JSON array: ["King James", "LBJ", "Chosen One"]
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### `teams`

```sql
CREATE TABLE teams (
    team_id VARCHAR(10) PRIMARY KEY,  -- e.g., 'LAL'
    franchise_id VARCHAR(10),
    full_name VARCHAR(100),
    abbreviation VARCHAR(5),
    nickname VARCHAR(50),
    city VARCHAR(100),
    state VARCHAR(100),
    arena VARCHAR(200),
    arena_capacity INTEGER,
    founded_year INTEGER,
    folded_year INTEGER,  -- NULL if active
    league ENUM('NBA', 'ABA', 'BAA'),
    conference ENUM('Eastern', 'Western'),
    division VARCHAR(50),
    primary_color VARCHAR(7),  -- Hex color
    secondary_color VARCHAR(7),
    logo_url VARCHAR(500),
    is_active BOOLEAN,
    championships INTEGER DEFAULT 0
);
```

#### `franchises`

```sql
CREATE TABLE franchises (
    franchise_id VARCHAR(10) PRIMARY KEY,
    current_team_id VARCHAR(10),
    original_name VARCHAR(100),
    founded_year INTEGER,
    total_championships INTEGER,
    total_seasons INTEGER,
    total_wins INTEGER,
    total_losses INTEGER
);
```

#### `seasons`

```sql
CREATE TABLE seasons (
    season_id VARCHAR(10) PRIMARY KEY,  -- e.g., '2024-25'
    league ENUM('NBA', 'ABA', 'BAA'),
    start_year INTEGER,
    end_year INTEGER,
    champion_team_id VARCHAR(10),
    finals_mvp_player_id VARCHAR(20),
    mvp_player_id VARCHAR(20),
    roy_player_id VARCHAR(20),
    dpoy_player_id VARCHAR(20),
    sixth_man_player_id VARCHAR(20),
    mip_player_id VARCHAR(20),
    coy_coach_id VARCHAR(20),
    salary_cap DECIMAL(15,2),
    luxury_tax_threshold DECIMAL(15,2),
    num_teams INTEGER
);
```

---

### 2.2 Statistics Tables

#### `player_season_stats` (Per Game / Totals / Per 36 / Per 100)

```sql
CREATE TABLE player_season_stats (
    stat_id SERIAL PRIMARY KEY,
    player_id VARCHAR(20),
    season_id VARCHAR(10),
    team_id VARCHAR(10),
    league ENUM('NBA', 'ABA', 'BAA'),
    season_type ENUM('Regular', 'Playoffs', 'All-Star'),
    age INTEGER,

    -- Basic Counting Stats
    games_played INTEGER,
    games_started INTEGER,
    minutes_played INTEGER,
    minutes_per_game DECIMAL(5,2),

    -- Scoring
    field_goals_made INTEGER,
    field_goals_attempted INTEGER,
    field_goal_pct DECIMAL(5,3),
    three_pointers_made INTEGER,
    three_pointers_attempted INTEGER,
    three_point_pct DECIMAL(5,3),
    two_pointers_made INTEGER,
    two_pointers_attempted INTEGER,
    two_point_pct DECIMAL(5,3),
    effective_fg_pct DECIMAL(5,3),
    free_throws_made INTEGER,
    free_throws_attempted INTEGER,
    free_throw_pct DECIMAL(5,3),
    points INTEGER,
    points_per_game DECIMAL(5,2),

    -- Rebounding
    offensive_rebounds INTEGER,
    defensive_rebounds INTEGER,
    total_rebounds INTEGER,
    rebounds_per_game DECIMAL(5,2),

    -- Playmaking
    assists INTEGER,
    assists_per_game DECIMAL(5,2),
    turnovers INTEGER,
    turnovers_per_game DECIMAL(5,2),

    -- Defense
    steals INTEGER,
    steals_per_game DECIMAL(5,2),
    blocks INTEGER,
    blocks_per_game DECIMAL(5,2),

    -- Fouls
    personal_fouls INTEGER,
    personal_fouls_per_game DECIMAL(5,2),

    -- Per Possession Stats (calculated)
    points_per_36 DECIMAL(5,2),
    rebounds_per_36 DECIMAL(5,2),
    assists_per_36 DECIMAL(5,2),
    points_per_100_poss DECIMAL(5,2),
    rebounds_per_100_poss DECIMAL(5,2),
    assists_per_100_poss DECIMAL(5,2),

    FOREIGN KEY (player_id) REFERENCES players(player_id),
    FOREIGN KEY (season_id) REFERENCES seasons(season_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id)
);
```

#### `player_advanced_stats`

```sql
CREATE TABLE player_advanced_stats (
    stat_id SERIAL PRIMARY KEY,
    player_id VARCHAR(20),
    season_id VARCHAR(10),
    team_id VARCHAR(10),
    season_type ENUM('Regular', 'Playoffs'),

    -- Efficiency Metrics
    player_efficiency_rating DECIMAL(5,2),  -- PER
    true_shooting_pct DECIMAL(5,3),  -- TS%

    -- Shooting Rates
    three_point_attempt_rate DECIMAL(5,3),  -- 3PAr = 3PA/FGA
    free_throw_rate DECIMAL(5,3),  -- FTr = FTA/FGA

    -- Rebounding Rates
    offensive_rebound_pct DECIMAL(5,2),  -- ORB%
    defensive_rebound_pct DECIMAL(5,2),  -- DRB%
    total_rebound_pct DECIMAL(5,2),  -- TRB%

    -- Playmaking Rates
    assist_pct DECIMAL(5,2),  -- AST%
    steal_pct DECIMAL(5,2),  -- STL%
    block_pct DECIMAL(5,2),  -- BLK%
    turnover_pct DECIMAL(5,2),  -- TOV%
    usage_pct DECIMAL(5,2),  -- USG%

    -- Win Shares
    offensive_win_shares DECIMAL(6,2),  -- OWS
    defensive_win_shares DECIMAL(6,2),  -- DWS
    win_shares DECIMAL(6,2),  -- WS
    win_shares_per_48 DECIMAL(5,3),  -- WS/48

    -- Box Plus/Minus
    offensive_box_plus_minus DECIMAL(5,2),  -- OBPM
    defensive_box_plus_minus DECIMAL(5,2),  -- DBPM
    box_plus_minus DECIMAL(5,2),  -- BPM
    value_over_replacement DECIMAL(6,2),  -- VORP

    -- Ratings
    offensive_rating DECIMAL(6,2),  -- ORtg
    defensive_rating DECIMAL(6,2),  -- DRtg
    net_rating DECIMAL(6,2),

    FOREIGN KEY (player_id) REFERENCES players(player_id),
    FOREIGN KEY (season_id) REFERENCES seasons(season_id)
);
```

#### `player_shooting_stats`

```sql
CREATE TABLE player_shooting_stats (
    stat_id SERIAL PRIMARY KEY,
    player_id VARCHAR(20),
    season_id VARCHAR(10),
    team_id VARCHAR(10),

    -- Distance Breakdown
    fg_pct_at_rim DECIMAL(5,3),  -- 0-3 feet
    fga_at_rim INTEGER,
    fg_pct_3_10 DECIMAL(5,3),  -- 3-10 feet
    fga_3_10 INTEGER,
    fg_pct_10_16 DECIMAL(5,3),  -- 10-16 feet
    fga_10_16 INTEGER,
    fg_pct_16_3pt DECIMAL(5,3),  -- 16 feet to 3pt line
    fga_16_3pt INTEGER,
    fg_pct_3pt DECIMAL(5,3),  -- 3 point shots
    fga_3pt INTEGER,

    -- Shot Type Breakdown
    pct_fga_2pt DECIMAL(5,3),
    pct_fga_3pt DECIMAL(5,3),
    pct_fg_assisted_2pt DECIMAL(5,3),  -- % of 2pt FG assisted
    pct_fg_assisted_3pt DECIMAL(5,3),  -- % of 3pt FG assisted

    -- Dunks and Layups
    dunks INTEGER,
    pct_fga_dunks DECIMAL(5,3),

    -- Corner 3s
    corner_3_pct DECIMAL(5,3),
    corner_3_attempts INTEGER,

    -- Heaves (half-court and beyond)
    heaves_attempted INTEGER,
    heaves_made INTEGER,

    FOREIGN KEY (player_id) REFERENCES players(player_id),
    FOREIGN KEY (season_id) REFERENCES seasons(season_id)
);
```

#### `player_play_by_play_stats`

```sql
CREATE TABLE player_play_by_play_stats (
    stat_id SERIAL PRIMARY KEY,
    player_id VARCHAR(20),
    season_id VARCHAR(10),
    team_id VARCHAR(10),

    -- Position Estimates (% of time at each position)
    pct_pg DECIMAL(5,2),
    pct_sg DECIMAL(5,2),
    pct_sf DECIMAL(5,2),
    pct_pf DECIMAL(5,2),
    pct_c DECIMAL(5,2),

    -- On/Off Court
    plus_minus_on DECIMAL(6,2),
    plus_minus_off DECIMAL(6,2),
    net_rating_on DECIMAL(6,2),
    net_rating_off DECIMAL(6,2),

    -- Shooting Fouls
    shooting_fouls_drawn INTEGER,
    shooting_fouls_committed INTEGER,

    -- And-1s
    and_one_attempts INTEGER,

    -- Blocked Attempts
    blocked_field_goal_attempts INTEGER,

    FOREIGN KEY (player_id) REFERENCES players(player_id),
    FOREIGN KEY (season_id) REFERENCES seasons(season_id)
);
```

---

### 2.3 Game-Level Tables

#### `games`

```sql
CREATE TABLE games (
    game_id VARCHAR(20) PRIMARY KEY,  -- e.g., '202411180LAL'
    season_id VARCHAR(10),
    game_date DATE,
    game_time TIME,
    game_type ENUM('Regular', 'Playoffs', 'Preseason', 'All-Star', 'NBA Cup'),

    -- Teams
    home_team_id VARCHAR(10),
    away_team_id VARCHAR(10),

    -- Scores
    home_team_score INTEGER,
    away_team_score INTEGER,

    -- Quarters
    home_q1 INTEGER,
    home_q2 INTEGER,
    home_q3 INTEGER,
    home_q4 INTEGER,
    home_ot1 INTEGER,
    home_ot2 INTEGER,
    home_ot3 INTEGER,
    home_ot4 INTEGER,
    away_q1 INTEGER,
    away_q2 INTEGER,
    away_q3 INTEGER,
    away_q4 INTEGER,
    away_ot1 INTEGER,
    away_ot2 INTEGER,
    away_ot3 INTEGER,
    away_ot4 INTEGER,

    -- Game Info
    arena VARCHAR(200),
    attendance INTEGER,
    game_duration_minutes INTEGER,

    -- Playoffs Specific
    playoff_round VARCHAR(50),  -- 'First Round', 'Conference Semis', etc.
    series_game_number INTEGER,

    winner_team_id VARCHAR(10),

    FOREIGN KEY (season_id) REFERENCES seasons(season_id),
    FOREIGN KEY (home_team_id) REFERENCES teams(team_id),
    FOREIGN KEY (away_team_id) REFERENCES teams(team_id)
);
```

#### `box_scores` (Player Game Stats)

```sql
CREATE TABLE box_scores (
    box_score_id SERIAL PRIMARY KEY,
    game_id VARCHAR(20),
    player_id VARCHAR(20),
    team_id VARCHAR(10),

    -- Playing Time
    is_starter BOOLEAN,
    minutes_played INTEGER,
    did_not_play BOOLEAN DEFAULT FALSE,
    dnp_reason VARCHAR(200),  -- 'Coach's Decision', 'Injury', etc.

    -- Basic Stats
    field_goals_made INTEGER,
    field_goals_attempted INTEGER,
    three_pointers_made INTEGER,
    three_pointers_attempted INTEGER,
    free_throws_made INTEGER,
    free_throws_attempted INTEGER,
    offensive_rebounds INTEGER,
    defensive_rebounds INTEGER,
    total_rebounds INTEGER,
    assists INTEGER,
    steals INTEGER,
    blocks INTEGER,
    turnovers INTEGER,
    personal_fouls INTEGER,
    points INTEGER,

    -- Plus/Minus
    plus_minus INTEGER,

    -- Advanced (Game Level)
    game_score DECIMAL(6,2),  -- John Hollinger's Game Score

    FOREIGN KEY (game_id) REFERENCES games(game_id),
    FOREIGN KEY (player_id) REFERENCES players(player_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id)
);
```

#### `team_game_stats`

```sql
CREATE TABLE team_game_stats (
    stat_id SERIAL PRIMARY KEY,
    game_id VARCHAR(20),
    team_id VARCHAR(10),
    is_home BOOLEAN,

    -- Basic Stats (all counting stats)
    field_goals_made INTEGER,
    field_goals_attempted INTEGER,
    three_pointers_made INTEGER,
    three_pointers_attempted INTEGER,
    free_throws_made INTEGER,
    free_throws_attempted INTEGER,
    offensive_rebounds INTEGER,
    defensive_rebounds INTEGER,
    total_rebounds INTEGER,
    assists INTEGER,
    steals INTEGER,
    blocks INTEGER,
    turnovers INTEGER,
    personal_fouls INTEGER,
    points INTEGER,

    -- Pace & Efficiency
    pace DECIMAL(6,2),
    offensive_rating DECIMAL(6,2),
    defensive_rating DECIMAL(6,2),
    possessions DECIMAL(6,2),

    -- Four Factors
    effective_fg_pct DECIMAL(5,3),
    turnover_pct DECIMAL(5,2),
    offensive_rebound_pct DECIMAL(5,2),
    free_throw_rate DECIMAL(5,3),

    FOREIGN KEY (game_id) REFERENCES games(game_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id)
);
```

---

### 2.4 Team Statistics Tables

#### `team_season_stats`

```sql
CREATE TABLE team_season_stats (
    stat_id SERIAL PRIMARY KEY,
    team_id VARCHAR(10),
    season_id VARCHAR(10),
    season_type ENUM('Regular', 'Playoffs'),

    -- Record
    wins INTEGER,
    losses INTEGER,
    win_pct DECIMAL(5,3),
    games_behind DECIMAL(4,1),

    -- Standings
    conference_rank INTEGER,
    division_rank INTEGER,
    playoff_seed INTEGER,

    -- Streaks
    current_streak VARCHAR(10),  -- 'W5', 'L2', etc.
    home_record VARCHAR(10),  -- '25-16'
    away_record VARCHAR(10),

    -- Points
    points_per_game DECIMAL(6,2),
    opponent_points_per_game DECIMAL(6,2),
    point_differential DECIMAL(6,2),

    -- Pace & Ratings
    pace DECIMAL(6,2),
    offensive_rating DECIMAL(6,2),
    defensive_rating DECIMAL(6,2),
    net_rating DECIMAL(6,2),

    -- Expected Wins
    pythagorean_wins DECIMAL(5,2),
    strength_of_schedule DECIMAL(5,2),
    simple_rating_system DECIMAL(5,2),  -- SRS

    -- Shooting
    field_goal_pct DECIMAL(5,3),
    three_point_pct DECIMAL(5,3),
    free_throw_pct DECIMAL(5,3),
    effective_fg_pct DECIMAL(5,3),
    true_shooting_pct DECIMAL(5,3),

    -- Rebounding
    offensive_rebound_pct DECIMAL(5,2),
    defensive_rebound_pct DECIMAL(5,2),

    -- Turnovers
    turnover_pct DECIMAL(5,2),
    opponent_turnover_pct DECIMAL(5,2),

    -- Age
    average_age DECIMAL(4,2),

    FOREIGN KEY (team_id) REFERENCES teams(team_id),
    FOREIGN KEY (season_id) REFERENCES seasons(season_id)
);
```

---

### 2.5 Splits Tables

#### `player_splits`

```sql
CREATE TABLE player_splits (
    split_id SERIAL PRIMARY KEY,
    player_id VARCHAR(20),
    season_id VARCHAR(10),

    -- Split Categories
    split_type ENUM('Location', 'Result', 'Month', 'Day', 'Pre/Post All-Star',
                   'Opponent', 'Division', 'Conference', 'Days Rest',
                   'Clutch', 'Quarter', 'Score Margin', 'Ahead/Behind'),
    split_value VARCHAR(100),  -- 'Home', 'Away', 'January', 'vs ATL', etc.

    -- Stats
    games INTEGER,
    minutes INTEGER,
    field_goals_made INTEGER,
    field_goals_attempted INTEGER,
    field_goal_pct DECIMAL(5,3),
    three_pointers_made INTEGER,
    three_pointers_attempted INTEGER,
    three_point_pct DECIMAL(5,3),
    free_throws_made INTEGER,
    free_throws_attempted INTEGER,
    free_throw_pct DECIMAL(5,3),
    rebounds INTEGER,
    assists INTEGER,
    steals INTEGER,
    blocks INTEGER,
    turnovers INTEGER,
    points INTEGER,
    points_per_game DECIMAL(5,2),

    -- Advanced
    true_shooting_pct DECIMAL(5,3),
    effective_fg_pct DECIMAL(5,3),

    FOREIGN KEY (player_id) REFERENCES players(player_id),
    FOREIGN KEY (season_id) REFERENCES seasons(season_id)
);
```

---

### 2.6 Draft & Contracts Tables

#### `draft_picks`

```sql
CREATE TABLE draft_picks (
    pick_id SERIAL PRIMARY KEY,
    draft_year INTEGER,
    round INTEGER,
    pick_number INTEGER,
    overall_pick INTEGER,

    player_id VARCHAR(20),
    team_id VARCHAR(10),  -- Team that drafted

    -- Player Info at Draft
    player_name VARCHAR(200),
    college VARCHAR(200),
    nationality VARCHAR(100),

    -- Draft Combine Measurements (if available)
    height_no_shoes DECIMAL(5,2),
    height_with_shoes DECIMAL(5,2),
    weight DECIMAL(5,2),
    wingspan DECIMAL(5,2),
    standing_reach DECIMAL(5,2),
    body_fat_pct DECIMAL(4,2),
    hand_length DECIMAL(4,2),
    hand_width DECIMAL(4,2),
    standing_vertical DECIMAL(5,2),
    max_vertical DECIMAL(5,2),
    lane_agility_time DECIMAL(5,2),
    three_quarter_sprint DECIMAL(5,2),
    bench_press_reps INTEGER,

    -- Career Production
    career_games INTEGER,
    career_points INTEGER,
    career_win_shares DECIMAL(6,2),
    career_vorp DECIMAL(6,2),

    FOREIGN KEY (player_id) REFERENCES players(player_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id)
);
```

#### `player_contracts`

```sql
CREATE TABLE player_contracts (
    contract_id SERIAL PRIMARY KEY,
    player_id VARCHAR(20),
    team_id VARCHAR(10),

    contract_type VARCHAR(50),  -- 'Rookie Scale', 'Max', 'Veteran Min', etc.
    signing_date DATE,
    total_value DECIMAL(15,2),
    years INTEGER,

    -- Yearly Breakdown
    year_1_salary DECIMAL(15,2),
    year_2_salary DECIMAL(15,2),
    year_3_salary DECIMAL(15,2),
    year_4_salary DECIMAL(15,2),
    year_5_salary DECIMAL(15,2),
    year_6_salary DECIMAL(15,2),

    -- Options
    player_option_year INTEGER,
    team_option_year INTEGER,
    early_termination_option_year INTEGER,

    -- Guarantees
    guaranteed_money DECIMAL(15,2),

    -- Trade & Other
    no_trade_clause BOOLEAN,
    trade_kicker_pct DECIMAL(4,2),

    is_active BOOLEAN,

    FOREIGN KEY (player_id) REFERENCES players(player_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id)
);
```

#### `team_payrolls`

```sql
CREATE TABLE team_payrolls (
    payroll_id SERIAL PRIMARY KEY,
    team_id VARCHAR(10),
    season_id VARCHAR(10),

    total_payroll DECIMAL(15,2),
    salary_cap DECIMAL(15,2),
    luxury_tax_threshold DECIMAL(15,2),
    cap_space DECIMAL(15,2),
    luxury_tax_bill DECIMAL(15,2),

    -- Roster Breakdown
    active_roster_count INTEGER,
    two_way_count INTEGER,

    FOREIGN KEY (team_id) REFERENCES teams(team_id),
    FOREIGN KEY (season_id) REFERENCES seasons(season_id)
);
```

---

### 2.7 Awards & Records Tables

#### `awards`

```sql
CREATE TABLE awards (
    award_id SERIAL PRIMARY KEY,
    season_id VARCHAR(10),
    award_type VARCHAR(100),  -- 'MVP', 'DPOY', 'ROY', 'MIP', 'SMOY', etc.
    player_id VARCHAR(20),
    team_id VARCHAR(10),

    -- Voting Details
    first_place_votes INTEGER,
    total_points INTEGER,
    vote_share DECIMAL(5,4),  -- Award Share

    rank INTEGER,  -- 1st place, 2nd place, etc.

    FOREIGN KEY (season_id) REFERENCES seasons(season_id),
    FOREIGN KEY (player_id) REFERENCES players(player_id)
);
```

#### `all_nba_teams`

```sql
CREATE TABLE all_nba_teams (
    selection_id SERIAL PRIMARY KEY,
    season_id VARCHAR(10),
    team_type ENUM('All-NBA', 'All-Defensive', 'All-Rookie'),
    team_number INTEGER,  -- 1st, 2nd, 3rd
    player_id VARCHAR(20),
    position VARCHAR(20),

    FOREIGN KEY (season_id) REFERENCES seasons(season_id),
    FOREIGN KEY (player_id) REFERENCES players(player_id)
);
```

#### `hall_of_fame`

```sql
CREATE TABLE hall_of_fame (
    hof_id SERIAL PRIMARY KEY,
    player_id VARCHAR(20),
    induction_year INTEGER,
    category VARCHAR(50),  -- 'Player', 'Coach', 'Contributor'

    FOREIGN KEY (player_id) REFERENCES players(player_id)
);
```

---

### 2.8 Playoffs Tables

#### `playoff_series`

```sql
CREATE TABLE playoff_series (
    series_id SERIAL PRIMARY KEY,
    season_id VARCHAR(10),
    round VARCHAR(50),  -- 'First Round', 'Conference Semis', 'Conference Finals', 'NBA Finals'
    conference ENUM('Eastern', 'Western'),

    higher_seed_team_id VARCHAR(10),
    lower_seed_team_id VARCHAR(10),

    higher_seed_wins INTEGER,
    lower_seed_wins INTEGER,

    winner_team_id VARCHAR(10),
    series_result VARCHAR(10),  -- '4-2', '4-0', etc.

    FOREIGN KEY (season_id) REFERENCES seasons(season_id),
    FOREIGN KEY (higher_seed_team_id) REFERENCES teams(team_id),
    FOREIGN KEY (lower_seed_team_id) REFERENCES teams(team_id)
);
```

---

### 2.9 Coaches & Executives Tables

#### `coaches`

```sql
CREATE TABLE coaches (
    coach_id VARCHAR(20) PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    full_name VARCHAR(200),
    birth_date DATE,
    death_date DATE,

    -- As Player
    played_in_nba BOOLEAN,
    player_id VARCHAR(20),

    -- Coaching Record
    career_wins INTEGER,
    career_losses INTEGER,
    playoff_wins INTEGER,
    playoff_losses INTEGER,
    championships INTEGER,

    FOREIGN KEY (player_id) REFERENCES players(player_id)
);
```

#### `coach_seasons`

```sql
CREATE TABLE coach_seasons (
    coach_season_id SERIAL PRIMARY KEY,
    coach_id VARCHAR(20),
    team_id VARCHAR(10),
    season_id VARCHAR(10),

    is_head_coach BOOLEAN,
    wins INTEGER,
    losses INTEGER,
    playoff_wins INTEGER,
    playoff_losses INTEGER,

    FOREIGN KEY (coach_id) REFERENCES coaches(coach_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id),
    FOREIGN KEY (season_id) REFERENCES seasons(season_id)
);
```

---

## 3. PAGE STRUCTURES & CONNECTIONS

### 3.1 Player Page Structure

**URL Pattern:** `/players/{first_letter}/{player_id}.html` **Example:** `/players/j/jamesle01.html`

#### Main Player Page Sections

```text
┌─────────────────────────────────────────────────────────────────┐
│ HEADER                                                          │
│ - Player Photo                                                  │
│ - Name, Nicknames                                               │
│ - Position, Height, Weight, Shoots                              │
│ - Team (current)                                                │
│ - Birth Date/Location                                           │
│ - High School, College                                          │
│ - Draft Info                                                    │
│ - NBA Debut, Experience                                         │
│ - Career Highlights (All-Star selections, MVP, etc.)            │
├─────────────────────────────────────────────────────────────────┤
│ NAVIGATION TABS                                                 │
│ [Per Game] [Totals] [Per 36 Min] [Per 100 Poss] [Advanced]      │
│ [Adjusted Shooting] [Shooting] [Play-by-Play]                   │
├─────────────────────────────────────────────────────────────────┤
│ CAREER STATS TABLE (Per Game by default)                        │
│ Columns: Season | Age | Team | Lg | Pos | G | GS | MP | FG |    │
│          FGA | FG% | 3P | 3PA | 3P% | 2P | 2PA | 2P% | eFG% |   │
│          FT | FTA | FT% | ORB | DRB | TRB | AST | STL | BLK |   │
│          TOV | PF | PTS                                         │
│ - Regular Season rows                                           │
│ - Career totals row                                             │
│ - Playoff rows                                                  │
│ - Playoff career totals                                         │
├─────────────────────────────────────────────────────────────────┤
│ SIDEBAR                                                         │
│ - Similar Players                                               │
│ - Transactions                                                  │
│ - Recent Game Logs                                              │
│ - Accolades/Awards                                              │
├─────────────────────────────────────────────────────────────────┤
│ SUB-PAGES LINKS                                                 │
│ - Game Logs (by season)                                         │
│ - Splits (career, by season)                                    │
│ - Shooting (by season)                                          │
│ - On/Off                                                        │
│ - Lineups                                                       │
│ - International Stats                                           │
│ - High School/Amateur                                           │
└─────────────────────────────────────────────────────────────────┘
```

#### Player Sub-Pages

| Page              | URL Pattern                              | Key Tables                |
| ----------------- | ---------------------------------------- | ------------------------- |
| Game Logs         | `/players/j/jamesle01/gamelog/{year}`    | box_scores, games         |
| Career Game Log   | `/players/j/jamesle01/gamelog/`          | box_scores, games         |
| Splits            | `/players/j/jamesle01/splits/{year}`     | player_splits             |
| Career Splits     | `/players/j/jamesle01/splits/`           | player_splits             |
| Shooting          | `/players/j/jamesle01/shooting/{year}`   | player_shooting_stats     |
| Playoffs Game Log | `/players/j/jamesle01/gamelog-playoffs/` | box_scores, games         |
| On/Off            | `/players/j/jamesle01/on-off/{year}`     | player_play_by_play_stats |
| Lineups           | `/players/j/jamesle01/lineups/{year}`    | lineup_stats              |

---

### 3.2 Team Page Structure

**URL Pattern:** `/teams/{team_id}/{year}.html` **Example:** `/teams/LAL/2025.html`

#### Team Season Page Sections

```text
┌─────────────────────────────────────────────────────────────────┐
│ HEADER                                                          │
│ - Team Logo                                                     │
│ - Team Name, Season (e.g., "2024-25 Los Angeles Lakers")        │
│ - Record (W-L, Win%)                                            │
│ - Finish: 3rd in Pacific Division                               │
│ - Coach, Executive                                              │
│ - PTS/G, Opp PTS/G                                              │
│ - Pace, ORtg, DRtg, NRtg                                        │
│ - Expected W-L (Pythagorean)                                    │
│ - Preseason Odds                                                │
│ - Arena, Attendance                                             │
├─────────────────────────────────────────────────────────────────┤
│ NAVIGATION                                                      │
│ [Roster] [Schedule] [Game Log] [Splits] [Lineups] [Transactions]│
├─────────────────────────────────────────────────────────────────┤
│ ROSTER TABLE                                                    │
│ - Player | Pos | Ht | Wt | Birth Date | Country | Exp | College │
├─────────────────────────────────────────────────────────────────┤
│ TEAM STATS TABLES                                               │
│ Per Game Stats (Team & Opponent)                                │
│ - FG, FGA, FG%, 3P, 3PA, 3P%, FT, FTA, FT%, ORB, DRB, TRB,     │
│   AST, STL, BLK, TOV, PF, PTS                                   │
├─────────────────────────────────────────────────────────────────┤
│ PLAYER STATS TABLE                                              │
│ - All players on roster with season stats                       │
│ - Per Game | Totals | Per 36 | Per 100 | Advanced               │
├─────────────────────────────────────────────────────────────────┤
│ PAYROLL SECTION                                                 │
│ - Player salaries for the season                                │
│ - Total payroll, Cap Space, Luxury Tax                          │
└─────────────────────────────────────────────────────────────────┘
```

#### Team Sub-Pages

| Page              | URL Pattern                                 | Key Tables                      |
| ----------------- | ------------------------------------------- | ------------------------------- |
| Franchise History | `/teams/{team_id}/`                         | teams, team_season_stats        |
| Schedule          | `/teams/{team_id}/{year}_games.html`        | games                           |
| Roster            | `/teams/{team_id}/{year}.html#roster`       | players, player_season_stats    |
| Game Log          | `/teams/{team_id}/{year}_gamelog.html`      | games, team_game_stats          |
| Splits            | `/teams/{team_id}/{year}_splits.html`       | Similar to player_splits        |
| Lineups           | `/teams/{team_id}/{year}_lineups.html`      | lineup_stats                    |
| Transactions      | `/teams/{team_id}/{year}_transactions.html` | transactions                    |
| Payroll           | `/contracts/{team_id}.html`                 | player_contracts, team_payrolls |

---

### 3.3 Season/League Page Structure

**URL Pattern:** `/leagues/NBA_{year}.html` **Example:** `/leagues/NBA_2025.html`

#### Season Page Sections

```text
┌─────────────────────────────────────────────────────────────────┐
│ HEADER                                                          │
│ - Season Name (e.g., "2024-25 NBA Season")                      │
│ - League Champion                                               │
│ - MVP, ROY, DPOY, Finals MVP                                    │
│ - PPG/RPG/APG/WS Leaders                                        │
├─────────────────────────────────────────────────────────────────┤
│ NAVIGATION                                                      │
│ [Standings] [Schedule] [Leaders] [Coaches]                      │
│ Player Stats: [Per Game] [Totals] [Per 36] [Per 100] [Advanced] │
│              [Shooting] [Play-by-Play] [Adjusted Shooting]      │
│ [Rookies] [Team Ratings] [Transactions] [Standings by Date]     │
├─────────────────────────────────────────────────────────────────┤
│ STANDINGS                                                       │
│ Eastern Conference / Western Conference                         │
│ - Team | W | L | W/L% | GB | PS/G | PA/G | SRS                  │
├─────────────────────────────────────────────────────────────────┤
│ TEAM STATS (Per Game)                                           │
│ - All 30 teams with offensive & defensive stats                 │
├─────────────────────────────────────────────────────────────────┤
│ TEAM STATS (Advanced)                                           │
│ - Age, W, L, PW, PL, MOV, SOS, SRS, ORtg, DRtg, NRtg, Pace,    │
│   FTr, 3PAr, TS%, eFG%, TOV%, ORB%, FT/FGA (Off & Def)         │
└─────────────────────────────────────────────────────────────────┘
```

#### Season Stats Sub-Pages

| Page                | URL Pattern                             | Key Tables                |
| ------------------- | --------------------------------------- | ------------------------- |
| Per Game Stats      | `/leagues/NBA_{year}_per_game.html`     | player_season_stats       |
| Totals              | `/leagues/NBA_{year}_totals.html`       | player_season_stats       |
| Per 36 Minutes      | `/leagues/NBA_{year}_per_minute.html`   | player_season_stats       |
| Per 100 Possessions | `/leagues/NBA_{year}_per_poss.html`     | player_season_stats       |
| Advanced            | `/leagues/NBA_{year}_advanced.html`     | player_advanced_stats     |
| Shooting            | `/leagues/NBA_{year}_shooting.html`     | player_shooting_stats     |
| Play-by-Play        | `/leagues/NBA_{year}_play-by-play.html` | player_play_by_play_stats |
| Adjusted Shooting   | `/leagues/NBA_{year}_adj_shooting.html` | player_shooting_stats     |
| Team Ratings        | `/leagues/NBA_{year}_ratings.html`      | team_season_stats         |
| Schedule            | `/leagues/NBA_{year}_games.html`        | games                     |
| Standings           | `/leagues/NBA_{year}_standings.html`    | team_season_stats         |

---

### 3.4 Box Score Page Structure

**URL Pattern:** `/boxscores/{game_id}.html` **Example:** `/boxscores/202411180LAL.html`

```text
┌─────────────────────────────────────────────────────────────────┐
│ HEADER                                                          │
│ - Date, Arena, Attendance                                       │
│ - Away Team Score @ Home Team Score                             │
│ - Line Score (Q1, Q2, Q3, Q4, OT, Total)                        │
├─────────────────────────────────────────────────────────────────┤
│ AWAY TEAM BOX SCORE (Basic)                                     │
│ - Starters                                                      │
│ - Reserves                                                      │
│ Columns: Player | MP | FG | FGA | FG% | 3P | 3PA | 3P% |        │
│          FT | FTA | FT% | ORB | DRB | TRB | AST | STL | BLK |   │
│          TOV | PF | PTS | +/-                                   │
│ - Team Totals                                                   │
├─────────────────────────────────────────────────────────────────┤
│ HOME TEAM BOX SCORE (Basic)                                     │
│ - Same structure as away team                                   │
├─────────────────────────────────────────────────────────────────┤
│ ADVANCED BOX SCORE (Toggleable)                                 │
│ Columns: Player | MP | TS% | eFG% | 3PAr | FTr | ORB% | DRB% |  │
│          TRB% | AST% | STL% | BLK% | TOV% | USG% | ORtg | DRtg │
│          | BPM                                                  │
├─────────────────────────────────────────────────────────────────┤
│ FOUR FACTORS                                                    │
│ - eFG%, TOV%, ORB%, FT/FGA for both teams                       │
├─────────────────────────────────────────────────────────────────┤
│ LINKS                                                           │
│ - Play-by-Play                                                  │
│ - Shot Chart                                                    │
└─────────────────────────────────────────────────────────────────┘
```

---

### 3.5 Draft Page Structure

**URL Pattern:** `/draft/NBA_{year}.html` **Example:** `/draft/NBA_2024.html`

```text
┌─────────────────────────────────────────────────────────────────┐
│ HEADER                                                          │
│ - Draft Year, Date, Location                                    │
│ - Number of Picks                                               │
│ - First Overall Pick                                            │
│ - Most Win Shares from this draft                               │
│ - All-Stars from this draft                                     │
├─────────────────────────────────────────────────────────────────┤
│ DRAFT TABLE                                                     │
│ Columns: Rnd | Pk | Team | Player | College | Yrs | G | MP |    │
│          PTS | TRB | AST | FG% | 3P% | FT% | WS | WS/48 | BPM  │
│          | VORP                                                 │
│ - Round 1 picks                                                 │
│ - Round 2 picks                                                 │
├─────────────────────────────────────────────────────────────────┤
│ DRAFT COMBINE MEASUREMENTS (if available)                       │
│ Columns: Player | Height w/o Shoes | Height w/ Shoes | Weight | │
│          Wingspan | Standing Reach | Body Fat % | Hand Length | │
│          Hand Width | Standing Vertical | Max Vertical |        │
│          Lane Agility | 3/4 Sprint | Bench Press               │
└─────────────────────────────────────────────────────────────────┘
```

---

### 3.6 Awards Page Structure

**URL Pattern:** `/awards/{award_type}.html` **Examples:** `/awards/mvp.html`, `/awards/dpoy.html`

```text
┌─────────────────────────────────────────────────────────────────┐
│ HEADER                                                          │
│ - Award Name (e.g., "NBA Most Valuable Player Award")           │
│ - Description                                                   │
├─────────────────────────────────────────────────────────────────┤
│ WINNERS TABLE                                                   │
│ Columns: Season | Lg | Player | Voting | Age | Tm | G | MP |    │
│          PTS | TRB | AST | STL | BLK | FG% | 3P% | FT% | WS |   │
│          WS/48                                                  │
├─────────────────────────────────────────────────────────────────┤
│ VOTING HISTORY (for seasons with detailed voting)               │
│ Columns: Player | Age | Tm | First | Pts Won | Pts Max | Share  │
└─────────────────────────────────────────────────────────────────┘
```

---

### 3.7 Leaders Page Structure

**URL Pattern:** `/leaders/{stat}_career.html` or `/leaders/{stat}_season.html` **Examples:**
`/leaders/pts_career.html`, `/leaders/pts_season.html`

```text
┌─────────────────────────────────────────────────────────────────┐
│ HEADER                                                          │
│ - Stat Name (e.g., "Career Points Leaders")                     │
├─────────────────────────────────────────────────────────────────┤
│ LEADERBOARD TABLE                                               │
│ Columns: Rank | Player | Career Total | Years Active            │
│ - Top 250 players                                               │
├─────────────────────────────────────────────────────────────────┤
│ RELATED LEADERS                                                 │
│ - Links to: Season, Active, Progressive, Playoffs               │
└─────────────────────────────────────────────────────────────────┘
```

---

### 3.8 Playoffs Page Structure

**URL Pattern:** `/playoffs/NBA_{year}.html` **Example:** `/playoffs/NBA_2024.html`

```text
┌─────────────────────────────────────────────────────────────────┐
│ HEADER                                                          │
│ - Season (e.g., "2024 NBA Playoffs")                            │
│ - Champion                                                      │
│ - Finals MVP                                                    │
├─────────────────────────────────────────────────────────────────┤
│ BRACKET VISUALIZATION                                           │
│ - First Round                                                   │
│ - Conference Semifinals                                         │
│ - Conference Finals                                             │
│ - NBA Finals                                                    │
├─────────────────────────────────────────────────────────────────┤
│ SERIES SUMMARIES                                                │
│ For each series:                                                │
│ - Teams, Seeds                                                  │
│ - Series Result (e.g., "4-2")                                   │
│ - Links to individual games                                     │
├─────────────────────────────────────────────────────────────────┤
│ PLAYOFF STATS                                                   │
│ - Player stats for entire playoffs                              │
│ - Per Game | Totals | Advanced                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. ADVANCED STATISTICS FORMULAS

### 4.1 Basic Rate Stats

```text
FG% = FGM / FGA
3P% = 3PM / 3PA
FT% = FTM / FTA
eFG% = (FGM + 0.5 * 3PM) / FGA
TS% = PTS / (2 * (FGA + 0.44 * FTA))
```

### 4.2 Per-36 and Per-100 Stats

```text
Per36_STAT = (STAT / MP) * 36
Per100_STAT = (STAT / POSS) * 100
```

### 4.3 Possession Estimation

```text
Team_Poss = 0.5 * ((FGA + 0.4*FTA - 1.07*(ORB/(ORB+Opp_DRB))*(FGA-FGM) + TOV)
            + (Opp_FGA + 0.4*Opp_FTA - 1.07*(Opp_ORB/(Opp_ORB+DRB))*(Opp_FGA-Opp_FGM) + Opp_TOV))
```

### 4.4 Rebound Percentages

```text
ORB% = 100 * (ORB * (Tm_MP / 5)) / (MP * (Tm_ORB + Opp_DRB))
DRB% = 100 * (DRB * (Tm_MP / 5)) / (MP * (Tm_DRB + Opp_ORB))
TRB% = 100 * (TRB * (Tm_MP / 5)) / (MP * (Tm_TRB + Opp_TRB))
```

### 4.5 Assist & Turnover Percentages

```text
AST% = 100 * AST / (((MP / (Tm_MP / 5)) * Tm_FG) - FG)
TOV% = 100 * TOV / (FGA + 0.44 * FTA + TOV)
USG% = 100 * ((FGA + 0.44 * FTA + TOV) * (Tm_MP / 5)) / (MP * (Tm_FGA + 0.44 * Tm_FTA + Tm_TOV))
```

### 4.6 Win Shares (Simplified)

```text
Marginal_Offense = (PTS_Produced - 0.92 * Lg_PPP * Ind_Poss)
Marginal_Defense = (Tm_Poss / 5) * (1.08 * Lg_PPP - DRtg / 100)
OWS = Marginal_Offense / (0.32 * Lg_PPP)
DWS = Marginal_Defense / (0.32 * Lg_PPP)
WS = OWS + DWS
```

### 4.7 Box Plus/Minus (BPM)

```text
BPM = f(position, pace, team_performance, box_score_stats)
VORP = [BPM - (-2.0)] * (% of possessions played) * (team_games / 82)
```

### 4.8 Pythagorean Wins

```text
W_Pyth = G * (PTS^14 / (PTS^14 + Opp_PTS^14))
```

### 4.9 Game Score (John Hollinger)

```text
GmSc = PTS + 0.4*FGM - 0.7*FGA - 0.4*(FTA-FTM) + 0.7*ORB + 0.3*DRB + STL + 0.7*AST + 0.7*BLK - 0.4*PF - TOV
```

---

## 5. PAGE INTERCONNECTIONS MAP

```text
                              ┌─────────────┐
                              │   HOME      │
                              │   PAGE      │
                              └──────┬──────┘
                                     │
        ┌──────────────┬─────────────┼─────────────┬──────────────┐
        │              │             │             │              │
        ▼              ▼             ▼             ▼              ▼
   ┌─────────┐   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
   │ PLAYERS │   │  TEAMS   │  │ SEASONS  │  │ LEADERS  │  │  DRAFT   │
   │  INDEX  │   │  INDEX   │  │  INDEX   │  │  INDEX   │  │  INDEX   │
   └────┬────┘   └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘
        │             │             │             │              │
        ▼             ▼             ▼             ▼              ▼
   ┌─────────┐   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
   │ PLAYER  │◄──│ TEAM     │◄─│ SEASON   │◄─│ CAREER   │  │ DRAFT    │
   │  PAGE   │──►│  PAGE    │─►│  PAGE    │─►│ LEADERS  │  │  YEAR    │
   └────┬────┘   └────┬─────┘  └────┬─────┘  └──────────┘  └────┬─────┘
        │             │             │                           │
   ┌────┴────┐   ┌────┴─────┐  ┌────┴─────┐                     │
   │         │   │          │  │          │                     │
   ▼         ▼   ▼          ▼  ▼          ▼                     │
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                    │
│GAME  │ │SPLITS│ │ROSTER│ │SCHED │ │PLAYER│                    │
│LOGS  │ │      │ │      │ │ ULE  │ │STATS │◄───────────────────┘
└──┬───┘ └──────┘ └──┬───┘ └──┬───┘ └──────┘
   │                 │        │
   │                 │        ▼
   │                 │   ┌──────────┐
   │                 │   │   BOX    │
   │                 └──►│  SCORE   │◄──────────────────────────┐
   │                     └────┬─────┘                           │
   │                          │                                 │
   │                          ▼                                 │
   │                     ┌──────────┐                           │
   └────────────────────►│ PLAY-BY- │                           │
                         │   PLAY   │                           │
                         └──────────┘                           │
                                                                │
   ┌──────────────────────────────────────────────────────────┐ │
   │                        PLAYOFFS                          │ │
   │  ┌───────┐  ┌───────┐  ┌───────┐  ┌───────┐  ┌───────┐  │ │
   │  │PLAYOFF│──│SERIES │──│ GAME  │──│  BOX  │──│ STATS │  │─┘
   │  │ INDEX │  │       │  │       │  │ SCORE │  │       │  │
   │  └───────┘  └───────┘  └───────┘  └───────┘  └───────┘  │
   └──────────────────────────────────────────────────────────┘

   ┌──────────────────────────────────────────────────────────┐
   │                       CONTRACTS                          │
   │  ┌───────┐  ┌───────┐  ┌───────┐  ┌───────┐             │
   │  │SUMMARY│──│ TEAM  │──│PLAYER │──│ CAP   │             │
   │  │       │  │PAYROLL│  │SALARY │  │HISTORY│             │
   │  └───────┘  └───────┘  └───────┘  └───────┘             │
   └──────────────────────────────────────────────────────────┘

   ┌──────────────────────────────────────────────────────────┐
   │                        AWARDS                            │
   │  ┌───────┐  ┌───────┐  ┌───────┐  ┌───────┐  ┌───────┐  │
   │  │  MVP  │  │ DPOY  │  │  ROY  │  │ALL-NBA│  │  HOF  │  │
   │  └───────┘  └───────┘  └───────┘  └───────┘  └───────┘  │
   └──────────────────────────────────────────────────────────┘
```

---

## 6. KEY LINKING PATTERNS

### 6.1 Cross-References

| From Page   | To Page          | Link Type           |
| ----------- | ---------------- | ------------------- |
| Player Page | Team Season Page | Current team link   |
| Player Page | Box Scores       | Recent games        |
| Player Page | Draft Page       | Draft info          |
| Team Page   | Player Pages     | Roster links        |
| Team Page   | Box Scores       | Schedule/Game Log   |
| Team Page   | Season Page      | League standings    |
| Box Score   | Player Pages     | All players in game |
| Box Score   | Team Pages       | Both teams          |
| Season Page | Team Pages       | All 30 teams        |
| Season Page | Player Stats     | League-wide stats   |
| Draft Page  | Player Pages     | All drafted players |
| Draft Page  | Team Pages       | Drafting teams      |
| Leaders     | Player Pages     | All listed players  |
| Awards      | Player Pages     | Award winners       |
| Awards      | Season Page      | Season context      |
| Playoffs    | Series Pages     | All rounds          |
| Series      | Box Scores       | Individual games    |

### 6.2 URL Patterns Summary

```text
Players:       /players/{letter}/{player_id}.html
               /players/{letter}/{player_id}/gamelog/{year}
               /players/{letter}/{player_id}/splits/{year}
               /players/{letter}/{player_id}/shooting/{year}

Teams:         /teams/{team_id}/
               /teams/{team_id}/{year}.html
               /teams/{team_id}/{year}_games.html
               /teams/{team_id}/{year}_gamelog.html

Seasons:       /leagues/NBA_{year}.html
               /leagues/NBA_{year}_per_game.html
               /leagues/NBA_{year}_totals.html
               /leagues/NBA_{year}_advanced.html
               /leagues/NBA_{year}_standings.html

Box Scores:    /boxscores/
               /boxscores/{game_id}.html
               /boxscores/pbp/{game_id}.html
               /boxscores/shot-chart/{game_id}.html

Draft:         /draft/
               /draft/NBA_{year}.html

Awards:        /awards/
               /awards/{award_type}.html
               /awards/awards_{year}.html

Leaders:       /leaders/
               /leaders/{stat}_career.html
               /leaders/{stat}_season.html
               /leaders/{stat}_active.html
               /leaders/{stat}_career_p.html (playoffs)

Playoffs:      /playoffs/
               /playoffs/NBA_{year}.html
               /playoffs/{year}_NBA_{round}.html

Contracts:     /contracts/
               /contracts/{team_id}.html
               /contracts/players.html
```

---

## 7. DATA RELATIONSHIPS DIAGRAM

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ENTITY RELATIONSHIPS                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────┐        ┌─────────────────┐        ┌─────────┐                │
│   │ players │───1:N──│player_season_   │───N:1──│ seasons │                │
│   │         │        │    stats        │        │         │                │
│   └────┬────┘        └───────┬─────────┘        └────┬────┘                │
│        │                     │                       │                      │
│        │ 1:N                 │ N:1                   │ 1:N                  │
│        │                     │                       │                      │
│        ▼                     ▼                       ▼                      │
│   ┌─────────┐        ┌─────────────────┐        ┌─────────┐                │
│   │box_     │───N:1──│     teams       │───1:N──│team_    │                │
│   │scores   │        │                 │        │season_  │                │
│   └────┬────┘        └───────┬─────────┘        │stats    │                │
│        │                     │                  └─────────┘                │
│        │ N:1                 │ 1:N                                         │
│        │                     │                                             │
│        ▼                     ▼                                             │
│   ┌─────────┐        ┌─────────────────┐                                   │
│   │  games  │───N:1──│   franchises    │                                   │
│   │         │        │                 │                                   │
│   └────┬────┘        └─────────────────┘                                   │
│        │                                                                    │
│        │ 1:N                                                               │
│        │                                                                    │
│        ▼                                                                    │
│   ┌─────────────────┐                                                      │
│   │ team_game_stats │                                                      │
│   └─────────────────┘                                                      │
│                                                                             │
│   ┌─────────┐        ┌─────────────────┐        ┌─────────┐                │
│   │ players │───1:N──│  draft_picks    │───N:1──│  teams  │                │
│   └─────────┘        └─────────────────┘        └─────────┘                │
│                                                                             │
│   ┌─────────┐        ┌─────────────────┐        ┌─────────┐                │
│   │ players │───1:N──│player_contracts │───N:1──│  teams  │                │
│   └─────────┘        └─────────────────┘        └─────────┘                │
│                                                                             │
│   ┌─────────┐        ┌─────────────────┐        ┌─────────┐                │
│   │ players │───1:N──│     awards      │───N:1──│ seasons │                │
│   └─────────┘        └─────────────────┘        └─────────┘                │
│                                                                             │
│   ┌─────────┐        ┌─────────────────┐        ┌─────────┐                │
│   │ coaches │───1:N──│ coach_seasons   │───N:1──│  teams  │                │
│   └─────────┘        └─────────────────┘        └─────────┘                │
│                                                                             │
│   ┌─────────┐        ┌─────────────────┐        ┌─────────┐                │
│   │ seasons │───1:N──│ playoff_series  │───N:1──│  teams  │                │
│   └─────────┘        └─────────────────┘        └─────────┘                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. STAT COLUMN REFERENCE

### 8.1 Per Game Stats Table Columns

| Column | Description          | Formula                |
| ------ | -------------------- | ---------------------- |
| Season | Season year          | e.g., "2024-25"        |
| Age    | Player age           | Age on Feb 1           |
| Tm     | Team                 | Team abbreviation      |
| Lg     | League               | NBA/ABA                |
| Pos    | Position             | PG, SG, SF, PF, C      |
| G      | Games                | Games played           |
| GS     | Games Started        | Games started          |
| MP     | Minutes Per Game     | MP / G                 |
| FG     | Field Goals Per Game | FGM / G                |
| FGA    | Field Goal Attempts  | FGA / G                |
| FG%    | Field Goal %         | FGM / FGA              |
| 3P     | 3-Pointers Per Game  | 3PM / G                |
| 3PA    | 3-Point Attempts     | 3PA / G                |
| 3P%    | 3-Point %            | 3PM / 3PA              |
| 2P     | 2-Pointers Per Game  | 2PM / G                |
| 2PA    | 2-Point Attempts     | 2PA / G                |
| 2P%    | 2-Point %            | 2PM / 2PA              |
| eFG%   | Effective FG%        | (FGM + 0.5\*3PM) / FGA |
| FT     | Free Throws Per Game | FTM / G                |
| FTA    | Free Throw Attempts  | FTA / G                |
| FT%    | Free Throw %         | FTM / FTA              |
| ORB    | Offensive Rebounds   | ORB / G                |
| DRB    | Defensive Rebounds   | DRB / G                |
| TRB    | Total Rebounds       | TRB / G                |
| AST    | Assists Per Game     | AST / G                |
| STL    | Steals Per Game      | STL / G                |
| BLK    | Blocks Per Game      | BLK / G                |
| TOV    | Turnovers Per Game   | TOV / G                |
| PF     | Personal Fouls       | PF / G                 |
| PTS    | Points Per Game      | PTS / G                |

### 8.2 Advanced Stats Table Columns

| Column | Description              | Available Since |
| ------ | ------------------------ | --------------- |
| PER    | Player Efficiency Rating | 1951-52         |
| TS%    | True Shooting %          | 1946-47         |
| 3PAr   | 3-Point Attempt Rate     | 1979-80         |
| FTr    | Free Throw Rate          | 1946-47         |
| ORB%   | Offensive Rebound %      | 1970-71         |
| DRB%   | Defensive Rebound %      | 1970-71         |
| TRB%   | Total Rebound %          | 1970-71         |
| AST%   | Assist %                 | 1964-65         |
| STL%   | Steal %                  | 1973-74         |
| BLK%   | Block %                  | 1973-74         |
| TOV%   | Turnover %               | 1977-78         |
| USG%   | Usage %                  | 1977-78         |
| OWS    | Offensive Win Shares     | 1946-47         |
| DWS    | Defensive Win Shares     | 1973-74         |
| WS     | Win Shares               | 1946-47         |
| WS/48  | Win Shares Per 48        | 1946-47         |
| OBPM   | Offensive Box Plus/Minus | 1973-74         |
| DBPM   | Defensive Box Plus/Minus | 1973-74         |
| BPM    | Box Plus/Minus           | 1973-74         |
| VORP   | Value Over Replacement   | 1973-74         |

---

## 9. IMPLEMENTATION PRIORITY

### Phase 1: Core Foundation

1. Database schema creation
2. Player pages (basic stats)
3. Team pages (rosters, basic stats)
4. Season pages (standings, league stats)
5. Box scores

### Phase 2: Statistics Expansion

1. Advanced stats calculations
2. Player game logs
3. Player splits
4. Shooting stats
5. Team game logs

### Phase 3: Historical & Context

1. Draft pages
2. Awards pages
3. Leaders/Records
4. Playoffs structure
5. Hall of Fame

### Phase 4: Financial & Extended

1. Contracts/Salaries
2. Coach pages
3. Play-by-play data
4. Shot charts
5. International stats

---

## 10. DATA SOURCES

Potential data sources for populating your clone:

1. **NBA API** (`stats.nba.com`) - Official NBA statistics
2. **Basketball-Reference** (for reference/validation)
3. **Kaggle NBA Datasets** - Historical data compilations
4. **nba_api Python package** - Easy access to NBA stats
5. **Sports Data APIs** (Sportradar, etc.) - Commercial options
6. **Existing NBA Database** (e.g., DuckDB, PostgreSQL)

---

_This specification provides a comprehensive blueprint for building a Basketball-Reference.com clone
with accurate data structures, page layouts, and interconnections._
