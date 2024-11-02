from typing import TYPE_CHECKING, List

from sqlalchemy import String, ForeignKey, UniqueConstraint, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.users import User
    from app.dashboards import Dashboard
    from app.stories import Story


class Projects(Base):
    __tablename__ = 'project'
    title: Mapped[str] = mapped_column(String(69), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey('user.id', ondelete='CASCADE'), nullable=False)

    user: Mapped['User'] = relationship(back_populates='projects')
    invited_users: Mapped[List['User']] = relationship(secondary='project_users', back_populates='invited_projects')
    invitations: Mapped[List['ProjectUsers']] = relationship(back_populates='project')
    dashboards: Mapped[List['Dashboard']] = relationship(back_populates='project')
    stories: Mapped[List['Story']] = relationship(back_populates='project')

    __table_args__ = (UniqueConstraint('title', 'user_id'),)

    def __str__(self):
        return f'<Projects {self.id}: {self.title}>'


class ProjectUsers(Base):
    __tablename__ = 'project_users'
    project_id: Mapped[int] = mapped_column(ForeignKey('project.id', ondelete='CASCADE'))
    invited_id: Mapped[int] = mapped_column(ForeignKey('user.id', ondelete='CASCADE'))
    accepted: Mapped[bool] = mapped_column(Boolean, default=False)

    project: Mapped['Projects'] = relationship(back_populates='invitations')
    invited_user: Mapped['User'] = relationship(back_populates='invitations')

    __table_args__ = (UniqueConstraint('project_id', 'invited_id'),)

    def __str__(self):
        return f'<ProjectUsers {self.id}: {self.project_id} - {self.invited_id}>'
