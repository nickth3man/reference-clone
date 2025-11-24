import os
from typing import Any, cast

import duckdb
import pandas as pd

from app.config import settings

DB_PATH = settings.DB_PATH

_SHARED_CONNECTION = None


def get_db_connection(read_only: bool = False) -> Any:
    global _SHARED_CONNECTION
    if read_only:
        if _SHARED_CONNECTION is None:
            _SHARED_CONNECTION = duckdb.connect(DB_PATH, read_only=True)
        return _SHARED_CONNECTION
    # For write operations, create a new connection
    conn = duckdb.connect(DB_PATH, read_only=read_only)
    return conn


def execute_query(query: str, params: list[Any] | None = None, read_only: bool = True) -> list[Any]:
    conn = get_db_connection(read_only=read_only)
    try:
        if params:
            return cast(list[Any], conn.execute(query, params).fetchall())
        return cast(list[Any], conn.execute(query).fetchall())
    finally:
        if not read_only:
            conn.close()


def execute_query_df(
    query: str, params: list[Any] | None = None, read_only: bool = True
) -> pd.DataFrame:
    conn = get_db_connection(read_only=read_only)
    try:
        if params:
            return cast(pd.DataFrame, conn.execute(query, params).df())
        return cast(pd.DataFrame, conn.execute(query).df())
    finally:
        if not read_only:
            conn.close()
