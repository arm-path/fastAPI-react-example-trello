from pydantic import BaseModel


class DashboardBaseSchema(BaseModel):
    title: str
    color: str
    index: int


class DashboardCreateSchema(DashboardBaseSchema):
    pass


class DashboardUpdateSchema(DashboardBaseSchema):
    pass


class DashboardReadSchema(DashboardBaseSchema):
    id: int
    project_id: int
