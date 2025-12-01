"""Date utility functions.

Provides helper functions for working with dates,
particularly NBA season calculations.
"""

from datetime import datetime


def get_current_season() -> str:
    """Calculate the current NBA season year.

    NBA seasons span two calendar years (e.g., 2024-25 season).
    The season typically starts in October.

    - If we're in October or later, the season ID is next year
      (e.g., in Oct 2024, the season is "2025")
    - If we're before October, we're still in the previous season
      (e.g., in Jan 2025, the season is "2025")

    Returns:
        Season ID string (e.g., "2025" for the 2024-25 season)

    """
    now = datetime.now()
    # NBA season typically starts in October
    if now.month >= 10:
        return str(now.year + 1)
    return str(now.year)


def get_season_display_name(season_id: str) -> str:
    """Convert a season ID to a display name.

    Args:
        season_id: The season identifier (e.g., "2025")

    Returns:
        Display name (e.g., "2024-25")

    """
    try:
        end_year = int(season_id)
        start_year = end_year - 1
        return f"{start_year}-{str(end_year)[2:]}"
    except ValueError:
        return season_id


def season_to_year_range(season_id: str) -> tuple[int, int]:
    """Convert a season ID to start and end years.

    Args:
        season_id: The season identifier (e.g., "2025")

    Returns:
        Tuple of (start_year, end_year)

    """
    try:
        end_year = int(season_id)
        start_year = end_year - 1
        return (start_year, end_year)
    except ValueError:
        # Default to current season if parsing fails
        current = get_current_season()
        end_year = int(current)
        return (end_year - 1, end_year)
