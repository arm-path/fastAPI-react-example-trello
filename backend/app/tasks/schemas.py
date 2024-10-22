from datetime import datetime

from pydantic import BaseModel

from app.users.schemas import UserInformationSchema


class TaskBaseSchema(BaseModel):
    title: str
    deadline: datetime | None = None


class TaskCreateSchema(TaskBaseSchema):
    dashboard_id: int
    description: str | None = None


class TaskUpdateSchema(TaskBaseSchema):
    description: str | None = None


class TaskDetailSchema(TaskCreateSchema):
    created: datetime
    updated: datetime
    id: int
    index: int
    creator: UserInformationSchema


class TaskMovingSchema(BaseModel):
    index: int
