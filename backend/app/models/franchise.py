"""Franchise-related Pydantic models."""

from pydantic import BaseModel


class Franchise(BaseModel):
    """Franchise information (historical team lineage)."""

    franchise_id: str
    current_team_id: str | None = None
    original_name: str | None = None
    founded_year: int | None = None
    total_championships: int | None = None
    total_seasons: int | None = None
    total_wins: int | None = None
    total_losses: int | None = None
