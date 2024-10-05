from fastapi import Depends
from fastapi_users.db import SQLAlchemyUserDatabase
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.settings import db_settings
from app.users import User


async def get_user_db(session: AsyncSession = Depends(db_settings.get_session)):
    yield SQLAlchemyUserDatabase(session, User)
