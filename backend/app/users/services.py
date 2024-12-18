from sqlalchemy import Select, select, Result
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload, defer

from app.authentication.schemas import UserRead
from app.database.services import DatabaseService
from app.projects import Projects, ProjectUsers
from app.users import User
from app.users.schemas import UserUpdateSchema


class UserService(DatabaseService):
    model = User

    @classmethod
    async def get_user(cls, session: AsyncSession, filters):
        return await cls.get_detail(session, filters)

    @classmethod
    async def update_user(cls, session: AsyncSession, user: UserRead, data: UserUpdateSchema):
        filters = {'id': user.id}
        values = {'first_name': data.first_name, 'last_name': data.last_name}
        await cls.update(session, filters, values)

    @classmethod
    async def verified_user(cls, session: AsyncSession, user_id: int):
        filters = {'id': user_id}
        values = {'is_active': True, 'is_verified': True}
        await cls.update(session, filters, values)

    @classmethod
    async def get_other_projects(cls, session: AsyncSession, user: UserRead, accepted):
        query: Select = (
            select(Projects)
            .join(Projects.invitations)
            .filter(ProjectUsers.invited_id == user.id, ProjectUsers.accepted == accepted)
            .options(selectinload(Projects.user).options(defer(User.hashed_password)), defer(Projects.user_id))
        )
        results: Result[tuple[cls.model]] = await session.execute(query)
        return results.scalars().all()

    @classmethod
    async def get_invitations_projects(cls, session: AsyncSession, user: UserRead):
        return await cls.get_other_projects(session, user, False)

    @classmethod
    async def get_invited_projects(cls, session: AsyncSession, user: UserRead):
        return await cls.get_other_projects(session, user, True)

    @classmethod
    async def invitation_project_accept(cls, session: AsyncSession, user: UserRead, project_id: int):
        filters = {'project_id': project_id, 'invited_id': user.id, 'accepted': False}
        values = {'accepted': True}
        await UserProjectService.update(session, filters, values)
        return await cls.get_invited_projects(session, user)

    @classmethod
    async def invited_project_delete(cls, session: AsyncSession, user: UserRead, project_id: int):
        filters = {'project_id': project_id, 'invited_id': user.id, 'accepted': False}
        await UserProjectService.delete(session, filters)


class UserProjectService(DatabaseService):
    model = ProjectUsers
