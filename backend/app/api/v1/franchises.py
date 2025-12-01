"""Franchise API endpoints."""

from fastapi import APIRouter, Depends, HTTPException

from app.dependencies import get_franchise_repository
from app.models import Franchise
from app.repositories.franchise_repository import FranchiseRepository

router = APIRouter()


@router.get("", response_model=list[Franchise])
def get_franchises(
    repo: FranchiseRepository = Depends(get_franchise_repository),
) -> list[Franchise]:
    """Get all franchises."""
    return repo.get_all()


@router.get("/{franchise_id}", response_model=Franchise)
def get_franchise(
    franchise_id: str,
    repo: FranchiseRepository = Depends(get_franchise_repository),
) -> Franchise:
    """Get a franchise by ID."""
    franchise = repo.get_by_id(franchise_id)
    if not franchise:
        raise HTTPException(status_code=404, detail="Franchise not found")
    return franchise
