from typing import Any, Generic, TypeVar

from pydantic import BaseModel

from app.repositories.base import BaseRepository

T = TypeVar("T", bound=BaseModel)
R = TypeVar("R", bound=BaseRepository[Any])


class BaseService(Generic[T, R]):
    def __init__(self, repository: R) -> None:
        self.repository = repository

    def get_all(self, limit: int = 50, offset: int = 0) -> list[T]:
        # This assumes the repository has a generic get_all or similar method
        # For now, we'll leave it abstract or implement specific methods in subclasses
        raise NotImplementedError("Subclasses must implement get_all")

    def get_by_id(self, id: str) -> T | None:
        # Subclasses should implement this if needed
        raise NotImplementedError("Subclasses must implement get_by_id")
