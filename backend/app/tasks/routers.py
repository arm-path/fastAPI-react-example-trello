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
