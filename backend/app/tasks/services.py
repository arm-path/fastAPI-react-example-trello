from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import DatabaseService
from app.exceptions import CreateForbiddenTaskException
from app.projects import Project
from app.projects.services import ProjectService
from app.tasks import Task
from app.tasks.schemas import TaskCreateSchema
from app.users.schemas import UserRead


class TaskService(DatabaseService):
    model = Task

    @classmethod
    async def check_rights(cls, session: AsyncSession,
                           user: UserRead,
                           project_id: int,
                           dashboard_id: int):

        options = [selectinload(Project.dashboards), selectinload(Project.invited_users)]
        project = await ProjectService.get_detail(session, {'id': project_id}, options)
        dashboard_exists = any(dashboard.id == dashboard_id for dashboard in project.dashboards)
        user_exists = any(dashboard.id == user.id for dashboard in project.invited_users)
        if not dashboard_exists:
            raise CreateForbiddenTaskException
        if project.user_id != user.id and not user_exists:
            raise CreateForbiddenTaskException

    @classmethod
    async def create_task(cls, session: AsyncSession,
                          user: UserRead,
                          project_id: int,
                          dashboard_id: int,
                          data: TaskCreateSchema):
        await cls.check_rights(session, user, project_id, dashboard_id)
        values = data.model_dump()
        values['dashboard_id'] = dashboard_id
        values['creator_id'] = user.id
        return await cls.create(session, values)
