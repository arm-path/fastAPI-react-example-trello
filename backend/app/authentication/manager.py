from typing import Optional

from fastapi import Request, Depends
from fastapi_users import IntegerIDMixin, BaseUserManager

from app.authentication.utils import token_encode
from app.email.services import send_email_user_verified, send_email_forgot_password
from app.settings import settings
from app.users import User
from app.users.models import get_user_db


class UserManager(IntegerIDMixin, BaseUserManager[User, int]):
    reset_password_token_secret = settings.SECRET_USER_MANAGER
    verification_token_secret = settings.SECRET_USER_MANAGER

    async def on_after_register(self, user: User, request: Optional[Request] = None):
        token = token_encode(user.id, settings.SECRET_EMAIL_CONFIRMATION)
        send_email_user_verified(user.email, token)

    async def on_after_forgot_password(
            self, user: User, token: str, request: Optional[Request] = None
    ):
        send_email_forgot_password(user.email, token)

    async def on_after_request_verify(
            self, user: User, token: str, request: Optional[Request] = None
    ):
        print(f"Verification requested for user {user.id}. Verification token: {token}")


async def get_user_manager(user_db=Depends(get_user_db)):
    yield UserManager(user_db)
