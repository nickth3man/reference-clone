# Repositories

This directory contains the data access layer implementing the Repository pattern.

## Purpose

Repositories abstract database queries from business logic, providing:

- Clean separation of concerns
- Testability (repositories can be mocked)
- Consistent data access patterns
- Query encapsulation

## Structure

- `base.py` - Base repository class with common functionality
- `player_repository.py` - Player data access
- `team_repository.py` - Team data access
- `game_repository.py` - Game data access
- `season_repository.py` - Season data access
- `boxscore_repository.py` - Box score data access
- `contract_repository.py` - Contract data access
- `draft_repository.py` - Draft pick data access
- `franchise_repository.py` - Franchise data access

## Usage

Repositories are injected via FastAPI's dependency injection:

```python
from fastapi import APIRouter, Depends
from app.dependencies import get_player_repository
from app.repositories import PlayerRepository

router = APIRouter()

@router.get("/players/{player_id}")
def get_player(
    player_id: str,
    repo: PlayerRepository = Depends(get_player_repository),
):
    return repo.get_by_id(player_id)
```

## Base Repository

All repositories inherit from `BaseRepository` which provides:

- `get_by_id(id)` - Fetch single record by ID
- `get_all(limit, offset)` - Paginated listing
- `search(query)` - Basic search functionality
- `execute_query()` - Run arbitrary SQL

## Adding New Repositories

1. Create a new file (e.g., `new_repository.py`)
2. Inherit from `BaseRepository`
3. Define table name and ID column
4. Add domain-specific methods

```python
from app.repositories.base import BaseRepository

class NewRepository(BaseRepository):
    table_name = "new_table"
    id_column = "new_id"
    
    def get_by_custom_field(self, value: str) -> list[dict]:
        query = f"SELECT * FROM {self.table_name} WHERE field = ?"
        return self.execute_query(query, [value])
```

5. Add factory function to `app/dependencies.py`
6. Export from `__init__.py`
