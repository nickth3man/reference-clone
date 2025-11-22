# Implementation Plan

[Overview]
The goal is to build a full-stack clone of Basketball-Reference.com by implementing a clean, normalized database schema as defined in the project specification, migrating existing data into this new structure, and expanding the backend/frontend to support comprehensive player, team, and season statistics.
The project will transition from the current prototype state to a structured application with a dedicated "Silver" layer database schema (the optimized clone schema) populated from the existing "Bronze" layer raw data. This ensures long-term maintainability and alignment with the detailed specification.

[Types]
We will transition from loose dictionary-based typing to strict Pydantic models (Backend) and TypeScript interfaces (Frontend) that mirror the new database schema.
- **Backend**: Create Pydantic models for `Player`, `Team`, `Season`, `Game`, `PlayerSeasonStats`, `TeamSeasonStats` in `backend/app/models.py` ensuring all fields from the SQL spec are represented with correct types (enums for positions, leagues).
- **Frontend**: Create matching TypeScript interfaces in `frontend/src/types/index.ts` to ensure type safety across the network boundary.

[Files]
We will create new database migration scripts and significantly expand the application structure.

**New Files:**
- `backend/app/schemas.py`: For Pydantic models (separating from DB models if using ORM, or just clean API schemas).
- `backend/db/schema.sql`: The source of truth for the new database structure (containing the `CREATE TABLE` statements from the spec).
- `backend/scripts/etl/`: Directory for migration scripts.
    - `migrate_schema.py`: Script to execute the `schema.sql` against the DuckDB instance.
    - `load_players.py`: ETL script to transform `common_player_info`/`player` -> `players`.
    - `load_teams.py`: ETL script to transform `team`/`team_details` -> `teams`.
    - `load_games.py`: ETL script to transform `game`/`game_info` -> `games`.
    - `load_stats.py`: ETL script to aggregate and transform `player_stats_per_game` -> `player_season_stats`.
- `frontend/src/types/index.ts`: Central location for shared TypeScript interfaces.
- `frontend/src/pages/teams/[team_id]/[year].tsx`: Team season detail page.
- `frontend/src/pages/leagues/NBA_[year].tsx`: Season summary page.
- `frontend/src/components/Table.tsx`: Reusable sortable table component for stats.

**Modified Files:**
- `backend/app/models.py`: Update to reflect the new schema.
- `backend/app/routers/players.py`: Update queries to target the new `players` and `player_season_stats` tables.
- `backend/app/routers/teams.py`: Implement endpoints using the new `teams` table.
- `frontend/src/lib/api.ts`: Add typed fetch functions for new endpoints.

[Functions]
We will implement ETL functions to transform data and API functions to serve it.

**New Functions (ETL):**
- `migrate()` in `backend/scripts/etl/migrate_schema.py`: Executes DDL.
- `transform_player(row)` in `backend/scripts/etl/load_players.py`: Maps raw columns to new schema columns (e.g., parsing `birthdate`, normalizing `position`).
- `transform_game(row)`: Normalizes game data.
- `calculate_advanced_stats(row)`: (Phase 2) Implementation of formulas for PER, TS%, etc.

**Modified Functions (API):**
- `get_player(player_id)`: Switch from querying `common_player_info` to `players`.
- `get_player_stats(player_id)`: Switch from `player_stats_per_game` to `player_season_stats`.

[Classes]
We will define the core data models.

**New Classes:**
- `PlayerSchema`, `TeamSchema`, `GameSchema` (Pydantic models).
- `StatParams` (Dependency class for filtering stats by season, team, etc.).

[Dependencies]
No new external dependencies are required; we will utilize the existing `duckdb`, `fastapi`, and `pandas` libraries.

[Implementation Order]
We will proceed in logical phases: Schema & Data -> Backend API -> Frontend UI.

1.  **Database Schema**: Create `schema.sql` from the spec and apply it to the DuckDB database (creating new tables alongside old ones).
2.  **ETL - Core Entities**: Write and run scripts to populate `teams` and `players` tables from existing data.
3.  **ETL - Stats & Games**: Write and run scripts to populate `games` and `player_season_stats`.
4.  **Backend Models**: Update Pydantic models to match the new schema.
5.  **API - Players**: Update player endpoints to use new tables.
6.  **API - Teams**: Implement team endpoints.
7.  **Frontend - Types**: Define TS interfaces.
8.  **Frontend - Player Page**: Update to display full bio and stats.
9.  **Frontend - Team Page**: Create team season view.
