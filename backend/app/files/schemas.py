from pydantic import BaseModel

from app.users.schemas import UserInformationSchema


class FileSchema(BaseModel):
    task_id: int


class FileCreateResponseSchema(BaseModel):
    id: int
    url: str
    user: UserInformationSchema