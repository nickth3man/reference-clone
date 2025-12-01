"""Backward compatibility shim for config module.

This module re-exports from app.core.config for backward compatibility.
It will be deprecated in a future version.

.. deprecated::
    Use ``from app.core.config import settings`` instead.
"""

import warnings

from app.core.config import Settings, settings

warnings.warn(
    "Importing from 'app.config' is deprecated. Use 'app.core.config' instead.",
    DeprecationWarning,
    stacklevel=2,
)

__all__ = ["Settings", "settings"]
