from typing import List

from pydantic import BaseModel, EmailStr, Field

from app.users.schemas import UserInformationSchema


class BaseProjectSchema(BaseModel):
    title: str


class ReadProjectSchema(BaseProjectSchema):
    id: int


class ReadProjectDetailSchema(ReadProjectSchema):
    user_id: int


class ReadListProjectSchema(BaseModel):
    my_projects: List[ReadProjectSchema]
    invited_projects: List[ReadProjectDetailSchema]


class CreateProjectSchema(BaseProjectSchema):
    pass


class InvitationsSchema(BaseModel):
    id: int
    accepted: bool
    invited_user: UserInformationSchema = Field(..., serialization_alias='user')


class UpdateProjectSchema(BaseProjectSchema):
    pass


class ProjectOwnerSchema(BaseProjectSchema):
    id: int
    user: UserInformationSchema


class DetailProjectSchema(ProjectOwnerSchema):
    invitations: List[InvitationsSchema]


class InviteUserForProjectSchema(BaseModel):
    email: EmailStr
