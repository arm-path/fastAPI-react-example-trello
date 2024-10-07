from typing import TYPE_CHECKING
from sqlalchemy import String, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.projects import Project

class Dashboard(Base):
    __tablename__ = 'dashboard'
    title: Mapped[str] = mapped_column(String(69), nullable=False)
    project_id: Mapped[int] = mapped_column(ForeignKey('project.id', ondelete='CASCADE'))
    color: Mapped[str] = mapped_column(String(69), default='#b1b4b9')
    index: Mapped[int] = mapped_column(Integer, default=0)

    project: Mapped['Project'] = relationship(back_populates='dashboards')

    __table_args__ = (UniqueConstraint('project_id', 'index'),)

    def __str__(self):
        return f'<Dashboard {self.id}: {self.title}>'
