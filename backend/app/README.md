# Backend Application Structure

This directory contains the FastAPI backend application for the Basketball Reference Clone.

## Directory Structure

```
app/
├── api/                    # API layer (routers, GraphQL)
│   ├── graphql/           # GraphQL schema and resolvers
│   └── v1/                # REST API v1 endpoints
├── core/                   # Core infrastructure
│   ├── cache.py           # Redis caching utilities
│   ├── config.py          # Application settings
│   ├── database.py        # DuckDB connection management
│   ├── exceptions.py      # Custom exception classes
│   ├── logging.py         # Logging configuration
│   └── rate_limit.py      # Rate limiting setup
├── dependencies.py         # FastAPI dependency injection
├── models/                 # Pydantic data models
│   ├── player.py          # Player-related models
│   ├── team.py            # Team-related models
│   ├── game.py            # Game and boxscore models
│   ├── season.py          # Season and award models
│   ├── contract.py        # Contract models
│   ├── draft.py           # Draft pick models
│   └── franchise.py       # Franchise models
├── repositories/           # Data access layer
│   ├── base.py            # Base repository class
│   ├── player_repository.py
│   ├── team_repository.py
│   ├── game_repository.py
│   ├── season_repository.py
│   ├── boxscore_repository.py
│   ├── contract_repository.py
│   ├── draft_repository.py
│   └── franchise_repository.py
├── routers/                # Legacy routers (deprecated)
├── services/               # Business logic layer
│   ├── base.py            # Base service class
│   ├── player.py          # Player business logic
│   ├── team.py            # Team business logic
│   ├── game.py            # Game business logic
│   ├── season.py          # Season business logic
│   └── stats.py           # Statistics utilities
├── utils/                  # Utility functions
│   ├── dataframe.py       # DataFrame utilities
│   └── dates.py           # Date/season utilities
└── main.py                 # Application entry point
```

## Architecture

The application follows a layered architecture:

1. **API Layer** (`api/`): Handles HTTP requests/responses, validation, and routing
2. **Service Layer** (`services/`): Contains business logic and orchestrates repositories
3. **Repository Layer** (`repositories/`): Data access abstraction over DuckDB
4. **Core Layer** (`core/`): Infrastructure concerns (config, logging, database)

## Key Patterns

- **Dependency Injection**: Uses FastAPI's `Depends()` for loose coupling
- **Repository Pattern**: Abstracts data access from business logic
- **Service Layer**: Encapsulates complex business operations
- **Pydantic Models**: Strong typing and validation throughout

## API Versioning

The API is versioned with `/api/v1` prefix. Legacy routes (without version prefix)
are maintained for backward compatibility but are deprecated.

## Configuration

Environment variables are managed through `app/core/config.py`:

- `DB_PATH`: Path to DuckDB database file
- `REDIS_URL`: Redis connection URL (optional)
- `CORS_ORIGINS`: Allowed CORS origins
- `LOG_LEVEL`: Logging level

## Running

```bash
# Development
uvicorn app.main:app --reload

# Production
uvicorn app.main:app --host 0.0.0.0 --port 8000
```
