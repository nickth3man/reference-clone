# API Layer

This directory contains the REST API and GraphQL endpoints.

## Structure

```
api/
├── __init__.py
├── graphql/              # GraphQL implementation
│   ├── __init__.py
│   └── schema.py         # Strawberry GraphQL schema
└── v1/                   # REST API version 1
    ├── __init__.py
    ├── router.py         # Aggregated router with /api/v1 prefix
    ├── players.py        # Player endpoints
    ├── teams.py          # Team endpoints
    ├── games.py          # Game endpoints
    ├── seasons.py        # Season endpoints
    ├── boxscores.py      # Box score endpoints
    ├── contracts.py      # Contract endpoints
    ├── draft.py          # Draft endpoints
    └── franchises.py     # Franchise endpoints
```

## REST API v1

All REST endpoints are prefixed with `/api/v1`:

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/players` | List/search players |
| `GET /api/v1/players/{id}` | Get player details |
| `GET /api/v1/teams` | List teams |
| `GET /api/v1/teams/{id}` | Get team details |
| `GET /api/v1/games` | List games |
| `GET /api/v1/games/{id}` | Get game details |
| `GET /api/v1/seasons` | List seasons |
| `GET /api/v1/seasons/{year}` | Get season details |
| `GET /api/v1/boxscores/{game_id}` | Get game box score |
| `GET /api/v1/contracts` | List contracts |
| `GET /api/v1/draft/{year}` | Get draft picks |
| `GET /api/v1/franchises` | List franchises |

## GraphQL

GraphQL endpoint is available at `/graphql`:

```graphql
query {
  players(limit: 10) {
    id
    name
    currentTeam {
      name
    }
  }
  
  team(id: "LAL") {
    name
    roster {
      name
      position
    }
  }
}
```

## Dependency Injection

All routers use FastAPI's dependency injection for repositories:

```python
from fastapi import APIRouter, Depends
from app.dependencies import get_player_repository
from app.repositories import PlayerRepository

router = APIRouter(prefix="/players", tags=["Players"])

@router.get("/{player_id}")
def get_player(
    player_id: str,
    repo: PlayerRepository = Depends(get_player_repository),
):
    return repo.get_by_id(player_id)
```

## Adding New Endpoints

1. Create a new router file in `v1/`
2. Define the router with prefix and tags
3. Implement endpoints with DI
4. Add to `v1/router.py`

```python
# v1/new_router.py
from fastapi import APIRouter, Depends
from app.dependencies import get_new_repository

router = APIRouter(prefix="/new", tags=["New"])

@router.get("/")
def list_items(repo = Depends(get_new_repository)):
    return repo.get_all()
```

```python
# v1/router.py
from app.api.v1.new_router import router as new_router
router.include_router(new_router)
```

## Legacy Routes

Legacy routes (without `/api/v1` prefix) are maintained in `app/routers/`
for backward compatibility but are deprecated and will be removed in a
future version.
