# Models

This directory contains Pydantic models for data validation and serialization.

## Structure

Models are organized by domain:

- `base.py` - Base model class with common configuration
- `player.py` - Player, PlayerSeasonStats, PlayerAdvancedStats, etc.
- `team.py` - Team, TeamSeasonStats, TeamRoster, Standings
- `game.py` - Game, BoxScore, TeamGameStats, GameStats
- `season.py` - Season, PlayoffSeries, Award
- `contract.py` - Contract
- `draft.py` - DraftPick
- `franchise.py` - Franchise

## Usage

```python
from app.models import Player, Team, Game

# Models are used for:
# 1. Response validation in routers
# 2. Type hints throughout the codebase
# 3. Automatic OpenAPI schema generation
```

## Base Model

All models inherit from `AppBaseModel` which provides:

- `from_attributes = True` - Allows creation from ORM objects
- Consistent JSON serialization
- Common validation behavior

## Adding New Models

1. Create a new file in this directory (e.g., `new_domain.py`)
2. Inherit from `AppBaseModel`
3. Export from `__init__.py`

```python
from app.models.base import AppBaseModel

class NewModel(AppBaseModel):
    id: int
    name: str
```
