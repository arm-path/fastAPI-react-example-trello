from fastapi_users import FastAPIUsers

from app.users import User
from app.authentication.configuration import auth_backend
from app.authentication.manager import get_user_manager

fastapi_users = FastAPIUsers[User, int](
    get_user_manager,
    [auth_backend],
)

current_user = fastapi_users.current_user(active=True, verified=True)
current_superuser = fastapi_users.current_user(active=True, superuser=True)
