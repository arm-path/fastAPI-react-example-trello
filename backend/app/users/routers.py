from fastapi import APIRouter

from app.users.configuration import auth_backend
from app.users.dependencies import fastapi_users
from app.users.schemas import UserRead, UserCreate

router = APIRouter(
    prefix='/auth',
    tags=['Authentication']
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
