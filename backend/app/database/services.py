from typing import List

from asyncpg import UniqueViolationError, ForeignKeyViolationError, UndefinedFunctionError
from fastapi_pagination.ext.sqlalchemy import paginate
from sqlalchemy import Select, select, Result, Insert, insert, Update, update, delete, Delete, func
from sqlalchemy.exc import IntegrityError, InvalidRequestError, ProgrammingError, MultipleResultsFound
from sqlalchemy.ext.asyncio import AsyncSession

from app.exceptions import UniqueViolationException, ForeignKeyViolationException, IntegrityException, \
    DatabaseException, InvalidRequestException, DatabaseDataTypeException, MultipleResultsFoundException


class DatabaseService:
    model = None

    @classmethod
    async def get_list(cls, session: AsyncSession, filters, options: List = [], paginated: bool = False):
        query: Select = (
            select(cls.model)
            .filter_by(**filters)
            .options(*options)
        )
        if paginated:
            return await paginate(session, query)
        result: Result[tuple[cls.model]] = await session.execute(query)
        models = result.scalars().all()
        return models

    @classmethod
    async def get_detail(cls, session: AsyncSession, filters, options: List = []):
        try:
            query: Select = (
                select(cls.model)
                .filter_by(**filters)
                .options(*options)
            )
            result: Result[tuple[cls.model]] = await session.execute(query)
            model = result.scalar_one_or_none()
        except ProgrammingError as e:
            if e.orig.__cause__.__class__ == UndefinedFunctionError:
                raise DatabaseDataTypeException
            else:
                raise DatabaseException
        except MultipleResultsFound as e:
            raise MultipleResultsFoundException
        except Exception as e:
            raise DatabaseException
        return model

    @classmethod
    async def create(cls, session: AsyncSession, values, options: List = []):
        try:
            stmt: Insert = (
                insert(cls.model)
                .values(**values)
                .returning(cls.model).options(*options)
            )
            result: Result[tuple[cls.model]] = await session.execute(stmt)
            await session.commit()
            model = result.scalar_one_or_none()
        except IntegrityError as e:
            if e.orig.__cause__.__class__ == UniqueViolationError:
                raise UniqueViolationException
            if e.orig.__cause__.__class__ == ForeignKeyViolationError:
                raise ForeignKeyViolationException
            else:
                raise IntegrityException
        except InvalidRequestError as e:
            raise InvalidRequestException
        # except Exception as e:
        #     raise DatabaseException
        return model

    @classmethod
    async def update(cls, session: AsyncSession, filters: dict, values, options: List = []):
        try:
            stmt: Update = (
                update(cls.model)
                .filter_by(**filters)
                .values(**values)
                .returning(cls.model)
                .options(*options)
            )
            result: Result[tuple[cls.model]] = await session.execute(stmt)
            model = result.scalar_one_or_none()
            await session.commit()
        except IntegrityError as e:
            if e.orig.__cause__.__class__ == UniqueViolationError:
                raise UniqueViolationException
            if e.orig.__cause__.__class__ == ForeignKeyViolationError:
                raise ForeignKeyViolationException
            else:
                raise IntegrityException
        except InvalidRequestError as e:
            raise InvalidRequestException
        except Exception as e:
            raise DatabaseException
        return model

    @classmethod
    async def delete(cls, session: AsyncSession, filters: dict):
        stmt: Delete = (
            delete(cls.model)
            .filter_by(**filters)
        )
        await session.execute(stmt)
        await session.commit()
