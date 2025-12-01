"""Backward compatibility shim for rate_limit module.

This module re-exports from app.core.rate_limit for backward compatibility.
It will be deprecated in a future version.

.. deprecated::
    Use ``from app.core.rate_limit import limiter`` instead.
"""

import warnings

from app.core.rate_limit import limiter

warnings.warn(
    "Importing from 'app.rate_limit' is deprecated. Use 'app.core.rate_limit' instead.",
    DeprecationWarning,
    stacklevel=2,
)

__all__ = ["limiter"]
