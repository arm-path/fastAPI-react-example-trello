from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.authentication.schemas import UserRead
from app.dashboards import Dashboard
from app.dashboards.services import DashboardService
from app.database import DatabaseService
from app.exceptions import CreateForbiddenTaskException, DataConflictException, ObjectNotFoundException
from app.projects import Project
from app.stories.services import StoriesService
from app.tasks import Task
from app.tasks.schemas import TaskCreateSchema, TaskUpdateSchema


class TaskService(DatabaseService):
    model = Task

    @classmethod
    async def check_rights(cls, session: AsyncSession,
                           user: UserRead,
                           dashboard_id: int):
        options = [selectinload(Dashboard.project).selectinload(Project.invited_users), ]
        dashboard = await DashboardService.get_detail(session, {'id': dashboard_id}, options)
        if not dashboard:
            raise ObjectNotFoundException('Dashboard')
        user_exists = any(dashboard.id == user.id for dashboard in dashboard.project.invited_users)

        if dashboard.project.user_id != user.id and not user_exists:
            raise CreateForbiddenTaskException
        return dashboard

    @classmethod
    async def edit_task(cls,
                        session: AsyncSession,
                        user: UserRead,
                        task_id: int,
                        dashboard_id: int,
                        values: dict):
        dashboard = await cls.check_rights(session, user, dashboard_id)
        filters = {'id': task_id}
        options = [selectinload(cls.model.dashboard)]
        task = await cls.get_detail(session, filters, options)
        if dashboard.project_id != task.dashboard.project_id:
            raise DataConflictException
        task = await cls.update(session, filters, values)
        await StoriesService.story_update_task(session, user, dashboard.project_id, task)
        return task

    @classmethod
    async def create_task(cls, session: AsyncSession, user: UserRead, data: TaskCreateSchema):
        dashboard = await cls.check_rights(session, user, data.dashboard_id)
        values = data.model_dump()
        values['creator_id'] = user.id
        task = await cls.create(session, values)
        await StoriesService.story_create_task(session, user, dashboard.project_id, task)
        return task

    @classmethod
    async def update_task(cls, session: AsyncSession,
                          user: UserRead,
                          task_id: int,
                          data: TaskUpdateSchema):
        options = [selectinload(cls.model.dashboard)]
        task = await cls.get_detail(session, {'id': task_id}, options)
        dashboard = await cls.check_rights(session, user, task.dashboard.id)
        task = await cls.update(session, {'id': task_id}, data.model_dump())
        await StoriesService.story_update_task(session, user, dashboard.project_id, task)
        return task

    @classmethod
    async def delete_task(cls, session: AsyncSession, user: UserRead, task_id: int):
        filters = {'id': task_id}
        options = [
            selectinload(cls.model.dashboard).selectinload(Dashboard.project)
        ]
        task = await cls.get_detail(session, filters, options)
        if task and (task.creator_id == user.id or task.dashboard.project.user_id == user.id):
            await cls.delete(session, filters)

    @classmethod
    async def get_tasks(cls, session: AsyncSession, user: UserRead, dashboard_id: int):
        await cls.check_rights(session, user, dashboard_id)
        return await cls.get_list(session, {'dashboard_id': dashboard_id})

    @classmethod
    async def get_task(cls, session: AsyncSession, user: UserRead, dashboard_id: int, task_id: int):
        await cls.check_rights(session, user, dashboard_id)
        filters = {'id': task_id, 'dashboard_id': dashboard_id}
        return await cls.get_detail(session, filters)

    @classmethod
    async def moving_between_dashboard(cls, session: AsyncSession, user: UserRead, dashboard_id: int, task_id: int):
        dashboard = await cls.check_rights(session, user, dashboard_id)
        filters = {'id': task_id}
        options = [selectinload(cls.model.dashboard)]
        task = await cls.get_detail(session, filters, options)
        old_dashboard_id = task.dashboard_id
        if dashboard.project_id != task.dashboard.project_id:
            raise DataConflictException
        if task.dashboard.id != dashboard_id:
            task = await cls.update(session, filters, {'dashboard_id': dashboard_id})
            await StoriesService.story_moving_between_dashboard(session,
                                                                user,
                                                                dashboard.project_id,
                                                                old_dashboard_id,
                                                                task.dashboard_id)
        return task
