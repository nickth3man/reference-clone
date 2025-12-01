"""Backward compatibility shim for database module.

This module re-exports from app.core.database for backward compatibility.
It will be deprecated in a future version.

.. deprecated::
    Use ``from app.core.database import get_connection, execute_query`` instead.
"""

import warnings

from app.core.database import execute_query, execute_query_df, get_connection

warnings.warn(
    "Importing from 'app.database' is deprecated. Use 'app.core.database' instead.",
    DeprecationWarning,
    stacklevel=2,
)

__all__ = ["get_connection", "execute_query", "execute_query_df"]
