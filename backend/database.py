import duckdb
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "../data/nba.duckdb")

def get_db_connection(read_only=False):
    conn = duckdb.connect(DB_PATH, read_only=read_only)
    return conn

def execute_query(query, params=None, read_only=True):
    conn = get_db_connection(read_only=read_only)
    try:
        if params:
            return conn.execute(query, params).fetchall()
        return conn.execute(query).fetchall()
    finally:
        conn.close()

def execute_query_df(query, params=None, read_only=True):
    conn = get_db_connection(read_only=read_only)
    try:
        if params:
            return conn.execute(query, params).df()
        return conn.execute(query).df()
    finally:
        conn.close()
