from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import RedirectResponse

from app.authentication.configuration import auth_backend
from app.authentication.dependencies import fastapi_users
from app.authentication.schemas import UserRead, UserCreate
from app.authentication.utils import token_decode
from app.database import db_settings
from app.settings import settings
from app.users.services import UserService

router = APIRouter(
    prefix='/auth',
    tags=['Login']
)

router.include_router(
    fastapi_users.get_auth_router(auth_backend)
)

router.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate)
)

router.include_router(
    fastapi_users.get_verify_router(UserRead),
)

router.include_router(
    fastapi_users.get_reset_password_router(),
)


@router.get('/activate/{token}/')
async def activate_user(session: Annotated[AsyncSession, Depends(db_settings.get_session)], token: str):
    message = token_decode(token, settings.SECRET_EMAIL_CONFIRMATION)

    if message['status'] == 401:
        return RedirectResponse(url=f'{settings.FRONTEND_BASE_URL}login/?verify=error&detail={message['message']}',
                                status_code=status.HTTP_302_FOUND)

    user_id = int(message['token'][0]['id'])

    user = await UserService.get_user(session, {'id': user_id, 'is_verified': True})
    if user:
        message = 'UserAlreadyActivated'
        return RedirectResponse(url=f'{settings.FRONTEND_BASE_URL}login/?verify=error&detail={message}',
                                status_code=status.HTTP_302_FOUND)

    await UserService.verified_user(session, int(message['token'][0]['id']))
    return RedirectResponse(url=f'{settings.FRONTEND_BASE_URL}login/?verify=success', status_code=status.HTTP_302_FOUND)
