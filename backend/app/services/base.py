"""Base service class."""

from typing import Any, Generic, TypeVar

from pydantic import BaseModel

from app.repositories.base import BaseRepository

T = TypeVar("T", bound=BaseModel)
R = TypeVar("R", bound=BaseRepository[Any])


class BaseService(Generic[T, R]):
    """Base service class providing common service patterns.

    Services coordinate between repositories and implement business logic.

    Type Parameters:
        T: The primary model type this service works with
        R: The repository type

    """

    def __init__(self, repository: R) -> None:
        """Initialize the service with a repository.

        Args:
            repository: The repository instance for data access

        """
        self.repository = repository
