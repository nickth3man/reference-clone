-- Basketball-Reference Clone Schema
-- STRICTLY FOLLOWING SPECIFICATION

-- 1. Core Entity Tables

CREATE TABLE players (
    player_id VARCHAR(20) PRIMARY KEY,
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
    shoots VARCHAR(10), -- ENUM('Right', 'Left', 'Both')
    position VARCHAR(100),
    high_school VARCHAR(200),
    high_school_city VARCHAR(100),
    high_school_state VARCHAR(100),
    last_attended VARCHAR(200), -- Formerly 'college'
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
    nicknames TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE teams (
    team_id VARCHAR(10) PRIMARY KEY,
    franchise_id VARCHAR(10),
    full_name VARCHAR(100),
    abbreviation VARCHAR(5),
    nickname VARCHAR(50),
    city VARCHAR(100),
    state VARCHAR(100),
    arena VARCHAR(200),
    arena_capacity INTEGER,
    founded_year INTEGER,
    folded_year INTEGER,
    league VARCHAR(10), -- ENUM('NBA', 'ABA', 'BAA')
    conference VARCHAR(20), -- ENUM('Eastern', 'Western')
    division VARCHAR(50),
    primary_color VARCHAR(7),
    secondary_color VARCHAR(7),
    logo_url VARCHAR(500),
    is_active BOOLEAN,
    championships INTEGER DEFAULT 0
);

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

CREATE TABLE seasons (
    season_id VARCHAR(10) PRIMARY KEY,
    league VARCHAR(10), -- ENUM('NBA', 'ABA', 'BAA')
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
    ppg_leader_player_id VARCHAR(20),
    rpg_leader_player_id VARCHAR(20),
    apg_leader_player_id VARCHAR(20),
    ws_leader_player_id VARCHAR(20),
    salary_cap DECIMAL(15,2),
    luxury_tax_threshold DECIMAL(15,2),
    num_teams INTEGER
);

-- 2. Statistics Tables

CREATE SEQUENCE seq_player_season_stats_id;
CREATE TABLE player_season_stats (
    stat_id INTEGER PRIMARY KEY DEFAULT nextval('seq_player_season_stats_id'), 
    player_id VARCHAR(20),
    season_id VARCHAR(10),
    team_id VARCHAR(10),
    league VARCHAR(10), -- ENUM('NBA', 'ABA', 'BAA')
    season_type VARCHAR(20), -- ENUM('Regular', 'Playoffs', 'All-Star')
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

    -- Per 36 Minutes Stats
    points_per_36 DECIMAL(5,2),
    rebounds_per_36 DECIMAL(5,2),
    assists_per_36 DECIMAL(5,2),
    field_goals_per_36 DECIMAL(5,2),
    field_goals_attempted_per_36 DECIMAL(5,2),
    three_pointers_per_36 DECIMAL(5,2),
    three_pointers_attempted_per_36 DECIMAL(5,2),
    two_pointers_per_36 DECIMAL(5,2),
    two_pointers_attempted_per_36 DECIMAL(5,2),
    free_throws_per_36 DECIMAL(5,2),
    free_throws_attempted_per_36 DECIMAL(5,2),
    offensive_rebounds_per_36 DECIMAL(5,2),
    defensive_rebounds_per_36 DECIMAL(5,2),
    steals_per_36 DECIMAL(5,2),
    blocks_per_36 DECIMAL(5,2),
    turnovers_per_36 DECIMAL(5,2),
    personal_fouls_per_36 DECIMAL(5,2),

    -- Per 100 Possessions Stats
    points_per_100_poss DECIMAL(5,2),
    rebounds_per_100_poss DECIMAL(5,2),
    assists_per_100_poss DECIMAL(5,2),
    field_goals_per_100_poss DECIMAL(5,2),
    field_goals_attempted_per_100_poss DECIMAL(5,2),
    three_pointers_per_100_poss DECIMAL(5,2),
    three_pointers_attempted_per_100_poss DECIMAL(5,2),
    two_pointers_per_100_poss DECIMAL(5,2),
    two_pointers_attempted_per_100_poss DECIMAL(5,2),
    free_throws_per_100_poss DECIMAL(5,2),
    free_throws_attempted_per_100_poss DECIMAL(5,2),
    offensive_rebounds_per_100_poss DECIMAL(5,2),
    defensive_rebounds_per_100_poss DECIMAL(5,2),
    steals_per_100_poss DECIMAL(5,2),
    blocks_per_100_poss DECIMAL(5,2),
    turnovers_per_100_poss DECIMAL(5,2),
    personal_fouls_per_100_poss DECIMAL(5,2),
    offensive_rating DECIMAL(6,2),
    defensive_rating DECIMAL(6,2),

    FOREIGN KEY (player_id) REFERENCES players(player_id),
    FOREIGN KEY (season_id) REFERENCES seasons(season_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id)
);

CREATE SEQUENCE seq_player_advanced_stats_id;
CREATE TABLE player_advanced_stats (
    stat_id INTEGER PRIMARY KEY DEFAULT nextval('seq_player_advanced_stats_id'),
    player_id VARCHAR(20),
    season_id VARCHAR(10),
    team_id VARCHAR(10),
    season_type VARCHAR(20), -- ENUM('Regular', 'Playoffs')

    -- Efficiency Metrics
    player_efficiency_rating DECIMAL(5,2),
    true_shooting_pct DECIMAL(5,3),

    -- Shooting Rates
    three_point_attempt_rate DECIMAL(5,3),
    free_throw_rate DECIMAL(5,3),

    -- Rebounding Rates
    offensive_rebound_pct DECIMAL(5,2),
    defensive_rebound_pct DECIMAL(5,2),
    total_rebound_pct DECIMAL(5,2),

    -- Playmaking Rates
    assist_pct DECIMAL(5,2),
    steal_pct DECIMAL(5,2),
    block_pct DECIMAL(5,2),
    turnover_pct DECIMAL(5,2),
    usage_pct DECIMAL(5,2),

    -- Win Shares
    offensive_win_shares DECIMAL(6,2),
    defensive_win_shares DECIMAL(6,2),
    win_shares DECIMAL(6,2),
    win_shares_per_48 DECIMAL(5,3),

    -- Box Plus/Minus
    offensive_box_plus_minus DECIMAL(5,2),
    defensive_box_plus_minus DECIMAL(5,2),
    box_plus_minus DECIMAL(5,2),
    value_over_replacement DECIMAL(6,2),

    -- Ratings
    offensive_rating DECIMAL(6,2),
    defensive_rating DECIMAL(6,2),
    net_rating DECIMAL(6,2),

    FOREIGN KEY (player_id) REFERENCES players(player_id),
    FOREIGN KEY (season_id) REFERENCES seasons(season_id)
);

CREATE SEQUENCE seq_player_shooting_stats_id;
CREATE TABLE player_shooting_stats (
    stat_id INTEGER PRIMARY KEY DEFAULT nextval('seq_player_shooting_stats_id'),
    player_id VARCHAR(20),
    season_id VARCHAR(10),
    team_id VARCHAR(10),

    -- Distance Breakdown
    average_shot_distance DECIMAL(4,1),
    pct_fga_at_rim DECIMAL(5,3),
    fg_pct_at_rim DECIMAL(5,3),
    fga_at_rim INTEGER,
    pct_fga_3_10 DECIMAL(5,3),
    fg_pct_3_10 DECIMAL(5,3),
    fga_3_10 INTEGER,
    pct_fga_10_16 DECIMAL(5,3),
    fg_pct_10_16 DECIMAL(5,3),
    fga_10_16 INTEGER,
    pct_fga_16_3pt DECIMAL(5,3),
    fg_pct_16_3pt DECIMAL(5,3),
    fga_16_3pt INTEGER,
    fg_pct_3pt DECIMAL(5,3),
    fga_3pt INTEGER,

    -- Shot Type Breakdown
    pct_fga_2pt DECIMAL(5,3),
    pct_fga_3pt DECIMAL(5,3),
    pct_fg_assisted_2pt DECIMAL(5,3),
    pct_fg_assisted_3pt DECIMAL(5,3),

    -- Dunks and Layups
    dunks INTEGER,
    pct_fga_dunks DECIMAL(5,3),

    -- Corner 3s
    corner_3_pct DECIMAL(5,3),
    corner_3_attempts INTEGER,

    -- Heaves
    heaves_attempted INTEGER,
    heaves_made INTEGER,

    FOREIGN KEY (player_id) REFERENCES players(player_id),
    FOREIGN KEY (season_id) REFERENCES seasons(season_id)
);

CREATE SEQUENCE seq_player_play_by_play_stats_id;
CREATE TABLE player_play_by_play_stats (
    stat_id INTEGER PRIMARY KEY DEFAULT nextval('seq_player_play_by_play_stats_id'),
    player_id VARCHAR(20),
    season_id VARCHAR(10),
    team_id VARCHAR(10),

    -- Position Estimates
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
    offensive_fouls_committed INTEGER,

    -- And-1s
    and_one_attempts INTEGER,

    -- Blocked Attempts
    blocked_field_goal_attempts INTEGER,

    -- Turnovers
    bad_pass_turnovers INTEGER,
    lost_ball_turnovers INTEGER,

    FOREIGN KEY (player_id) REFERENCES players(player_id),
    FOREIGN KEY (season_id) REFERENCES seasons(season_id)
);

-- 3. Game-Level Tables

CREATE TABLE games (
    game_id VARCHAR(20) PRIMARY KEY,
    season_id VARCHAR(10),
    game_date DATE,
    game_time TIME,
    game_type VARCHAR(20), -- ENUM('Regular', 'Playoffs', 'Preseason', 'All-Star', 'NBA Cup')

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
    streak VARCHAR(10),
    notes TEXT,

    -- Playoffs Specific
    playoff_round VARCHAR(50),
    series_game_number INTEGER,

    winner_team_id VARCHAR(10),

    FOREIGN KEY (season_id) REFERENCES seasons(season_id),
    FOREIGN KEY (home_team_id) REFERENCES teams(team_id),
    FOREIGN KEY (away_team_id) REFERENCES teams(team_id)
);

CREATE SEQUENCE seq_box_scores_id;
CREATE TABLE box_scores (
    box_score_id INTEGER PRIMARY KEY DEFAULT nextval('seq_box_scores_id'),
    game_id VARCHAR(20),
    player_id VARCHAR(20),
    team_id VARCHAR(10),

    -- Playing Time
    is_starter BOOLEAN,
    minutes_played INTEGER,
    did_not_play BOOLEAN DEFAULT FALSE,
    dnp_reason VARCHAR(200),

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
    game_score DECIMAL(6,2),
    true_shooting_pct DECIMAL(5,3),
    effective_fg_pct DECIMAL(5,3),
    three_point_attempt_rate DECIMAL(5,3),
    free_throw_rate DECIMAL(5,3),
    offensive_rebound_pct DECIMAL(5,2),
    defensive_rebound_pct DECIMAL(5,2),
    total_rebound_pct DECIMAL(5,2),
    assist_pct DECIMAL(5,2),
    steal_pct DECIMAL(5,2),
    block_pct DECIMAL(5,2),
    turnover_pct DECIMAL(5,2),
    usage_pct DECIMAL(5,2),
    offensive_rating INTEGER,
    defensive_rating INTEGER,
    box_plus_minus DECIMAL(4,1),

    FOREIGN KEY (game_id) REFERENCES games(game_id),
    FOREIGN KEY (player_id) REFERENCES players(player_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id)
);

CREATE SEQUENCE seq_team_game_stats_id;
CREATE TABLE team_game_stats (
    stat_id INTEGER PRIMARY KEY DEFAULT nextval('seq_team_game_stats_id'),
    game_id VARCHAR(20),
    team_id VARCHAR(10),
    is_home BOOLEAN,

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

-- 4. Team Statistics Tables

CREATE SEQUENCE seq_team_season_stats_id;
CREATE TABLE team_season_stats (
    stat_id INTEGER PRIMARY KEY DEFAULT nextval('seq_team_season_stats_id'),
    team_id VARCHAR(10),
    season_id VARCHAR(10),
    season_type VARCHAR(20), -- ENUM('Regular', 'Playoffs')

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
    current_streak VARCHAR(10),
    home_record VARCHAR(10),
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
    simple_rating_system DECIMAL(5,2),

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

    -- Opponent Advanced
    opponent_effective_fg_pct DECIMAL(5,3),
    opponent_defensive_rebound_pct DECIMAL(5,2),
    opponent_free_throw_rate DECIMAL(5,3),

    -- Attendance
    attendance INTEGER,
    attendance_per_game INTEGER,

    -- Age
    average_age DECIMAL(4,2),

    -- Per Game & Totals
    games_played INTEGER,
    minutes_played INTEGER,
    field_goals_made INTEGER,
    field_goals_attempted INTEGER,
    field_goals_per_game DECIMAL(5,2),
    field_goals_attempted_per_game DECIMAL(5,2),
    three_pointers_made INTEGER,
    three_pointers_attempted INTEGER,
    three_pointers_per_game DECIMAL(5,2),
    three_pointers_attempted_per_game DECIMAL(5,2),
    two_pointers_made INTEGER,
    two_pointers_attempted INTEGER,
    two_point_pct DECIMAL(5,3),
    two_pointers_per_game DECIMAL(5,2),
    two_pointers_attempted_per_game DECIMAL(5,2),
    free_throws_made INTEGER,
    free_throws_attempted INTEGER,
    free_throws_per_game DECIMAL(5,2),
    free_throws_attempted_per_game DECIMAL(5,2),
    offensive_rebounds INTEGER,
    defensive_rebounds INTEGER,
    total_rebounds INTEGER,
    offensive_rebounds_per_game DECIMAL(5,2),
    defensive_rebounds_per_game DECIMAL(5,2),
    rebounds_per_game DECIMAL(5,2),
    assists INTEGER,
    assists_per_game DECIMAL(5,2),
    steals INTEGER,
    steals_per_game DECIMAL(5,2),
    blocks INTEGER,
    blocks_per_game DECIMAL(5,2),
    turnovers INTEGER,
    turnovers_per_game DECIMAL(5,2),
    personal_fouls INTEGER,
    personal_fouls_per_game DECIMAL(5,2),

    FOREIGN KEY (team_id) REFERENCES teams(team_id),
    FOREIGN KEY (season_id) REFERENCES seasons(season_id)
);

-- 5. Splits Tables

CREATE SEQUENCE seq_player_splits_id;
CREATE TABLE player_splits (
    split_id INTEGER PRIMARY KEY DEFAULT nextval('seq_player_splits_id'),
    player_id VARCHAR(20),
    season_id VARCHAR(10),

    -- Split Categories
    split_type VARCHAR(50), -- ENUM('Location', 'Result', 'Month', ...)
    split_value VARCHAR(100),

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

-- 6. Draft & Contracts Tables

CREATE SEQUENCE seq_draft_picks_id;
CREATE TABLE draft_picks (
    pick_id INTEGER PRIMARY KEY DEFAULT nextval('seq_draft_picks_id'),
    draft_year INTEGER,
    round INTEGER,
    pick_number INTEGER,
    overall_pick INTEGER,

    player_id VARCHAR(20),
    team_id VARCHAR(10),

    -- Player Info at Draft
    player_name VARCHAR(200),
    college VARCHAR(200),
    nationality VARCHAR(100),

    -- Draft Combine Measurements
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
    career_minutes_played INTEGER,
    career_points INTEGER,
    career_total_rebounds INTEGER,
    career_total_assists INTEGER,
    
    career_points_per_game DECIMAL(5,2),
    career_rebounds_per_game DECIMAL(5,2),
    career_assists_per_game DECIMAL(5,2),
    
    career_fg_pct DECIMAL(5,3),
    career_three_point_pct DECIMAL(5,3),
    career_ft_pct DECIMAL(5,3),

    career_win_shares DECIMAL(6,2),
    career_ws_per_48 DECIMAL(6,3),
    career_box_plus_minus DECIMAL(4,1),
    career_vorp DECIMAL(6,2),

    FOREIGN KEY (player_id) REFERENCES players(player_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id)
);

CREATE SEQUENCE seq_player_contracts_id;
CREATE TABLE player_contracts (
    contract_id INTEGER PRIMARY KEY DEFAULT nextval('seq_player_contracts_id'),
    player_id VARCHAR(20),
    team_id VARCHAR(10),

    contract_type VARCHAR(50),
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

CREATE SEQUENCE seq_team_payrolls_id;
CREATE TABLE team_payrolls (
    payroll_id INTEGER PRIMARY KEY DEFAULT nextval('seq_team_payrolls_id'),
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

-- 7. Awards & Records Tables

CREATE SEQUENCE seq_awards_id;
CREATE TABLE awards (
    award_id INTEGER PRIMARY KEY DEFAULT nextval('seq_awards_id'),
    season_id VARCHAR(10),
    award_type VARCHAR(100),
    player_id VARCHAR(20),
    team_id VARCHAR(10),

    -- Voting Details
    first_place_votes INTEGER,
    total_points INTEGER,
    vote_share DECIMAL(5,4),

    rank INTEGER,

    FOREIGN KEY (season_id) REFERENCES seasons(season_id),
    FOREIGN KEY (player_id) REFERENCES players(player_id)
);

CREATE SEQUENCE seq_all_nba_teams_id;
CREATE TABLE all_nba_teams (
    selection_id INTEGER PRIMARY KEY DEFAULT nextval('seq_all_nba_teams_id'),
    season_id VARCHAR(10),
    team_type VARCHAR(20), -- ENUM('All-NBA', 'All-Defensive', 'All-Rookie')
    team_number INTEGER,
    player_id VARCHAR(20),
    position VARCHAR(20),

    FOREIGN KEY (season_id) REFERENCES seasons(season_id),
    FOREIGN KEY (player_id) REFERENCES players(player_id)
);

CREATE SEQUENCE seq_hall_of_fame_id;
CREATE TABLE hall_of_fame (
    hof_id INTEGER PRIMARY KEY DEFAULT nextval('seq_hall_of_fame_id'),
    player_id VARCHAR(20),
    induction_year INTEGER,
    category VARCHAR(50),

    FOREIGN KEY (player_id) REFERENCES players(player_id)
);

-- 8. Playoffs Tables

CREATE SEQUENCE seq_playoff_series_id;
CREATE TABLE playoff_series (
    series_id INTEGER PRIMARY KEY DEFAULT nextval('seq_playoff_series_id'),
    season_id VARCHAR(10),
    round VARCHAR(50),
    conference VARCHAR(20), -- ENUM('Eastern', 'Western')

    higher_seed_team_id VARCHAR(10),
    lower_seed_team_id VARCHAR(10),

    higher_seed_wins INTEGER,
    lower_seed_wins INTEGER,

    winner_team_id VARCHAR(10),
    series_result VARCHAR(10),

    FOREIGN KEY (season_id) REFERENCES seasons(season_id),
    FOREIGN KEY (higher_seed_team_id) REFERENCES teams(team_id),
    FOREIGN KEY (lower_seed_team_id) REFERENCES teams(team_id)
);

-- 9. Coaches & Executives Tables

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

CREATE SEQUENCE seq_coach_seasons_id;
CREATE TABLE coach_seasons (
    coach_season_id INTEGER PRIMARY KEY DEFAULT nextval('seq_coach_seasons_id'),
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

-- 3. New Tables based on Specification

CREATE TABLE game_play_by_play (
    event_id SERIAL PRIMARY KEY,
    game_id VARCHAR(20),
    quarter INTEGER,
    time_remaining VARCHAR(10), -- MM:SS
    away_action TEXT,
    score VARCHAR(20),
    home_action TEXT,
    
    FOREIGN KEY (game_id) REFERENCES games(game_id)
);

CREATE TABLE shot_chart_data (
    shot_id SERIAL PRIMARY KEY,
    game_id VARCHAR(20),
    player_id VARCHAR(20),
    team_id VARCHAR(10),
    quarter INTEGER,
    time_remaining VARCHAR(10),
    x_coordinate DECIMAL(5,2),
    y_coordinate DECIMAL(5,2),
    shot_type VARCHAR(50), -- 2P, 3P
    distance_ft INTEGER,
    is_make BOOLEAN,
    
    FOREIGN KEY (game_id) REFERENCES games(game_id),
    FOREIGN KEY (player_id) REFERENCES players(player_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id)
);

CREATE SEQUENCE seq_player_adjusted_shooting_id;
CREATE TABLE player_adjusted_shooting (
    stat_id INTEGER PRIMARY KEY DEFAULT nextval('seq_player_adjusted_shooting_id'),
    player_id VARCHAR(20),
    season_id VARCHAR(10),
    team_id VARCHAR(10),
    
    -- Basic Shooting (Repeated for convenience or join)
    fg_made INTEGER,
    fg_attempted INTEGER,
    fg_pct DECIMAL(5,3),
    fg2_made INTEGER,
    fg2_attempted INTEGER,
    fg2_pct DECIMAL(5,3),
    fg3_made INTEGER,
    fg3_attempted INTEGER,
    fg3_pct DECIMAL(5,3),
    efg_pct DECIMAL(5,3),
    ft_made INTEGER,
    ft_attempted INTEGER,
    ft_pct DECIMAL(5,3),
    ts_pct DECIMAL(5,3),
    ft_rate DECIMAL(5,3),
    fg3_rate DECIMAL(5,3),
    
    -- League Adjusted (100 = League Average)
    fg_plus INTEGER,
    fg2_plus INTEGER,
    fg3_plus INTEGER,
    efg_plus INTEGER,
    ft_plus INTEGER,
    ts_plus INTEGER,
    ft_rate_plus INTEGER,
    fg3_rate_plus INTEGER,
    
    FOREIGN KEY (player_id) REFERENCES players(player_id),
    FOREIGN KEY (season_id) REFERENCES seasons(season_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id)
);

CREATE SEQUENCE seq_league_season_averages_id;
CREATE TABLE league_season_averages (
    stat_id INTEGER PRIMARY KEY DEFAULT nextval('seq_league_season_averages_id'),
    season_id VARCHAR(10),
    league VARCHAR(10),
    
    -- Player Averages
    avg_age DECIMAL(4,1),
    avg_height_inches DECIMAL(5,2),
    avg_weight_lbs DECIMAL(5,2),
    
    -- Per Game Averages
    points_pg DECIMAL(5,1),
    rebounds_pg DECIMAL(5,1),
    assists_pg DECIMAL(5,1),
    steals_pg DECIMAL(5,1), -- Available since 1973-74
    blocks_pg DECIMAL(5,1), -- Available since 1973-74
    turnovers_pg DECIMAL(5,1), -- Available since 1973-74
    
    -- Shooting Averages
    fg_pct DECIMAL(5,3),
    fg3_pct DECIMAL(5,3), -- Available since 1979-80
    ft_pct DECIMAL(5,3),
    
    -- Pace/Rating
    pace DECIMAL(5,1),
    off_rating DECIMAL(5,1),
    def_rating DECIMAL(5,1),
    
    FOREIGN KEY (season_id) REFERENCES seasons(season_id)
);
