from typing import TYPE_CHECKING
from datetime import datetime

from sqlalchemy import String, ForeignKey, DateTime, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


if TYPE_CHECKING:
    from app.projects import Project
    from app.users import User


class Story(Base):
    __tablename__ = 'story'
    action: Mapped[str] = mapped_column(String(255), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    project_id: Mapped[int] = mapped_column(ForeignKey('project.id', onupdate='CASCADE'), nullable=False)
    created: Mapped[datetime] = mapped_column(DateTime, server_default=text("TIMEZONE('utc', now())"))
    description: Mapped[str] = mapped_column(String(255), default='')

    project: Mapped['Project'] = relationship(back_populates='stories')
    user: Mapped['User'] = relationship(back_populates='stories')

    def __str__(self):
        return f'<Story {self.id}: {self.action}>'
