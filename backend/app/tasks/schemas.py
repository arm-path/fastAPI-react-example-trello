from datetime import datetime
from typing import List

from pydantic import BaseModel, Field

from app.files.schemas import FileCreateResponseSchema
from app.users.schemas import UserInformationSchema


class TaskBaseSchema(BaseModel):
    title: str
    deadline: datetime | None = None


class TaskCreateSchema(TaskBaseSchema):
    dashboard_id: int
    description: str | None = None


class TaskUpdateSchema(TaskBaseSchema):
    description: str | None = None


class TaskDetailSchema(TaskBaseSchema):
    created: datetime
    updated: datetime
    id: int
    index: int
    creator: UserInformationSchema


class TaskExtendedDetailSchema(TaskDetailSchema):
    description: str | None = None
    responsible_users: List[UserInformationSchema] = Field(..., serialization_alias='responsible')
    files: List[FileCreateResponseSchema]


class TaskMovingSchema(BaseModel):
    index: int


class TaskMovingDashboard(TaskMovingSchema):
    dashboard_id: int


class TaskAssignResponsibleSchema(BaseModel):
    user_ids: List[int]
