from datetime import datetime
from typing import List

from pydantic import BaseModel, Field
from pydantic.v1 import validator

from app.files.schemas import FileCreateResponseSchema
from app.users.schemas import UserInformationSchema


class TaskBaseSchema(BaseModel):
    title: str
    deadline: datetime | None = None


class TaskCreateSchema(TaskBaseSchema):
    dashboard_id: int
    description: str | None = None


class TaskUpdateSchema(BaseModel):
    title: str = None
    deadline: datetime = None
    description: str | None = None

    @validator('title', 'deadline', 'description', always=True)
    def check_only_one_field(cls, v, values, field):
        if v is not None and any(
                values.get(f) is not None for f in ['title', 'deadline', 'description'] if f != field.name):
            raise ValueError('Only one field must be provided')
        return v


class TaskDetailSchema(TaskBaseSchema):
    created: datetime
    updated: datetime
    id: int
    index: int
    dashboard_id: int
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
