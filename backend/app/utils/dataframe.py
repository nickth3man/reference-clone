"""DataFrame utility functions.

Provides helper functions for working with pandas DataFrames,
particularly for Pydantic model compatibility.
"""

from typing import Any

import pandas as pd


def clean_nan(df: pd.DataFrame) -> pd.DataFrame:
    """Replace NaN values with None for Pydantic compatibility.

    Pydantic doesn't handle numpy NaN values well, so we need to
    convert them to Python None before creating model instances.

    Args:
        df: DataFrame with potential NaN values

    Returns:
        DataFrame with NaN replaced by None

    """
    if df.empty:
        return df
    # Cast to object so pandas will keep None (and drop NaT) instead of NaN
    return df.astype(object).where(pd.notnull(df), None)


def df_to_records(df: pd.DataFrame) -> list[dict[str, Any]]:
    """Convert DataFrame to list of records, handling NaN values.

    This is a convenience function that combines clean_nan and
    to_dict(orient="records") which is a common pattern in the codebase.

    Args:
        df: DataFrame to convert

    Returns:
        List of dictionaries, one per row

    """
    if df.empty:
        return []
    cleaned = clean_nan(df)
    return cleaned.to_dict(orient="records")  # type: ignore[return-value]


def df_to_single_record(df: pd.DataFrame) -> dict[str, Any] | None:
    """Convert first row of DataFrame to a single record.

    Args:
        df: DataFrame to convert

    Returns:
        Dictionary representing the first row, or None if empty

    """
    records = df_to_records(df)
    return records[0] if records else None
