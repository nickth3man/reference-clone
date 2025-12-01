"""Contract API endpoints."""

from fastapi import APIRouter, Depends, Query

from app.dependencies import get_contract_repository
from app.models import Contract
from app.repositories.contract_repository import ContractRepository

router = APIRouter()


@router.get("", response_model=list[Contract])
def get_contracts(
    player_id: str | None = None,
    team_id: str | None = None,
    is_active: bool | None = None,
    limit: int = Query(100, ge=1, le=1000),
    offset: int = 0,
    repo: ContractRepository = Depends(get_contract_repository),
) -> list[Contract]:
    """Get contracts with optional filtering."""
    return repo.get_all(
        player_id=player_id,
        team_id=team_id,
        is_active=is_active,
        limit=limit,
        offset=offset,
    )
