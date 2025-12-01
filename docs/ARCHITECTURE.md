# Architecture Overview

## System Overview

The Basketball Reference Clone is a full-stack web application that provides NBA statistics and historical data. It consists of:

1. **Backend API** - Python/FastAPI application
2. **Frontend** - Next.js/React application  
3. **Database** - DuckDB (embedded analytical database)

```text
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│    Frontend     │────▶│    Backend      │────▶│    DuckDB       │
│   (Next.js)     │     │   (FastAPI)     │     │   (nba.duckdb)  │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
     :3000               :8000                   Embedded
```

## Backend Architecture

### Current Layer Structure

```text
┌─────────────────────────────────────────────────────────────┐
│                        main.py                              │
│                   (FastAPI Application)                     │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│    Routers      │ │     GraphQL     │ │   Middleware    │
│  (REST API)     │ │    (Strawberry) │ │  (CORS, Rate)   │
└─────────────────┘ └─────────────────┘ └─────────────────┘
              │               │
              └───────┬───────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                     Repositories                            │
│            (Data Access / Query Layer)                      │
└─────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                     database.py                             │
│              (DuckDB Connection Manager)                    │
└─────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                     nba.duckdb                              │
│                   (DuckDB Database)                         │
└─────────────────────────────────────────────────────────────┘
```

### Key Components

#### 1. Entry Point (`main.py`)

- Initializes FastAPI application
- Registers routers and middleware
- Configures CORS, rate limiting, logging
- Exception handlers

#### 2. Configuration (`config.py`)

- Uses Pydantic Settings for environment-based config
- Manages database paths, CORS origins, logging levels

#### 3. Database Layer (`database.py`)

- Singleton pattern for read-only connections
- Provides `execute_query()` and `execute_query_df()` helpers
- Uses DuckDB with pandas integration

#### 4. Routers (`routers/`)

- `teams.py` - Team endpoints
- `players.py` - Player endpoints (uses Repository pattern)
- `games.py` - Game endpoints
- `seasons.py` - Season endpoints
- `boxscores.py` - Box score endpoints
- `contracts.py` - Contract endpoints
- `draft.py` - Draft pick endpoints
- `franchises.py` - Franchise endpoints

#### 5. Repositories (`repositories/`)

- `base.py` - Generic base repository with DataFrame→Model conversion
- `player_repository.py` - Player data access
- `team_repository.py` - Team data access
- `game_repository.py` - Game data access
- `season_repository.py` - Season data access

#### 6. Models (`models.py`)

- Pydantic models for data validation
- Used for API request/response serialization
- Maps to database schema

#### 7. GraphQL (`graphql_schema.py`)

- Strawberry-based GraphQL schema
- Alternative API for flexible queries
- Mounted at `/graphql`

## Frontend Architecture

### Directory Structure

```text
frontend/src/
├── components/      # React components
│   ├── atoms/       # Basic UI elements
│   ├── molecules/   # Compound components
│   ├── Layout.tsx   # Page layout wrapper
│   ├── Navbar.tsx   # Navigation
│   └── ...
├── pages/           # Next.js pages (file-based routing)
│   ├── teams/       # Team pages
│   ├── players/     # Player pages
│   ├── games/       # Game pages
│   └── ...
├── lib/             # Utilities
│   └── api.ts       # API client
├── styles/          # CSS/Tailwind
└── types/           # TypeScript types
```

### Key Patterns

- **Atomic Design** - Components organized by complexity
- **File-based Routing** - Next.js pages directory
- **API Client** - Centralized fetch wrapper

## Database Schema

Key tables in `nba.duckdb`:

| Table | Description |
|-------|-------------|
| `players` | Player biographical data |
| `teams` | Team information |
| `franchises` | Franchise history |
| `seasons` | Season metadata |
| `games` | Game records |
| `box_scores` | Player game stats |
| `player_season_stats` | Aggregated season stats |
| `team_season_stats` | Team season records |
| `player_advanced_stats` | Advanced metrics |
| `player_contracts` | Contract data |
| `draft_picks` | Draft history |
| `awards` | Player awards |

See `backend/db/schema.sql` for complete schema.

## Data Flow

### REST API Request

```text
1. HTTP Request → FastAPI Router
2. Router validates parameters (Pydantic)
3. Router calls Repository
4. Repository executes DuckDB query
5. Repository converts DataFrame → Pydantic Model
6. Router returns JSON response
```

### GraphQL Request

```text
1. GraphQL Query → Strawberry Schema
2. Resolver executes query
3. Direct database access via execute_query_df
4. Returns typed response
```

## Scripts

### ETL Scripts (`scripts/etl/`)

Data loading scripts for populating the database:

- `load_players.py` - Load player data
- `load_teams.py` - Load team data
- `load_stats.py` - Load player statistics
- `load_seasons.py` - Load season data
- And more...

### Debug Scripts (`scripts/debug/`)

Development utilities for debugging.

### DB Inspection (`scripts/db_inspection/`)

Scripts for examining database contents.

## Deployment

### Development

```bash
# Backend
cd backend
uv sync
uv run uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

### Production (Docker)

```bash
docker-compose up
```

See `docker-compose.yml` for container configuration.

## Future Improvements

See [RESTRUCTURING_PLAN.md](./RESTRUCTURING_PLAN.md) for proposed architecture improvements.
