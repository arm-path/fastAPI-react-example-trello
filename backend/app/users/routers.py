from fastapi import APIRouter
from fastapi_users import FastAPIUsers

from app.users import User
from app.users.configuration import auth_backend
from app.users.manager import get_user_manager
from app.users.schemas import UserRead, UserCreate

router = APIRouter(
    prefix='/auth',
    tags = ['Authentication']
)

fastapi_users = FastAPIUsers[User, int](
    get_user_manager,
    [auth_backend],
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