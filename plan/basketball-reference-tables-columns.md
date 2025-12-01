# Basketball-Reference.com - Complete Table & Column Reference

This document provides a comprehensive breakdown of all tables that appear on Basketball-Reference.com pages, including the specific columns in each table.

---

## Table of Contents
1. [Player Page Tables](#1-player-page-tables)
2. [Team Season Page Tables](#2-team-season-page-tables)
3. [League Season Page Tables](#3-league-season-page-tables)
4. [Box Score Page Tables](#4-box-score-page-tables)
5. [Draft Page Tables](#5-draft-page-tables)
6. [Leaders Page Tables](#6-leaders-page-tables)
7. [Playoffs Page Tables](#7-playoffs-page-tables)
8. [Standings Page Tables](#8-standings-page-tables)
9. [Column Definitions Glossary](#9-column-definitions-glossary)

---

## 1. Player Page Tables

Player pages (e.g., `/players/j/jamesle01.html`) contain the following tables:

### 1.1 Per Game Stats Table
**Table ID:** `per_game`

| Column | Description |
|--------|-------------|
| Season | Year of the season (e.g., 2023-24) |
| Age | Player's age on January 31 of the season |
| Tm | Team abbreviation |
| Lg | League (NBA, ABA, BAA) |
| Pos | Position played |
| G | Games played |
| GS | Games started |
| MP | Minutes played per game |
| FG | Field goals made per game |
| FGA | Field goal attempts per game |
| FG% | Field goal percentage |
| 3P | 3-point field goals per game |
| 3PA | 3-point attempts per game |
| 3P% | 3-point percentage |
| 2P | 2-point field goals per game |
| 2PA | 2-point attempts per game |
| 2P% | 2-point percentage |
| eFG% | Effective field goal percentage |
| FT | Free throws made per game |
| FTA | Free throw attempts per game |
| FT% | Free throw percentage |
| ORB | Offensive rebounds per game |
| DRB | Defensive rebounds per game |
| TRB | Total rebounds per game |
| AST | Assists per game |
| STL | Steals per game |
| BLK | Blocks per game |
| TOV | Turnovers per game |
| PF | Personal fouls per game |
| PTS | Points per game |

### 1.2 Totals Table
**Table ID:** `totals`

Same columns as Per Game, but with season totals instead of averages:
| Column | Description |
|--------|-------------|
| Season, Age, Tm, Lg, Pos | Same as above |
| G, GS | Games played, Games started |
| MP | Total minutes played |
| FG, FGA, FG% | Field goals (total), attempts, percentage |
| 3P, 3PA, 3P% | 3-pointers (total), attempts, percentage |
| 2P, 2PA, 2P% | 2-pointers (total), attempts, percentage |
| eFG% | Effective field goal percentage |
| FT, FTA, FT% | Free throws (total), attempts, percentage |
| ORB, DRB, TRB | Rebounds (total) |
| AST, STL, BLK | Assists, steals, blocks (total) |
| TOV, PF, PTS | Turnovers, fouls, points (total) |

### 1.3 Per 36 Minutes Table
**Table ID:** `per_minute`

Same stat categories as Per Game, but normalized to 36 minutes of playing time.

### 1.4 Per 100 Possessions Table
**Table ID:** `per_poss`

Same stat categories, normalized to 100 team possessions. Additionally includes:
| Column | Description |
|--------|-------------|
| ORtg | Offensive Rating (points produced per 100 possessions) |
| DRtg | Defensive Rating (points allowed per 100 possessions) |

### 1.5 Advanced Stats Table
**Table ID:** `advanced`

| Column | Description |
|--------|-------------|
| Season | Year of the season |
| Age | Player's age |
| Tm | Team |
| Lg | League |
| Pos | Position |
| G | Games |
| MP | Minutes played |
| PER | Player Efficiency Rating |
| TS% | True Shooting Percentage |
| 3PAr | 3-Point Attempt Rate (3PA/FGA) |
| FTr | Free Throw Rate (FTA/FGA) |
| ORB% | Offensive Rebound Percentage |
| DRB% | Defensive Rebound Percentage |
| TRB% | Total Rebound Percentage |
| AST% | Assist Percentage |
| STL% | Steal Percentage |
| BLK% | Block Percentage |
| TOV% | Turnover Percentage |
| USG% | Usage Percentage |
| (blank) | Separator column |
| OWS | Offensive Win Shares |
| DWS | Defensive Win Shares |
| WS | Win Shares |
| WS/48 | Win Shares per 48 Minutes |
| (blank) | Separator column |
| OBPM | Offensive Box Plus/Minus |
| DBPM | Defensive Box Plus/Minus |
| BPM | Box Plus/Minus |
| VORP | Value Over Replacement Player |

### 1.6 Shooting Stats Table
**Table ID:** `shooting`

| Column Group | Columns |
|--------------|---------|
| **Basic** | Season, Age, Tm, Lg, Pos, G, MP, FG%, Dist. |
| **% of FGA by Distance** | %FGA 2P, %FGA 0-3, %FGA 3-10, %FGA 10-16, %FGA 16-3P, %FGA 3P |
| **FG% by Distance** | FG% 2P, FG% 0-3, FG% 3-10, FG% 10-16, FG% 16-3P, FG% 3P |
| **% of FGA by Type** | %Ast'd 2P, %Ast'd 3P |
| **Dunks** | #Dunks, %FGA Dunks |
| **Corner 3s** | 3PA Corner, 3P% Corner |
| **Heaves** | Att Heaves, Made Heaves |

**Distance Zones:**
- 0-3 ft: At the rim (layups, dunks)
- 3-10 ft: Short midrange (floaters, close jumpers)
- 10-16 ft: Mid-range
- 16-3P: Long midrange (just inside the arc)
- 3P: Three-point shots

### 1.7 Adjusted Shooting Table
**Table ID:** `adj_shooting`

| Column | Description |
|--------|-------------|
| Season, Age, Tm, Lg, Pos, G, MP | Standard identifiers |
| FG | Field Goals Made |
| FGA | Field Goal Attempts |
| FG% | Field Goal Percentage |
| 2P | 2-Point Field Goals |
| 2PA | 2-Point Attempts |
| 2P% | 2-Point Percentage |
| 3P | 3-Point Field Goals |
| 3PA | 3-Point Attempts |
| 3P% | 3-Point Percentage |
| eFG% | Effective FG% |
| FT | Free Throws |
| FTA | Free Throw Attempts |
| FT% | Free Throw Percentage |
| TS% | True Shooting % |
| FTr | Free Throw Rate |
| 3PAr | 3-Point Attempt Rate |
| FG+, 2P+, 3P+, eFG+, FT+, TS+ | League-adjusted versions (100 = league average) |
| FTr+, 3PAr+ | League-adjusted rates |

### 1.8 Play-by-Play Stats Table
**Table ID:** `pbp`

| Column | Description |
|--------|-------------|
| Season, Age, Tm, Lg, Pos, G, MP | Standard identifiers |
| PG% | % of minutes at Point Guard |
| SG% | % of minutes at Shooting Guard |
| SF% | % of minutes at Small Forward |
| PF% | % of minutes at Power Forward |
| C% | % of minutes at Center |
| OnCourt +/- | Plus/Minus when on court per 100 poss |
| On-Off +/- | Difference in +/- on vs off court |
| BadPass TO | Bad Pass Turnovers |
| LostBall TO | Lost Ball Turnovers |
| Shooting Fouls | Shooting Fouls Committed |
| Offensive Fouls | Offensive Fouls Committed |
| Shooting Fouls Drawn | Fouls Drawn |
| And-1s | And-One plays made |
| Blocked | Shots blocked by opponents |

### 1.9 Game Log Table
**Table ID:** `pgl_basic` (for a specific season)

| Column | Description |
|--------|-------------|
| Rk | Rank/Game number |
| G | Game number |
| Date | Game date |
| Age | Player age at game date |
| Tm | Player's team |
| (blank) | Home (@) or Away indicator |
| Opp | Opponent |
| Result | W/L and score |
| GS | Game started (1 or 0) |
| MP | Minutes played |
| FG, FGA, FG% | Field goals |
| 3P, 3PA, 3P% | 3-pointers |
| FT, FTA, FT% | Free throws |
| ORB, DRB, TRB | Rebounds |
| AST, STL, BLK, TOV, PF | Other counting stats |
| PTS | Points |
| GmSc | Game Score |
| +/- | Plus/Minus |

### 1.10 Splits Table
**Table ID:** `splits`

Splits tables break down stats by various categories:

| Split Category | Groupings |
|----------------|-----------|
| **Totals** | Career totals |
| **Location** | Home, Road |
| **Result** | Wins, Losses |
| **Month** | Oct, Nov, Dec, Jan, Feb, Mar, Apr, May, Jun |
| **Day of Week** | Mon-Sun |
| **Pre/Post All-Star** | Before All-Star, After All-Star |
| **Days Rest** | 0, 1, 2, 3, 4+ Days |
| **Opponent** | By opponent team |
| **Conference** | East, West |
| **Division** | Atlantic, Central, Southeast, Northwest, Pacific, Southwest |

Each split row contains: G, GS, MP, FG, FGA, FG%, 3P, 3PA, 3P%, FT, FTA, FT%, ORB, DRB, TRB, AST, STL, BLK, TOV, PF, PTS

---

## 2. Team Season Page Tables

Team season pages (e.g., `/teams/BOS/2024.html`) contain:

### 2.1 Team Info Header
| Field | Description |
|-------|-------------|
| Record | W-L record |
| Finish | Standing in conference |
| Coach | Head coach |
| Executive | GM/President |
| PTS/G | Points per game |
| Opp PTS/G | Opponent points per game |
| SRS | Simple Rating System |
| Pace | Pace factor |
| Off Rtg | Offensive Rating |
| Def Rtg | Defensive Rating |
| Net Rtg | Net Rating |
| Expected W-L | Pythagorean W-L |
| Arena | Home arena |
| Attendance | Total/Average attendance |

### 2.2 Roster Table
**Table ID:** `roster`

| Column | Description |
|--------|-------------|
| No. | Jersey number |
| Player | Player name |
| Pos | Position |
| Ht | Height |
| Wt | Weight |
| Birth Date | Date of birth |
| Country | Country of origin |
| Exp | Years of NBA experience |
| College | College attended |

### 2.3 Team Per Game Stats
**Table ID:** `per_game`

| Column | Description |
|--------|-------------|
| Rk | Rank |
| Player | Player name |
| Age | Player age |
| G, GS | Games, Games Started |
| MP | Minutes per game |
| FG, FGA, FG% | Field goals per game |
| 3P, 3PA, 3P% | 3-pointers per game |
| 2P, 2PA, 2P% | 2-pointers per game |
| eFG% | Effective FG% |
| FT, FTA, FT% | Free throws per game |
| ORB, DRB, TRB | Rebounds per game |
| AST, STL, BLK, TOV, PF, PTS | Per game stats |

### 2.4 Team Totals Table
**Table ID:** `totals`

Same columns as Per Game but with season totals.

### 2.5 Team Advanced Stats
**Table ID:** `advanced`

Same structure as player advanced stats table.

### 2.6 Team Game Log
**Table ID:** `tgl_basic`

| Column | Description |
|--------|-------------|
| Rk | Game rank |
| G | Game number |
| Date | Game date |
| (blank) | Home/Away indicator |
| Opp | Opponent |
| W/L | Result |
| Tm | Team score |
| Opp | Opponent score |
| FG, FGA, FG% | Field goals |
| 3P, 3PA, 3P% | 3-pointers |
| FT, FTA, FT% | Free throws |
| ORB, DRB, TRB | Rebounds |
| AST, STL, BLK, TOV, PF, PTS | Team stats |

### 2.7 Schedule & Results Table
**Table ID:** `games`

| Column | Description |
|--------|-------------|
| G | Game number |
| Date | Game date |
| Start (ET) | Start time |
| (blank) | Home/Away |
| Opponent | Opponent name |
| W/L | Result |
| OT | Overtime indicator |
| Tm | Team score |
| Opp | Opponent score |
| W | Wins to date |
| L | Losses to date |
| Streak | Current streak |
| Notes | Special notes (IST, etc.) |

---

## 3. League Season Page Tables

League season pages (e.g., `/leagues/NBA_2024.html`) contain:

### 3.1 League Summary
| Field | Description |
|-------|-------------|
| League Champion | Championship team |
| Most Valuable Player | MVP and stats |
| Rookie of the Year | ROY and stats |
| PPG Leader | Points per game leader |
| RPG Leader | Rebounds per game leader |
| APG Leader | Assists per game leader |
| WS Leader | Win shares leader |

### 3.2 Conference Standings
**Table ID:** `confs_standings_E` / `confs_standings_W`

| Column | Description |
|--------|-------------|
| Rk | Rank |
| Team | Team name |
| W | Wins |
| L | Losses |
| W/L% | Win percentage |
| GB | Games behind |
| PTS | Points per game |
| Opp PTS | Opponent points per game |
| SRS | Simple Rating System |

### 3.3 Divisional Standings
**Table ID:** `divs_standings_{division}`

Same columns as conference standings.

### 3.4 League Player Stats Pages

League-wide player stats are available on separate pages:

| Page | URL Pattern | Description |
|------|-------------|-------------|
| Per Game | `_per_game.html` | Per game averages |
| Totals | `_totals.html` | Season totals |
| Per 36 Minutes | `_per_minute.html` | Per 36 min stats |
| Per 100 Poss | `_per_poss.html` | Pace-adjusted |
| Advanced | `_advanced.html` | Advanced metrics |
| Shooting | `_shooting.html` | Shooting splits |
| Adjusted Shooting | `_adj_shooting.html` | League-adjusted shooting |
| Play-by-Play | `_play-by-play.html` | Position/lineup data |

All use the same column structure as player tables, with an additional `Rk` (rank) column.

---

## 4. Box Score Page Tables

Box score pages (e.g., `/boxscores/202411090MIL.html`) contain:

### 4.1 Line Score
| Column | Description |
|--------|-------------|
| Team | Team name |
| Q1, Q2, Q3, Q4 | Quarter scores |
| OT1, OT2... | Overtime scores (if applicable) |
| Total | Final score |

### 4.2 Four Factors
| Column | Description |
|--------|-------------|
| Team | Team name |
| Pace | Pace factor |
| eFG% | Effective field goal % |
| TOV% | Turnover percentage |
| ORB% | Offensive rebound % |
| FT/FGA | Free throw rate |
| ORtg | Offensive rating |

### 4.3 Basic Box Score (per team)
**Table ID:** `box-{TM}-game-basic`

| Column | Description |
|--------|-------------|
| Starters/Reserves | Section header |
| MP | Minutes played (MM:SS format) |
| FG | Field goals made |
| FGA | Field goal attempts |
| FG% | Field goal percentage |
| 3P | 3-pointers made |
| 3PA | 3-point attempts |
| 3P% | 3-point percentage |
| FT | Free throws made |
| FTA | Free throw attempts |
| FT% | Free throw percentage |
| ORB | Offensive rebounds |
| DRB | Defensive rebounds |
| TRB | Total rebounds |
| AST | Assists |
| STL | Steals |
| BLK | Blocks |
| TOV | Turnovers |
| PF | Personal fouls |
| PTS | Points |
| +/- | Plus/Minus |

### 4.4 Advanced Box Score (per team)
**Table ID:** `box-{TM}-game-advanced`

| Column | Description |
|--------|-------------|
| Player | Player name |
| MP | Minutes played |
| TS% | True shooting % |
| eFG% | Effective FG% |
| 3PAr | 3-point attempt rate |
| FTr | Free throw rate |
| ORB% | Offensive rebound % |
| DRB% | Defensive rebound % |
| TRB% | Total rebound % |
| AST% | Assist % |
| STL% | Steal % |
| BLK% | Block % |
| TOV% | Turnover % |
| USG% | Usage % |
| ORtg | Offensive rating |
| DRtg | Defensive rating |
| BPM | Box Plus/Minus |

### 4.5 Play-by-Play Table
**Table ID:** `pbp` (on separate PBP page)

| Column | Description |
|--------|-------------|
| Time | Time remaining in quarter |
| Away | Away team action |
| Score | Running score |
| Home | Home team action |

### 4.6 Shot Chart Data
Available on shot chart page - includes x/y coordinates for each shot.

---

## 5. Draft Page Tables

Draft pages (e.g., `/draft/NBA_2024.html`) contain:

### 5.1 Draft Summary
| Field | Description |
|-------|-------------|
| Date | Draft date |
| Location | Draft location |
| Number of Picks | Total picks |
| First Overall | First overall pick + WS |
| Most Win Shares | Top WS producers |
| All-Stars | Count of eventual All-Stars |

### 5.2 Draft Picks Table
**Table ID:** `stats`

| Column | Description |
|--------|-------------|
| Rk | Overall pick number |
| Pk | Pick within round |
| Tm | Drafting team |
| Player | Player name |
| College | College/Origin |
| Yrs | Years in NBA |
| G | Games played (career) |
| MP | Minutes played (career) |
| PTS | Points per game (career) |
| TRB | Rebounds per game (career) |
| AST | Assists per game (career) |
| FG% | Career FG% |
| 3P% | Career 3P% |
| FT% | Career FT% |
| MP | Total minutes (career) |
| PTS | Total points (career) |
| TRB | Total rebounds (career) |
| AST | Total assists (career) |
| WS | Career Win Shares |
| WS/48 | Win Shares per 48 min |
| BPM | Career Box Plus/Minus |
| VORP | Career VORP |

---

## 6. Leaders Page Tables

Leaders pages (e.g., `/leagues/NBA_2024_leaders.html`) contain multiple leaderboard sections:

### 6.1 Leaders Categories

| Category | Stats Shown |
|----------|-------------|
| **Points** | PTS, PPG leaders |
| **Rebounds** | TRB, RPG leaders |
| **Assists** | AST, APG leaders |
| **Steals** | STL, SPG leaders |
| **Blocks** | BLK, BPG leaders |
| **FG%** | Field goal % leaders |
| **3P%** | 3-point % leaders |
| **FT%** | Free throw % leaders |
| **Minutes** | Total minutes leaders |
| **Games** | Games played leaders |
| **Win Shares** | WS leaders |
| **PER** | PER leaders |
| **BPM** | BPM leaders |
| **VORP** | VORP leaders |

Each leaderboard shows: Rank, Player, Team, Stat Value

---

## 7. Playoffs Page Tables

Playoffs pages (e.g., `/playoffs/NBA_2024.html`) contain:

### 7.1 Playoff Bracket
Visual bracket showing series matchups and results.

### 7.2 Series Results
| Column | Description |
|--------|-------------|
| Round | Playoff round |
| Winner | Series winner |
| Loser | Series loser |
| Result | Series score (e.g., 4-2) |

### 7.3 Playoff Stats Tables
Same structure as regular season stats tables but filtered to playoff games only.

---

## 8. Standings Page Tables

### 8.1 Regular Standings
| Column | Description |
|--------|-------------|
| Team | Team name |
| W | Wins |
| L | Losses |
| W/L% | Win percentage |
| GB | Games behind |
| PW | Pythagorean wins |
| PL | Pythagorean losses |
| PS/G | Points scored per game |
| PA/G | Points allowed per game |

### 8.2 Expanded Standings
Additional columns:
| Column | Description |
|--------|-------------|
| MOV | Margin of victory |
| SOS | Strength of schedule |
| SRS | Simple rating system |
| ORtg | Offensive rating |
| DRtg | Defensive rating |
| NRtg | Net rating |
| Pace | Pace factor |
| FTr | Free throw rate |
| 3PAr | 3-point attempt rate |
| TS% | True shooting % |
| eFG% | Effective FG% |
| TOV% | Turnover % |
| ORB% | Offensive rebound % |
| FT/FGA | FT rate |
| eFG%_opp | Opponent eFG% |
| TOV%_opp | Opponent TOV% |
| DRB%_opp | Opponent defensive rebound % |
| FT/FGA_opp | Opponent FT rate |
| Attend. | Attendance |
| Attend./G | Attendance per game |

---

## 9. Column Definitions Glossary

### Basic Stats
| Stat | Formula/Description |
|------|---------------------|
| G | Games played |
| GS | Games started |
| MP | Minutes played |
| FG | Field goals made |
| FGA | Field goal attempts |
| FG% | FG / FGA |
| 3P | 3-point field goals |
| 3PA | 3-point attempts |
| 3P% | 3P / 3PA |
| 2P | 2-point field goals |
| 2PA | 2-point attempts |
| 2P% | 2P / 2PA |
| FT | Free throws made |
| FTA | Free throw attempts |
| FT% | FT / FTA |
| ORB | Offensive rebounds |
| DRB | Defensive rebounds |
| TRB | Total rebounds (ORB + DRB) |
| AST | Assists |
| STL | Steals |
| BLK | Blocks |
| TOV | Turnovers |
| PF | Personal fouls |
| PTS | Points |

### Shooting Stats
| Stat | Formula/Description |
|------|---------------------|
| eFG% | (FG + 0.5 × 3P) / FGA |
| TS% | PTS / (2 × TSA) |
| TSA | FGA + 0.44 × FTA |
| 3PAr | 3PA / FGA |
| FTr | FTA / FGA |
| Dist. | Average shot distance |

### Advanced Stats
| Stat | Formula/Description |
|------|---------------------|
| PER | Player Efficiency Rating (complex formula) |
| ORtg | Offensive Rating - Points produced per 100 poss |
| DRtg | Defensive Rating - Points allowed per 100 poss |
| OWS | Offensive Win Shares |
| DWS | Defensive Win Shares |
| WS | Win Shares (OWS + DWS) |
| WS/48 | Win Shares per 48 minutes |
| OBPM | Offensive Box Plus/Minus |
| DBPM | Defensive Box Plus/Minus |
| BPM | Box Plus/Minus (OBPM + DBPM) |
| VORP | Value Over Replacement Player |

### Rate Stats (%)
| Stat | Description |
|------|-------------|
| ORB% | % of available offensive rebounds grabbed |
| DRB% | % of available defensive rebounds grabbed |
| TRB% | % of available rebounds grabbed |
| AST% | % of teammate FGs assisted |
| STL% | % of opponent possessions ending in steal |
| BLK% | % of opponent 2PA blocked |
| TOV% | Turnovers per 100 plays |
| USG% | % of team plays used while on floor |

### Team Stats
| Stat | Formula/Description |
|------|---------------------|
| Pace | Possessions per 48 minutes |
| SRS | Simple Rating System (MOV + SOS) |
| SOS | Strength of Schedule |
| MOV | Margin of Victory (PTS - Opp PTS) |
| Net Rtg | ORtg - DRtg |

### Game Stats
| Stat | Description |
|------|-------------|
| GmSc | Game Score (Hollinger formula) |
| +/- | Plus/Minus while on court |

---

## Summary: Tables by Page Type

| Page Type | Key Tables |
|-----------|------------|
| **Player Page** | Per Game, Totals, Per 36, Per 100, Advanced, Shooting, Adjusted Shooting, Play-by-Play, Game Log, Splits |
| **Team Season** | Roster, Per Game, Totals, Advanced, Game Log, Schedule |
| **League Season** | Standings (Conf/Div), Player Stats (all types), Team Stats |
| **Box Score** | Line Score, Four Factors, Basic Box, Advanced Box, Play-by-Play |
| **Draft** | Draft Picks with career stats |
| **Leaders** | Leaderboards for all major categories |
| **Playoffs** | Bracket, Series Results, Playoff Stats |
| **Standings** | Regular, Expanded, By Date |

---

*Document compiled from Basketball-Reference.com structure analysis*
*Last updated: December 2025*
