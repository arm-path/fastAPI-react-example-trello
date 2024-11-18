from pydantic import EmailStr
from sqlalchemy import select, Select, Result, or_, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload, defer

from app.database import DatabaseService
from app.exceptions import ObjectNotFoundException
from app.projects import Projects, ProjectUsers
from app.projects.schemas import CreateProjectSchema, UpdateProjectSchema
from app.authentication.schemas import UserRead
from app.users.services import UserService


class ProjectService(DatabaseService):
    model = Projects

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
        my_projects = await cls.get_list(session, {'user_id': user.id})
        query: Select = (
            select(Projects)
            .join(Projects.invitations)
            .filter(ProjectUsers.invited_id == user.id, ProjectUsers.accepted == True)
        )
        results: Result[tuple[cls.model]] = await session.execute(query)
        invited_projects = results.scalars().all()
        return {'my_projects': my_projects, 'invited_projects': invited_projects}

    @classmethod
    async def get_project(cls, session: AsyncSession, user: UserRead, project_id: int):
        query: Select = (
            select(Projects)
            .outerjoin(Projects.invitations)
            .filter(Projects.id == project_id,
                    or_(
                        and_(ProjectUsers.invited_id == user.id, ProjectUsers.accepted == True),
                        Projects.user_id == user.id
                    ))
            .options(
                selectinload(cls.model.user),
                selectinload(cls.model.invitations).options(selectinload(ProjectUsers.invited_user)),
                defer(cls.model.user_id)
            ).limit(1)
        )
        result: Result[tuple[Projects]] = await session.execute(query)
        project = result.scalar_one_or_none()
        if not project:
            raise ObjectNotFoundException('Projects')
        return project


class ProjectUsersService(DatabaseService):
    model = ProjectUsers

    @classmethod
    async def invite_user_project(cls, session: AsyncSession, user: UserRead, project_id, email: EmailStr):
        filters = {'email': email}
        invite_user = await UserService.get_user(session, filters)
        if not invite_user:
            raise ObjectNotFoundException('User')
        filters = {'id': project_id, 'user_id': user.id}
        project = await ProjectService.get_detail(session, filters)
        if not project:
            raise ObjectNotFoundException('Projects')
        values = {'project_id': project.id, 'invited_id': invite_user.id}
        options = [selectinload(cls.model.invited_user)]
        return await cls.create(session, values, options)
