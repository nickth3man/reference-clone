"""DuckDB database connection management."""

from typing import Any, cast

import duckdb
import pandas as pd

from app.core.config import settings

DB_PATH = settings.DB_PATH

_shared_connection: duckdb.DuckDBPyConnection | None = None


def get_db_connection(read_only: bool = False) -> duckdb.DuckDBPyConnection:
    """Get a database connection.

    Args:
        read_only: If True, returns a shared read-only connection.
                  If False, creates a new connection for write operations.

    Returns:
        DuckDB connection instance

    """
    global _shared_connection
    if read_only:
        if _shared_connection is None:
            _shared_connection = duckdb.connect(DB_PATH, read_only=True)
        return _shared_connection
    # For write operations, create a new connection
    conn = duckdb.connect(DB_PATH, read_only=read_only)
    return conn


def execute_query(
    query: str, params: list[Any] | None = None, read_only: bool = True
) -> list[Any]:
    """Execute a query and return results as a list.

    Args:
        query: SQL query string
        params: Query parameters
        read_only: Whether to use a read-only connection

    Returns:
        List of query results

    """
    conn = get_db_connection(read_only=read_only)
    try:
        if params:
            return cast(list[Any], conn.execute(query, params).fetchall())
        return cast(list[Any], conn.execute(query).fetchall())
    finally:
        if not read_only:
            conn.close()


def execute_query_df(
    query: str,
    params: list[Any] | None = None,
    read_only: bool = True,
) -> pd.DataFrame:
    """Execute a query and return results as a DataFrame.

    Args:
        query: SQL query string
        params: Query parameters
        read_only: Whether to use a read-only connection

    Returns:
        DataFrame with query results

    """
    conn = get_db_connection(read_only=read_only)
    try:
        if params:
            return cast(pd.DataFrame, conn.execute(query, params).df())
        return cast(pd.DataFrame, conn.execute(query).df())
    finally:
        if not read_only:
            conn.close()
