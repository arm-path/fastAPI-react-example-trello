from typing import List

from pydantic import BaseModel

from app.tasks.schemas import TaskDetailSchema


class DashboardBaseSchema(BaseModel):
    title: str
    color: str


class DashboardCreateSchema(DashboardBaseSchema):
    pass


class DashboardUpdateSchema(DashboardBaseSchema):
    pass


class DashboardReadSchema(DashboardBaseSchema):
    id: int
    index: int
    project_id: int
    tasks: List[TaskDetailSchema]


class DashboardMovingSchema(BaseModel):
    index: int
