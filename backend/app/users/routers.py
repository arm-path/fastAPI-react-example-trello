from typing import Annotated, List

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.authentication.dependencies import current_user
from app.authentication.schemas import UserRead
from app.database import db_settings
from app.projects.schemas import ProjectOwnerSchema
from app.users.schemas import UserDetailSchema, JoiningProjectSchema
from app.users.services import UserService

router = APIRouter(
    prefix='/user',
    tags=['User']
)


@router.get('/detail/', response_model=UserDetailSchema)
async def get_user(user: Annotated[UserRead, Depends(current_user)]):
    return user


@router.get('/invitations-projects/', response_model=List[ProjectOwnerSchema])
async def get_invitations_projects(user: Annotated[UserRead, Depends(current_user)],
                                   session: Annotated[AsyncSession, Depends(db_settings.get_session)]):
    return await UserService.get_invitations_projects(session, user)


@router.get('/invited-projects/', response_model=List[ProjectOwnerSchema])
async def get_invited_projects(user: Annotated[UserRead, Depends(current_user)],
                               session: Annotated[AsyncSession, Depends(db_settings.get_session)]):
    return await UserService.get_invited_projects(session, user)


@router.post('/invitation-project/accept/')
async def invitation_project_accept(user: Annotated[UserRead, Depends(current_user)],
                                    session: Annotated[AsyncSession, Depends(db_settings.get_session)],
                                    data: JoiningProjectSchema):
    return await UserService.invitation_project_accept(session, user, data.project_id)


@router.delete('/invited-project/delete/')
async def invited_project_delete(user: Annotated[UserRead, Depends(current_user)],
                                 session: Annotated[AsyncSession, Depends(db_settings.get_session)],
                                 data: JoiningProjectSchema):
    return await UserService.invited_project_delete(session, user, data.project_id)
