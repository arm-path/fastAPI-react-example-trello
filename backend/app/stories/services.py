from sqlalchemy.ext.asyncio import AsyncSession

from app.authentication.schemas import UserRead
from app.database.services import DatabaseService
from app.stories import Story


class StoriesService(DatabaseService):
    model = Story

    @classmethod
    async def story_create_task(cls,
                                session: AsyncSession,
                                user: UserRead,
                                project_id: int,
                                task):
        values = {'action': 'Create task',
                  'user_id': user.id,
                  'project_id': project_id,
                  'description': cls.story_task_description(task)}
        await cls.create(session, values)

    @classmethod
    async def story_update_task(cls,
                                session: AsyncSession,
                                user: UserRead,
                                project_id: int,
                                task):
        values = {'action': 'Update task',
                  'user_id': user.id,
                  'project_id': project_id,
                  'description': cls.story_task_description(task)}
        await cls.create(session, values)

    @classmethod
    async def story_delete_task(cls,
                                session: AsyncSession,
                                user: UserRead,
                                project_id: int,
                                description: str):
        values = {'action': 'Delete task',
                  'user_id': user.id,
                  'project_id': project_id,
                  'description': description}
        await cls.create(session, values)

    @classmethod
    async def story_moving_between_dashboard(cls,
                                             session: AsyncSession,
                                             user: UserRead,
                                             project_id: int,
                                             old_dashboard_id: int,
                                             dashboard_id: int):
        description = f' Moving dashboard_id: {old_dashboard_id} -> dashboard_id: {dashboard_id}'
        values = {'action': 'Moving task by dashboard',
                  'user_id': user.id,
                  'project_id': project_id,
                  'description': description}
        await cls.create(session, values)

    @classmethod
    def story_task_description(cls, task):
        return (f'id: {task.id}, '
                f'title: {task.title}, '
                f'dashboard_id: {task.dashboard_id}, '
                f'description: {task.description}, '
                f'deadline: {task.deadline}')
