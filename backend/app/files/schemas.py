from pydantic import BaseModel


class FileSchema(BaseModel):
    task_id: int


class FileCreateResponseSchema(FileSchema):
    url: str