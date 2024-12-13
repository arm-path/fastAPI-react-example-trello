from typing import List

from sqlalchemy import select, Result, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.dashboards import Dashboard
from app.dashboards.schemas import DashboardCreateSchema, DashboardReadSchema, DashboardUpdateSchema
from app.database import DatabaseService
from app.exceptions import ProjectNotFoundException
from app.projects.services import ProjectService
from app.authentication.schemas import UserRead
from app.tasks import Task


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
        total_dashboards = await session.execute(
            select(func.count()).where(cls.model.project_id == project_id)
        )
        total_count = total_dashboards.scalar()
        values = data.model_dump()
        values['project_id'] = project_id
        values['index'] = total_count
        dashboard = await cls.create(session, values)

        return await cls.moving_dashboard(session, user, project_id, dashboard.id, 0)

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
        return await cls.update(session, filters, values, [selectinload(cls.model.tasks)])

    @classmethod
    async def delete_dashboard(cls, session: AsyncSession, user: UserRead, project_id: int, dashboard_id: int):
        await cls.check_project(session, user, project_id)
        filters = {'id': dashboard_id}
        total_dashboards = await session.execute(
            select(func.count()).where(cls.model.project_id == project_id)
        )
        total_count = total_dashboards.scalar()

        await cls.moving_dashboard(session, user, project_id, dashboard_id, total_count - 1)
        await cls.delete(session, filters)
        return await cls.get_dashboards(session, user, project_id)

    @classmethod
    async def get_dashboards(cls, session: AsyncSession,
                             user: UserRead,
                             project_id: int) -> List[DashboardReadSchema]:
        await cls.check_project(session, user, project_id)
        filters = {'project_id': project_id}
        return await cls.get_list(session, filters, [selectinload(cls.model.tasks).selectinload(Task.creator)],
                                  order_by='index')

    @classmethod
    async def get_dashboard(cls, session: AsyncSession,
                            user: UserRead,
                            project_id: int,
                            dashboard_id: int) -> DashboardReadSchema:
        await cls.check_project(session, user, project_id)
        filters = {'id': dashboard_id, 'project_id': project_id}
        return await cls.get_detail(session, filters, [selectinload(cls.model.tasks).selectinload(Task.creator)])

    @classmethod
    async def moving_dashboard(cls, session: AsyncSession,
                               user: UserRead,
                               project_id: int,
                               dashboard_id: int,
                               index: int):
        await cls.check_project(session, user, project_id)

        current_dashboard = await cls.get_dashboard(session, user, project_id, dashboard_id)

        if current_dashboard.index == index:
            return await cls.get_dashboards(session, user, project_id)

        total_dashboards = await session.execute(
            select(func.count()).where(cls.model.project_id == project_id)
        )
        total_count = total_dashboards.scalar()

        # Ограничиваем новый индекс
        if index < 0:
            index = 0
        elif index >= total_count:
            index = total_count - 1

        if index < current_dashboard.index:
            query = (
                select(cls.model)
                .where(
                    cls.model.project_id == project_id,
                    cls.model.index >= index,
                    cls.model.index < current_dashboard.index,
                    cls.model.id != current_dashboard.id
                )
            )
        else:
            query = (
                select(cls.model)
                .where(
                    cls.model.project_id == project_id,
                    cls.model.index > current_dashboard.index,
                    cls.model.index <= index,
                    cls.model.id != current_dashboard.id
                )
            )

        result: Result[tuple[cls.model]] = await session.execute(query)
        dashboards = result.scalars().all()

        for dashboard in dashboards:
            dashboard.index += 1 if index < current_dashboard.index else -1

        current_dashboard.index = index

        await session.commit()

        return await cls.get_dashboards(session, user, project_id)
