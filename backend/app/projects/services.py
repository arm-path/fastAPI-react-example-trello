from sqlalchemy.ext.asyncio import AsyncSession

from app.database import DatabaseService
from app.projects import Project
from app.projects.schemas import CreateProjectSchema, UpdateProjectSchema
from app.users.schemas import UserRead


class ProjectService(DatabaseService):
    model = Project

    @classmethod
    async def create_project(cls, session: AsyncSession, user: UserRead, data: CreateProjectSchema):
        values = data.model_dump()
        values['user_id'] = user.id
        return await cls.create(session, values)

    @classmethod
    async def update_project(cls, session: AsyncSession, user: UserRead, project_id: int, data: UpdateProjectSchema):
        values = data.model_dump()
        filters = {'user_id': user.id, 'id': project_id}
        return await cls.update(session, filters=filters, values=values)

    @classmethod
    async def delete_project(cls, session: AsyncSession, user: UserRead, project_id: int) -> None:
        filters = {'user_id': user.id, 'id': project_id}
        await  cls.delete(session, filters)

    @classmethod
    async def get_projects(cls, session: AsyncSession, user: UserRead):
        filters = {'user_id': user.id}
        return await cls.get_list(session, filters)

    @classmethod
    async def get_project(cls, session: AsyncSession, user: UserRead, project_id: int):
        filters = {'user_id': user.id, 'id': project_id}
        return await cls.get_detail(session, filters)
