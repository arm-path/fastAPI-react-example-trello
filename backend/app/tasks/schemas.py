from datetime import datetime

from pydantic import BaseModel


class TaskBaseSchema(BaseModel):
    title: str
    deadline: datetime | None = None


class TaskCreateSchema(TaskBaseSchema):
    dashboard_id: int
    description: str | None = None


class TaskUpdateSchema(TaskBaseSchema):
    dashboard_id: int
    description: str | None = None
