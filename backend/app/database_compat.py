"""Backward compatibility shim for database module.

This module re-exports from app.core.database for backward compatibility.
It will be deprecated in a future version.

.. deprecated::
    Use ``from app.core.database import get_db_connection, execute_query`` instead.
"""

import warnings

from app.core.database import execute_query, execute_query_df, get_db_connection

warnings.warn(
    "Importing from 'app.database' is deprecated. Use 'app.core.database' instead.",
    DeprecationWarning,
    stacklevel=2,
)

# Alias for backward compatibility
get_connection = get_db_connection

__all__ = ["get_connection", "get_db_connection", "execute_query", "execute_query_df"]
