from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy.testing.plugin.plugin_base import options

from app.dashboards import Dashboard
from app.dashboards.services import DashboardService
from app.database import DatabaseService
from app.exceptions import CreateForbiddenTaskException, DataConflictException
from app.projects import Project
from app.projects.services import ProjectService
from app.tasks import Task
from app.tasks.schemas import TaskCreateSchema, TaskUpdateSchema
from app.users.schemas import UserRead


class TaskService(DatabaseService):
    model = Task

    @classmethod
    async def check_rights(cls, session: AsyncSession,
                           user: UserRead,
                           dashboard_id: int):
        options = [selectinload(Dashboard.project).selectinload(Project.invited_users), ]
        dashboard = await DashboardService.get_detail(session, {'id': dashboard_id}, options)
        user_exists = any(dashboard.id == user.id for dashboard in dashboard.project.invited_users)

        if dashboard.project.user_id != user.id and not user_exists:
            raise CreateForbiddenTaskException

        return dashboard

    @classmethod
    async def create_task(cls, session: AsyncSession, user: UserRead, data: TaskCreateSchema):
        await cls.check_rights(session, user, data.dashboard_id)
        values = data.model_dump()
        values['creator_id'] = user.id
        return await cls.create(session, values)

    @classmethod
    async def update_task(cls, session: AsyncSession,
                          user: UserRead,
                          task_id: int,
                          data: TaskUpdateSchema):
        dashboard  = await cls.check_rights(session, user, data.dashboard_id)
        filters = {'id': task_id}
        options = [selectinload(cls.model.dashboard)]
        task = await cls.get_detail(session, filters, options)
        if dashboard.project_id != task.dashboard.project_id:
            raise DataConflictException
        values = data.model_dump()
        return await cls.update(session, filters, values)
