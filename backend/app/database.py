import os
from typing import Any, cast

import duckdb
import pandas as pd

DB_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    "data",
    "nba.duckdb",
)


def get_db_connection(read_only: bool = False) -> Any:
    # [REVIEW] Severity: Low. Efficiency. Consider reusing a global read-only connection for read operations.
    conn = duckdb.connect(DB_PATH, read_only=read_only)
    return conn


def execute_query(query: str, params: list[Any] | None = None, read_only: bool = True) -> list[Any]:
    conn = get_db_connection(read_only=read_only)
    try:
        if params:
            return cast(list[Any], conn.execute(query, params).fetchall())
        return cast(list[Any], conn.execute(query).fetchall())
    finally:
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
        conn.close()
