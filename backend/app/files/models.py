from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String, DateTime, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.tasks import Task
    from app.users import User


class File(Base):
    __tablename__ = 'base'
    task_id: Mapped[int] = mapped_column(ForeignKey('task.id', ondelete='CASCADE'), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    created: Mapped[datetime] = mapped_column(DateTime, server_default=text("TIMEZONE('utc', now())"))
    url: Mapped[str] = mapped_column(String(255), nullable=False)

    task: Mapped['Task'] = relationship(back_populates='files')
    user: Mapped['User'] = relationship(back_populates='upload_files')

    def __str__(self):
        return f'<Files {self.id}: {self.task_id} - {self.user_id}>'
