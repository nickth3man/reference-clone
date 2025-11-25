from typing import Generic, TypeVar

import pandas as pd
from pydantic import BaseModel

T = TypeVar("T", bound=BaseModel)


class BaseRepository(Generic[T]):
    def __init__(self, model: type[T]) -> None:
        self.model = model

    def _to_models(self, df: pd.DataFrame) -> list[T]:
        if df.empty:
            return []
        # Replace NaN with None for Pydantic compatibility
        df = df.where(pd.notnull(df), None)
        return [self.model(**record) for record in df.to_dict(orient="records")]

    def _to_model(self, df: pd.DataFrame) -> T | None:
        models = self._to_models(df)
        return models[0] if models else None
