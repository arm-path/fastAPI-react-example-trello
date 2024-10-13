from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import db_settings
from app.tasks.schemas import TaskCreateSchema
from app.tasks.services import TaskService
from app.users.dependencies import current_user
from app.users.schemas import UserRead

router = APIRouter(
    prefix='/task',
    tags=['Tasks']
)


@router.post('/create/{project_id}/{dashboard_id}/')
async def create_task(session: Annotated[AsyncSession, Depends(db_settings.get_session)],
                      user: Annotated[UserRead, Depends(current_user)],
                      project_id: int,
                      dashboard_id: int,
                      data: TaskCreateSchema):
    return await TaskService.create_task(session, user, project_id, dashboard_id, data)
