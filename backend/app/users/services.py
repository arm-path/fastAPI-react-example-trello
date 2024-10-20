from sqlalchemy import Select, select, Result
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload, defer

from app.authentication.schemas import UserRead
from app.database.services import DatabaseService
from app.projects import Project, ProjectUsers
from app.users import User


class UserService(DatabaseService):
    model = User

    @classmethod
    async def get_user(cls, session: AsyncSession, filters):
        return await cls.get_detail(session, filters)

    @classmethod
    async def get_other_projects(cls, session: AsyncSession, user: UserRead, accepted):
        query: Select = (
            select(Project)
            .join(Project.invitations)
            .filter(ProjectUsers.invited_id == user.id, ProjectUsers.accepted == accepted)
            .options(selectinload(Project.user).options(defer(User.hashed_password)), defer(Project.user_id))
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
