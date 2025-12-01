"""Custom exception classes for the application."""

from typing import Any


class AppError(Exception):
    """Base exception for application errors."""

    def __init__(self, message: str, details: dict[str, Any] | None = None) -> None:
        super().__init__(message)
        self.message = message
        self.details = details or {}


class EntityNotFoundError(AppError):
    """Raised when a requested entity is not found."""

    def __init__(
        self,
        entity_type: str,
        entity_id: str,
        details: dict[str, Any] | None = None,
    ) -> None:
        message = f"{entity_type} with ID '{entity_id}' not found"
        super().__init__(message, details)
        self.entity_type = entity_type
        self.entity_id = entity_id


class DatabaseError(AppError):
    """Raised when a database operation fails."""

    def __init__(
        self,
        operation: str,
        message: str | None = None,
        details: dict[str, Any] | None = None,
    ) -> None:
        msg = f"Database error during {operation}"
        if message:
            msg += f": {message}"
        super().__init__(msg, details)
        self.operation = operation


class ValidationError(AppError):
    """Raised when input validation fails."""

    def __init__(
        self,
        field: str,
        message: str,
        details: dict[str, Any] | None = None,
    ) -> None:
        msg = f"Validation error for '{field}': {message}"
        super().__init__(msg, details)
        self.field = field
