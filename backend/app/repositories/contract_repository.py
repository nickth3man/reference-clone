"""Contract repository for data access layer."""

from typing import Any

from app.core.database import execute_query_df
from app.models import Contract
from app.repositories.base import BaseRepository


class ContractRepository(BaseRepository[Contract]):
    """Repository for contract data operations."""

    def __init__(self) -> None:
        super().__init__(Contract)

    def get_all(
        self,
        player_id: str | None = None,
        team_id: str | None = None,
        is_active: bool | None = None,
        limit: int = 100,
        offset: int = 0,
    ) -> list[Contract]:
        """Get contracts with optional filtering.

        Args:
            player_id: Filter by player
            team_id: Filter by team
            is_active: Filter by active status
            limit: Maximum number of results
            offset: Number of results to skip

        Returns:
            List of Contract objects

        """
        query = "SELECT * FROM player_contracts"
        conditions: list[str] = []
        params: list[Any] = []

        if player_id:
            conditions.append("player_id = ?")
            params.append(player_id)

        if team_id:
            conditions.append("team_id = ?")
            params.append(team_id)

        if is_active is not None:
            conditions.append("is_active = ?")
            params.append(is_active)

        if conditions:
            query += " WHERE " + " AND ".join(conditions)

        query += " ORDER BY total_value DESC NULLS LAST LIMIT ? OFFSET ?"
        params.extend([limit, offset])

        df = execute_query_df(query, params)
        return self._to_models(df)

    def get_by_id(self, contract_id: int) -> Contract | None:
        """Get a contract by ID.

        Args:
            contract_id: The contract identifier

        Returns:
            Contract or None if not found

        """
        query = "SELECT * FROM player_contracts WHERE contract_id = ?"
        df = execute_query_df(query, [contract_id])
        return self._to_model(df)

    def get_by_player(self, player_id: str) -> list[Contract]:
        """Get all contracts for a player.

        Args:
            player_id: The player identifier

        Returns:
            List of Contract objects

        """
        query = """
            SELECT * FROM player_contracts
            WHERE player_id = ?
            ORDER BY signing_date DESC
        """
        df = execute_query_df(query, [player_id])
        return self._to_models(df)

    def get_by_team(
        self,
        team_id: str,
        is_active: bool | None = None,
    ) -> list[Contract]:
        """Get all contracts for a team.

        Args:
            team_id: The team identifier
            is_active: Filter by active status

        Returns:
            List of Contract objects

        """
        query = "SELECT * FROM player_contracts WHERE team_id = ?"
        params: list[Any] = [team_id]

        if is_active is not None:
            query += " AND is_active = ?"
            params.append(is_active)

        query += " ORDER BY total_value DESC NULLS LAST"
        df = execute_query_df(query, params)
        return self._to_models(df)
