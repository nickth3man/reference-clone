# Core Infrastructure Module

This module contains cross-cutting infrastructure concerns for the Basketball Reference Clone backend.

## Components

### `config.py`
Application settings using Pydantic Settings. Reads from environment variables and `.env` file.

```python
from app.core import settings

print(settings.APP_NAME)
print(settings.DB_PATH)
```

### `database.py`
DuckDB connection management with helper functions.

```python
from app.core import execute_query_df, get_db_connection

# Simple query
df = execute_query_df("SELECT * FROM players LIMIT 10")

# With parameters
df = execute_query_df("SELECT * FROM players WHERE player_id = ?", [player_id])
```

### `logging.py`
Structured JSON logging configuration.

```python
from app.core import get_logger, configure_logging

logger = get_logger(__name__)
logger.info("Processing request", extra={"player_id": "abc123"})
```

### `cache.py`
Redis caching utilities (optional - gracefully degrades if Redis unavailable).

```python
from app.core import cache_get, cache_set

# Cache a value for 5 minutes
cache_set("player:abc123", player_data, ttl=300)

# Retrieve from cache
data = cache_get("player:abc123")
```

### `rate_limit.py`
API rate limiting using SlowAPI.

```python
from app.core import limiter

@router.get("/players")
@limiter.limit("10/minute")
def get_players():
    ...
```

### `exceptions.py`
Custom exception classes for consistent error handling.

```python
from app.core.exceptions import EntityNotFoundError

if player is None:
    raise EntityNotFoundError("Player", player_id)
```

## Usage

Import commonly used items from the core module:

```python
from app.core import (
    settings,
    execute_query_df,
    get_logger,
    EntityNotFoundError,
)
```
