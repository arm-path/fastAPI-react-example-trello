from typing import TYPE_CHECKING, List

from fastapi_users_db_sqlalchemy import SQLAlchemyBaseUserTable
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.settings import Base

if TYPE_CHECKING:
    from app.projects import Project
    from app.projects import ProjectUsers


class User(SQLAlchemyBaseUserTable[int], Base):
    first_name: Mapped[str | None] = mapped_column(String(69), nullable=True)
    last_name: Mapped[str | None] = mapped_column(String(69), nullable=True)

    invited_projects: Mapped[List['Project']] = relationship(secondary='project_users', back_populates='invited_users')
    invitations: Mapped[List['ProjectUsers']] = relationship(back_populates='invited_user')
