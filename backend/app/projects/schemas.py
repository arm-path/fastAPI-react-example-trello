from pydantic import BaseModel


class BaseProjectSchema(BaseModel):
    title: str
    description: str


class ReadProjectSchema(BaseProjectSchema):
    id: int


class CreateProjectSchema(BaseProjectSchema):
    pass


class UpdateProjectSchema(BaseProjectSchema):
    pass
