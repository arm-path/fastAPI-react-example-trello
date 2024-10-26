from typing import Annotated, List

from fastapi import APIRouter, Depends, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.authentication.dependencies import current_user
from app.authentication.schemas import UserRead
from app.database import db_settings
from app.files.schemas import FileCreateResponseSchema
from app.files.services import FileService

router = APIRouter(
    prefix='/files',
    tags=['Files']
)


@router.post('/load/{task_id}/', response_model=FileCreateResponseSchema)
async def load_file(session: Annotated[AsyncSession, Depends(db_settings.get_session)],
                    user: Annotated[UserRead, Depends(current_user)],
                    file: UploadFile, task_id: int):
    return await FileService.upload_file(session, user, file, task_id)


@router.delete('/delete/{file_id}/', status_code=status.HTTP_204_NO_CONTENT)
async def delete_file(session: Annotated[AsyncSession, Depends(db_settings.get_session)],
                      user: Annotated[UserRead, Depends(current_user)],
                      file_id: int):
    await FileService.delete_file(session, user, file_id)


@router.get('/task/{task_id}', response_model=List[FileCreateResponseSchema])
async def get_files(session: Annotated[AsyncSession, Depends(db_settings.get_session)],
                    user: Annotated[UserRead, Depends(current_user)],
                    task_id: int):
    return await FileService.get_files(session, user, task_id)
