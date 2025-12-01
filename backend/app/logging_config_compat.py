"""Backward compatibility shim for logging_config module.

This module re-exports from app.core.logging for backward compatibility.
It will be deprecated in a future version.

.. deprecated::
    Use ``from app.core.logging import configure_logging, get_logger`` instead.
"""

import warnings

from app.core.logging import configure_logging, get_logger

warnings.warn(
    "Importing from 'app.logging_config' is deprecated. Use 'app.core.logging' instead.",
    DeprecationWarning,
    stacklevel=2,
)

__all__ = ["configure_logging", "get_logger"]
