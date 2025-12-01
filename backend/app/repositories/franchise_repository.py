"""Franchise repository for data access layer."""

from app.core.database import execute_query_df
from app.models import Franchise
from app.repositories.base import BaseRepository


class FranchiseRepository(BaseRepository[Franchise]):
    """Repository for franchise data operations."""

    def __init__(self) -> None:
        super().__init__(Franchise)

    def get_all(self) -> list[Franchise]:
        """Get all franchises.

        Returns:
            List of Franchise objects

        """
        query = "SELECT * FROM franchises ORDER BY original_name"
        df = execute_query_df(query)
        return self._to_models(df)

    def get_by_id(self, franchise_id: str) -> Franchise | None:
        """Get a franchise by ID.

        Args:
            franchise_id: The franchise identifier

        Returns:
            Franchise or None if not found

        """
        query = "SELECT * FROM franchises WHERE franchise_id = ?"
        df = execute_query_df(query, [franchise_id])
        return self._to_model(df)

    def get_by_current_team(self, team_id: str) -> Franchise | None:
        """Get a franchise by its current team ID.

        Args:
            team_id: The current team identifier

        Returns:
            Franchise or None if not found

        """
        query = "SELECT * FROM franchises WHERE current_team_id = ?"
        df = execute_query_df(query, [team_id])
        return self._to_model(df)
