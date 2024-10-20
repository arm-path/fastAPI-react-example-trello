from pydantic import BaseModel


class UserBaseSchema(BaseModel):
    id: int
    email: str


class UserInformationSchema(UserBaseSchema):
    first_name: str | None
    last_name: str | None


class UserDetailSchema(UserInformationSchema):
    is_active: bool
    is_verified: bool

class JoiningProjectSchema(BaseModel):
    project_id: int