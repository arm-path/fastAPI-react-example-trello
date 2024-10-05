from typing import AsyncGenerator

from sqlalchemy import MetaData
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

from app.settings import settings

class DatabaseSettings:
    def __init__(self, echo=False):
        self.engine = create_async_engine(settings.database_url, echo=echo)
        self.session = async_sessionmaker(self.engine, expire_on_commit=False, autoflush=False)

    async def get_session(self) -> AsyncGenerator[AsyncSession, None]:
        async with self.session() as session_db:
            yield session_db

    async def dispose(self):
        await self.engine.dispose()


class Base(DeclarativeBase):
    id: Mapped[int] = mapped_column(primary_key=True)
    metadata = MetaData(naming_convention=settings.DATABASE_CONVENTION)


db_settings = DatabaseSettings(echo=settings.DATABASE_ECHO)
