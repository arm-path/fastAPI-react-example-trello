from typing import List

from sqlalchemy.ext.asyncio import AsyncSession

from app.dashboards import Dashboard
from app.dashboards.schemas import DashboardCreateSchema, DashboardReadSchema, DashboardUpdateSchema
from app.database import DatabaseService
from app.exceptions import ProjectNotFoundException
from app.projects.services import ProjectService
from app.users.schemas import UserRead


class DashboardService(DatabaseService):
    model = Dashboard

    @classmethod
    async def check_project(cls, session: AsyncSession, user: UserRead, project_id: int):
        filters = {'id': project_id, 'user_id': user.id}
        project = ProjectService.get_detail(session, filters)
        if not project:
            raise ProjectNotFoundException

    @classmethod
    async def create_dashboard(cls, session: AsyncSession,
                               user: UserRead,
                               project_id: int,
                               data: DashboardCreateSchema) -> DashboardReadSchema:
        await cls.check_project(session, user, project_id)
        values = data.model_dump()
        values['project_id'] = project_id
        return await cls.create(session, values)

    @classmethod
    async def update_dashboard(cls,
                               session: AsyncSession,
                               user: UserRead,
                               project_id: int,
                               dashboard_id: int,
                               data: DashboardUpdateSchema) -> DashboardReadSchema:
        await cls.check_project(session, user, project_id)
        filters = {'id': dashboard_id}
        values = data.model_dump()
        values['project_id'] = project_id
        return await cls.update(session, filters, values)

    @classmethod
    async def delete_dashboard(cls, session: AsyncSession, user: UserRead, project_id: int, dashboard_id: int) -> None:
        await cls.check_project(session, user, project_id)
        filters = {'id': dashboard_id}
        await cls.delete(session, filters)

    @classmethod
    async def get_dashboards(cls, session: AsyncSession,
                             user: UserRead,
                             project_id: int) -> List[DashboardReadSchema]:
        await cls.check_project(session, user, project_id)
        filters = {'project_id': project_id}
        return await cls.get_list(session, filters)

    @classmethod
    async def get_dashboard(cls, session: AsyncSession,
                            user: UserRead,
                            project_id: int,
                            dashboard_id: int) -> DashboardReadSchema:
        await cls.check_project(session, user, project_id)
        filters = {'id': dashboard_id, 'project_id': project_id}
        return await cls.get_detail(session, filters)
