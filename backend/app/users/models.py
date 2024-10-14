from typing import TYPE_CHECKING, List

from fastapi import Depends
from fastapi_users_db_sqlalchemy import SQLAlchemyBaseUserTable, SQLAlchemyUserDatabase
from sqlalchemy import String
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.settings import Base, db_settings

if TYPE_CHECKING:
    from app.projects import Project
    from app.projects import ProjectUsers
    from app.tasks import Task
    from app.stories import Story
    from app.files import File


class User(SQLAlchemyBaseUserTable[int], Base):
    first_name: Mapped[str | None] = mapped_column(String(69), nullable=True)
    last_name: Mapped[str | None] = mapped_column(String(69), nullable=True)

    invited_projects: Mapped[List['Project']] = relationship(secondary='project_users', back_populates='invited_users')
    invitations: Mapped[List['ProjectUsers']] = relationship(back_populates='invited_user')
    responsible_tasks: Mapped[List['Task']] = relationship(secondary='responsible_task',
                                                           back_populates='responsible_users')
    stories: Mapped[List['Story']] = relationship(back_populates='user')
    upload_files: Mapped[List['File']] = relationship(back_populates='user')


async def get_user_db(session: AsyncSession = Depends(db_settings.get_session)):
    yield SQLAlchemyUserDatabase(session, User)
