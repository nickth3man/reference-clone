"""Core infrastructure module.

This module contains cross-cutting concerns:
- config: Application settings (Pydantic Settings)
- database: DuckDB connection management
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
from app.core.rate_limit import limiter
from app.core.exceptions import (
    EntityNotFoundError,
    DatabaseError,
    ValidationError,
)

__all__ = [
    "DatabaseError",
    "EntityNotFoundError",
    "Settings",
    "ValidationError",
    "configure_logging",
    "execute_query",
    "execute_query_df",
    "get_db_connection",
    "get_logger",
    "limiter",
    "settings",
]
