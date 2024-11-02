from fastapi import APIRouter

from app.authentication.configuration import auth_backend
from app.authentication.dependencies import fastapi_users
from app.authentication.schemas import UserRead, UserCreate

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
