# Services

This directory contains the business logic layer.

## Purpose

Services encapsulate complex business operations, providing:

- Orchestration of multiple repositories
- Business rule implementation
- Data transformation and aggregation
- Caching strategies

## Structure

- `base.py` - Base service class with common utilities
- `player.py` - Player-related business logic
- `team.py` - Team-related business logic
- `game.py` - Game-related business logic
- `season.py` - Season-related business logic
- `stats.py` - Statistical calculations and comparisons

## Usage

Services can be instantiated directly or via dependency injection:

```python
from app.services import PlayerService
from app.repositories import PlayerRepository

# Direct instantiation
repo = PlayerRepository()
service = PlayerService(repo)
summary = service.get_player_career_summary("jamesle01")

# Or use in routers with DI
from fastapi import Depends
from app.dependencies import get_player_repository

@router.get("/players/{player_id}/summary")
def get_summary(
    player_id: str,
    repo: PlayerRepository = Depends(get_player_repository),
):
    service = PlayerService(repo)
    return service.get_player_career_summary(player_id)
```

## Available Services

### PlayerService
- `get_player(player_id)` - Get player with stats
- `search_players(query, limit)` - Search players by name
- `get_player_career_summary(player_id)` - Career totals and averages
- `get_player_season_comparison(player_id, seasons)` - Compare across seasons

### TeamService
- `get_team(team_id)` - Get team with current roster
- `get_active_teams()` - All active NBA teams
- `get_team_current_roster(team_id)` - Current season roster
- `get_team_franchise_history(team_id)` - Historical franchise data

### GameService
- `get_game(game_id)` - Get game details
- `get_game_with_details(game_id)` - Game with full box scores
- `get_recent_games(limit)` - Most recent games
- `get_game_leaders(game_id)` - Top performers in a game

### SeasonService
- `get_season(year)` - Season details
- `get_current_season()` - Current NBA season
- `get_standings(year)` - Full league standings
- `get_season_summary(year)` - Season overview with stats

### StatsService
- `get_league_averages(year)` - League-wide averages
- `get_percentile_rank(value, stat, year)` - Percentile for a stat
- `compare_players(player_ids, year)` - Side-by-side comparison
- `get_team_comparison(team_ids, year)` - Team comparison

## Adding New Services

1. Create a new file (e.g., `new_service.py`)
2. Inherit from `BaseService`
3. Inject required repositories
4. Implement business methods

```python
from app.services.base import BaseService
from app.repositories import SomeRepository

class NewService(BaseService):
    def __init__(self, repository: SomeRepository):
        self.repository = repository
    
    def complex_operation(self, id: str) -> dict:
        # Business logic here
        data = self.repository.get_by_id(id)
        return self._transform(data)
```

5. Export from `__init__.py`
