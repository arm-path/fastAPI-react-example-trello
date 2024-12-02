from typing import Annotated

from fastapi import APIRouter, status
from fastapi.params import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.authentication.dependencies import current_user
from app.authentication.schemas import UserRead
from app.database import db_settings
from app.projects.schemas import (CreateProjectSchema,
                                  ReadProjectSchema,
                                  UpdateProjectSchema,
                                  InviteUserForProjectSchema, DetailProjectSchema, InvitationsSchema,
                                  ReadListProjectSchema)
from app.projects.services import ProjectService, ProjectUsersService

router = APIRouter(
    prefix='/project',
    tags=['Projects']
)


@router.post('/create/', response_model=ReadProjectSchema)
async def create_project(user: Annotated[UserRead, Depends(current_user)],
                         session: Annotated[AsyncSession, Depends(db_settings.get_session)],
                         data: CreateProjectSchema):
    return await ProjectService.create_project(session, user, data)


@router.put('/update/{project_id}/', response_model=ReadProjectSchema)
async def update_project(user: Annotated[UserRead, Depends(current_user)],
                         session: Annotated[AsyncSession, Depends(db_settings.get_session)],
                         data: UpdateProjectSchema, project_id: int):
    return await ProjectService.update_project(session, user, project_id, data)


@router.delete('/delete/{project_id}/', status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(user: Annotated[UserRead, Depends(current_user)],
                         session: Annotated[AsyncSession, Depends(db_settings.get_session)],
                         project_id: int):
    return await ProjectService.delete_project(session, user, project_id)


@router.get('/list/', response_model=ReadListProjectSchema)
async def get_projects(user: Annotated[UserRead, Depends(current_user)],
                       session: Annotated[AsyncSession, Depends(db_settings.get_session)]):
    return await ProjectService.get_projects(session, user)


@router.get('/detail/{project_id}/', response_model=DetailProjectSchema)
async def get_project(user: Annotated[UserRead, Depends(current_user)],
                      session: Annotated[AsyncSession, Depends(db_settings.get_session)],
                      project_id: int):
    return await ProjectService.get_project(session, user, project_id)


@router.post('/invite-user/{project_id}/', response_model=InvitationsSchema)
async def invite_user(user: Annotated[UserRead, Depends(current_user)],
                      session: Annotated[AsyncSession, Depends(db_settings.get_session)],
                      project_id: int,
                      data: InviteUserForProjectSchema):
    return await ProjectUsersService.invite_user_project(session, user, project_id, data.email)


@router.delete('/delete-user/{project_id}/{invitation_id}/', status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user: Annotated[UserRead, Depends(current_user)],
                      session: Annotated[AsyncSession, Depends(db_settings.get_session)],
                      project_id: int, invitation_id: int):
    await ProjectUsersService.delete_user_project(session, user, project_id, invitation_id)
