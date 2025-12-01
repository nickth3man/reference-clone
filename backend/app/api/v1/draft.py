"""Draft API endpoints."""

from fastapi import APIRouter, Depends, Query

from app.dependencies import get_draft_repository
from app.models import DraftPick
from app.repositories.draft_repository import DraftRepository

router = APIRouter()


@router.get("/picks", response_model=list[DraftPick])
def get_draft_picks(
    year: int | None = None,
    team_id: str | None = None,
    limit: int = Query(100, ge=1, le=1000),
    offset: int = 0,
    repo: DraftRepository = Depends(get_draft_repository),
) -> list[DraftPick]:
    """Get draft picks with optional filtering."""
    return repo.get_all(
        year=year,
        team_id=team_id,
        limit=limit,
        offset=offset,
    )
