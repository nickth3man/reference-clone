"""
Core infrastructure module.

This module contains cross-cutting concerns:
- config: Application settings (Pydantic Settings)
- database: DuckDB connection management
- cache: Response caching utilities
- rate_limit: API rate limiting
- logging: Structured logging configuration
- exceptions: Custom exception classes

Usage:
    from app.core import settings, get_db_connection
    from app.core.exceptions import EntityNotFoundError
"""

from app.core.config import Settings, settings
from app.core.database import execute_query, execute_query_df, get_db_connection
from app.core.logging import configure_logging, get_logger
from app.core.cache import cache_get, cache_set, get_redis_client
from app.core.rate_limit import limiter
from app.core.exceptions import (
    EntityNotFoundError,
    DatabaseError,
    ValidationError,
)

__all__ = [
    # Config
    "Settings",
    "settings",
    # Database
    "execute_query",
    "execute_query_df",
    "get_db_connection",
    # Logging
    "configure_logging",
    "get_logger",
    # Cache
    "cache_get",
    "cache_set",
    "get_redis_client",
    # Rate limiting
    "limiter",
    # Exceptions
    "EntityNotFoundError",
    "DatabaseError",
    "ValidationError",
]
