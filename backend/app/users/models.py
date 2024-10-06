from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.settings import Base
from fastapi_users_db_sqlalchemy import SQLAlchemyBaseUserTable


class User(SQLAlchemyBaseUserTable[int], Base):
    first_name: Mapped[str | None] = mapped_column(String(69), nullable=True)
    last_name: Mapped[str | None] = mapped_column(String(69), nullable=True)