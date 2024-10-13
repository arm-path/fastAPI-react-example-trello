from datetime import datetime

from pydantic import BaseModel


class TaskBaseSchema(BaseModel):
    title: str
    description: str | None = None
    deadline: datetime | None = None


class TaskCreateSchema(TaskBaseSchema):
    pass
