# Implementation Plan - Phase 1 Completion: Core Foundation

[Overview]
Complete the "Core Foundation" phase of the Basketball Reference Clone by implementing missing Season and Box Score functionality, and finalizing Player and Team features.
This implementation will bridge the gap between the existing basic schema/API and the comprehensive requirements for Phase 1, enabling full navigation between Players, Teams, Seasons, and Games.

[Types]
Define Pydantic models and TypeScript interfaces for Seasons and Box Scores to match the database schema.
- **Backend (Pydantic)**: Add `Season`, `SeasonStats`, `BoxScoreAdvanced`, `Standings` models. Update `Game` to include full score details.
- **Frontend (TypeScript)**: Add `Season`, `Standings`, `BoxScore` interfaces matching the backend.

[Files]
Create new router and page files for Seasons and Box Scores, and update existing ones.

1.  **New Backend Files**
    *   `backend/app/routers/seasons.py`: Endpoints for season details, standings, and leaders.
    *   `backend/app/routers/boxscores.py`: Endpoints for game box scores.

2.  **New Frontend Files**
    *   `frontend/src/pages/leagues/index.tsx`: Index of all seasons.
    *   `frontend/src/pages/leagues/[season_id].tsx`: Specific season page (standings, leaders).
    *   `frontend/src/pages/boxscores/[game_id].tsx`: Detailed box score page.
    *   `frontend/src/types/season.ts`: Season-related type definitions.
    *   `frontend/src/types/boxscore.ts`: Box score type definitions.

3.  **Modified Files**
    *   `backend/app/main.py`: Register new routers.
    *   `backend/app/models.py`: Add missing Pydantic models.
    *   `frontend/src/types/index.ts`: Export new types.

[Functions]
Implement API endpoints and frontend data fetching functions.

1.  **Backend Functions**
    *   `get_season(season_id)`: Retrieve season metadata.
    *   `get_standings(season_id)`: Calculate and return team standings.
    *   `get_box_score(game_id)`: Retrieve player and team stats for a specific game.
    *   `get_team_schedule(team_id, season_id)`: Add to existing teams router.

2.  **Frontend Functions**
    *   `getServerSideProps` in new pages: Fetch data for Seasons and Box Scores.
    *   `SeasonHeader` component: Display season summary.
    *   `BoxScoreTable` component: Reusable table for home/away team stats.

[Classes]
No new classes required beyond Pydantic models and React Components.

[Dependencies]
No new external dependencies required.

[Implementation Order]
Implement backend support first, then build corresponding frontend pages, starting with Seasons and moving to Box Scores.

1.  Define Pydantic models for Seasons and Box Scores in `backend/app/models.py`.
2.  Implement `backend/app/routers/seasons.py` with standings endpoints.
3.  Implement `backend/app/routers/boxscores.py` with game stat endpoints.
4.  Register new routers in `backend/app/main.py`.
5.  Define TypeScript interfaces in `frontend/src/types`.
6.  Create `frontend/src/pages/leagues` pages (index and [season_id]).
7.  Create `frontend/src/pages/boxscores` page.
8.  Validate navigation links between Teams, Players, and the new Season/Box Score pages.
