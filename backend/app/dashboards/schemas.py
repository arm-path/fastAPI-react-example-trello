from pydantic import BaseModel


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


class DashboardMovingSchema(BaseModel):
    index: int
