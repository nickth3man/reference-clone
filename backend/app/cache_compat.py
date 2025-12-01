"""Backward compatibility shim for cache module.

This module re-exports from app.core.cache for backward compatibility.
It will be deprecated in a future version.

.. deprecated::
    Use ``from app.core.cache import cache_get, cache_set`` instead.
"""

import warnings

from app.core.cache import (
    cache_clear_pattern,
    cache_delete,
    cache_get,
    cache_set,
    get_redis_client,
)

warnings.warn(
    "Importing from 'app.cache' is deprecated. Use 'app.core.cache' instead.",
    DeprecationWarning,
    stacklevel=2,
)

__all__ = [
    "get_redis_client",
    "cache_get",
    "cache_set",
    "cache_delete",
    "cache_clear_pattern",
]
