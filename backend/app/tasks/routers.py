from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import db_settings
from app.tasks.schemas import TaskCreateSchema, TaskUpdateSchema
from app.tasks.services import TaskService
from app.users.dependencies import current_user
from app.users.schemas import UserRead

router = APIRouter(
    prefix='/task',
    tags=['Tasks']
)


@router.post('/create/')
async def create_task(session: Annotated[AsyncSession, Depends(db_settings.get_session)],
                      user: Annotated[UserRead, Depends(current_user)],
                      data: TaskCreateSchema):
    return await TaskService.create_task(session, user, data)


@router.put('/update/{task_id}/')
async def update_task(session: Annotated[AsyncSession, Depends(db_settings.get_session)],
                      user: Annotated[UserRead, Depends(current_user)],
                      task_id: int,
                      data: TaskUpdateSchema):
    return await TaskService.update_task(session, user, task_id, data)


@router.delete('/delete/{task_id}')
async def delete_task(session: Annotated[AsyncSession, Depends(db_settings.get_session)],
                      user: Annotated[UserRead, Depends(current_user)],
                      task_id: int):
    return await TaskService.delete_task(session, user, task_id)


@router.get('/{dashboard_id}/list')
async def get_tasks(session: Annotated[AsyncSession, Depends(db_settings.get_session)],
                    user: Annotated[UserRead, Depends(current_user)],
                    dashboard_id: int):
    return await TaskService.get_tasks(session, user, dashboard_id)


@router.get('/{dashboard_id}/detail/{task_id}')
async def get_task(session: Annotated[AsyncSession, Depends(db_settings.get_session)],
                   user: Annotated[UserRead, Depends(current_user)],
                   dashboard_id: int,
                   task_id: int):
    return await TaskService.get_task(session, user, dashboard_id, task_id)
