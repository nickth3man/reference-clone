"""Base model classes for the application."""

from pydantic import BaseModel, ConfigDict


class AppBaseModel(BaseModel):
    """Base model with common configuration for all models."""

    model_config = ConfigDict(
        # Allow population by field name or alias
        populate_by_name=True,
        # Validate on assignment
        validate_assignment=True,
        # Use enum values directly
        use_enum_values=True,
    )
