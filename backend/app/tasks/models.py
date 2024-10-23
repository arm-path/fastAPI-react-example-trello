from datetime import datetime
from typing import List, TYPE_CHECKING

from sqlalchemy import String, ForeignKey, text, Integer, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.tasks.utils import default_deadline_three_days

if TYPE_CHECKING:
    from app.users import User
    from app.dashboards import Dashboard
    from app.files import File


class Task(Base):
    __tablename__ = 'task'
    title: Mapped[str] = mapped_column(String(69), nullable=False)
    dashboard_id: Mapped[int] = mapped_column(ForeignKey('dashboard.id', ondelete='CASCADE'))
    creator_id: Mapped[int | None] = mapped_column(ForeignKey('user.id', ondelete='SET NULL'), nullable=True)
    description: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created: Mapped[datetime] = mapped_column(server_default=text("TIMEZONE('utc', now())"))
    updated: Mapped[datetime] = mapped_column(server_default=text("TIMEZONE('utc', now())"), onupdate=datetime.utcnow)
    deadline: Mapped[datetime] = mapped_column(default=default_deadline_three_days)
    index: Mapped[int] = mapped_column(Integer, default=0)

    responsible_users: Mapped[List['User']] = relationship(secondary='responsible_task',
                                                           back_populates='responsible_tasks')
    creator: Mapped['User'] = relationship(back_populates='tasks')
    dashboard: Mapped['Dashboard'] = relationship(back_populates='tasks')
    files: Mapped[List['File']] = relationship(back_populates='task')


class ResponsibleTask(Base):
    __tablename__ = 'responsible_task'
    task_id: Mapped[int] = mapped_column(ForeignKey('task.id', ondelete='CASCADE'), nullable=False)
    responsible_id: Mapped[int] = mapped_column(ForeignKey('user.id', ondelete='CASCADE'), nullable=False)

    __table_args__ = (UniqueConstraint('task_id', 'responsible_id'),)

    def __str__(self):
        return f'<ResponsibleTask {self.id}: {self.task_id} - {self.responsible_id}>'

