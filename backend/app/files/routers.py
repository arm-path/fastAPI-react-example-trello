from typing import Annotated

from fastapi import APIRouter, Depends, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.authentication.dependencies import current_user
from app.authentication.schemas import UserRead
from app.database import db_settings
from app.files.services import FileService

router = APIRouter(
    prefix='/files',
    tags=['Files']
)


@router.post('/load/{task_id}/')
async def load_file(session: Annotated[AsyncSession, Depends(db_settings.get_session)],
                    user: Annotated[UserRead, Depends(current_user)],
                    file: UploadFile, task_id: int):
    await FileService.upload_file(session, user, file, task_id)
    return {'msg': 'success'}
