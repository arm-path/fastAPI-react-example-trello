from typing import Annotated, List

from fastapi import APIRouter
from fastapi.params import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import db_settings
from app.projects.schemas import CreateProjectSchema, ReadProjectSchema, UpdateProjectSchema
from app.projects.services import ProjectService
from app.users.dependencies import current_user
from app.users.schemas import UserRead

router = APIRouter(
    prefix='/project',
    tags=['Project']
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


@router.get('/list/', response_model=List[ReadProjectSchema])
async def get_projects(user: Annotated[UserRead, Depends(current_user)],
                       session: Annotated[AsyncSession, Depends(db_settings.get_session)]):
    return await ProjectService.get_projects(session, user)


@router.get('/detail/{project_id}/', response_model=ReadProjectSchema)
async def get_project(user: Annotated[UserRead, Depends(current_user)],
                      session: Annotated[AsyncSession, Depends(db_settings.get_session)],
                      project_id: int):
    return await ProjectService.get_project(session, user, project_id)
