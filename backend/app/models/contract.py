"""Contract-related Pydantic models."""

from datetime import datetime

from pydantic import BaseModel


class Contract(BaseModel):
    """Player contract information."""

    contract_id: int
    player_id: str | None = None
    team_id: str | None = None
    contract_type: str | None = None
    signing_date: datetime | None = None
    total_value: float | None = None
    years: int | None = None
    year_1_salary: float | None = None
    year_2_salary: float | None = None
    year_3_salary: float | None = None
    year_4_salary: float | None = None
    year_5_salary: float | None = None
    year_6_salary: float | None = None
    guaranteed_money: float | None = None
    is_active: bool | None = None
