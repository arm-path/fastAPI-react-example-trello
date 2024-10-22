from typing import Annotated, List

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.authentication.dependencies import current_user
from app.authentication.schemas import UserRead
from app.database import db_settings
from app.tasks.schemas import TaskCreateSchema, TaskUpdateSchema, TaskMovingSchema, TaskDetailSchema
from app.tasks.services import TaskService

router = APIRouter(
    prefix='/task',
    tags=['Tasks']
)


@router.post('/create/', response_model=TaskDetailSchema)
async def create_task(session: Annotated[AsyncSession, Depends(db_settings.get_session)],
                      user: Annotated[UserRead, Depends(current_user)],
                      data: TaskCreateSchema):
    return await TaskService.create_task(session, user, data)


@router.put('/update/{task_id}/', response_model=TaskDetailSchema)
async def update_task(session: Annotated[AsyncSession, Depends(db_settings.get_session)],
                      user: Annotated[UserRead, Depends(current_user)],
                      task_id: int,
                      data: TaskUpdateSchema):
    return await TaskService.update_task(session, user, task_id, data)


@router.put('/{dashboard_id}/moving/{task_id}/')
async def moving_between_dashboard(session: Annotated[AsyncSession, Depends(db_settings.get_session)],
                                   user: Annotated[UserRead, Depends(current_user)],
                                   dashboard_id: int,
                                   task_id: int):
    return await TaskService.moving_between_dashboard(session, user, dashboard_id, task_id)


@router.put('/moving/{task_id}/', response_model=TaskDetailSchema)
async def moving_task(session: Annotated[AsyncSession, Depends(db_settings.get_session)],
                      user: Annotated[UserRead, Depends(current_user)],
                      task_id: int,
                      data: TaskMovingSchema):
    return await TaskService.moving_task(session, user, task_id, data.index)


@router.delete('/delete/{task_id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(session: Annotated[AsyncSession, Depends(db_settings.get_session)],
                      user: Annotated[UserRead, Depends(current_user)],
                      task_id: int):
    return await TaskService.delete_task(session, user, task_id)


@router.get('/{dashboard_id}/list', response_model=List[TaskDetailSchema])
async def get_tasks(session: Annotated[AsyncSession, Depends(db_settings.get_session)],
                    user: Annotated[UserRead, Depends(current_user)],
                    dashboard_id: int):
    return await TaskService.get_tasks(session, user, dashboard_id)


@router.get('/detail/{task_id}', response_model=TaskDetailSchema)
async def get_task(session: Annotated[AsyncSession, Depends(db_settings.get_session)],
                   user: Annotated[UserRead, Depends(current_user)],
                   task_id: int):
    return await TaskService.get_task(session, user, task_id)
