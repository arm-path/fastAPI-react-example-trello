from typing import List

from sqlalchemy import select, func, Result
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.authentication.schemas import UserRead
from app.dashboards import Dashboard
from app.dashboards.services import DashboardService
from app.database import DatabaseService
from app.exceptions import CreateForbiddenTaskException, DataConflictException, ObjectNotFoundException, \
    WrongUserIdsException, IntegrityException
from app.projects import Project
from app.stories.services import StoriesService
from app.tasks import Task, ResponsibleTask
from app.tasks.schemas import TaskCreateSchema, TaskUpdateSchema, TaskMovingDashboard


class TaskService(DatabaseService):
    model = Task

    @classmethod
    async def create_task(cls, session: AsyncSession, user: UserRead, data: TaskCreateSchema):
        dashboard = await cls.get_dashboard_project(session, data.dashboard_id)
        cls.access_check(user, dashboard)
        values = data.model_dump()
        values['creator_id'] = user.id
        values['index'] = await cls.total_task_in_dashboard(session, dashboard.id)
        task = await cls.create(session, values, [selectinload(cls.model.creator)])
        await StoriesService.story_create_task(session, user, dashboard.project_id, task)
        return task

    @classmethod
    async def update_task(cls, session: AsyncSession,
                          user: UserRead,
                          task_id: int,
                          data: TaskUpdateSchema):
        task = await cls.get_task_dashboard_project(session, task_id)
        dashboard = cls.access_check(user, task.dashboard)
        task = await cls.update(session, {'id': task_id}, data.model_dump())
        await StoriesService.story_update_task(session, user, dashboard.project_id, task)
        return task

    @classmethod
    async def delete_task(cls, session: AsyncSession, user: UserRead, task_id: int):
        options = [selectinload(cls.model.dashboard).selectinload(Dashboard.project)]
        task = await cls.get_detail(session, {'id': task_id}, options)
        if task and (task.creator_id == user.id or task.dashboard.project.user_id == user.id):
            total_index = await cls.total_task_in_dashboard(session, task.dashboard.id)
            await cls.change_index_task(session, task, total_index)
            description = StoriesService.story_task_description(task)
            project_id = task.dashboard.project_id
            await cls.delete(session, {'id': task_id})
            await StoriesService.story_delete_task(session, user, project_id, description)

    @classmethod
    async def get_tasks(cls, session: AsyncSession, user: UserRead, dashboard_id: int):
        dashboard = await cls.get_dashboard_project(session, dashboard_id)
        cls.access_check(user, dashboard)
        return await cls.get_list(session, {'dashboard_id': dashboard_id}, [selectinload(cls.model.creator)])

    @classmethod
    async def get_task(cls, session: AsyncSession, user: UserRead, task_id: int):
        options = [selectinload(Task.responsible_users), selectinload(Task.files)]
        task = await cls.get_task_dashboard_project(session, task_id, options)
        cls.access_check(user, task.dashboard)
        return task

    @classmethod
    async def moving_task_dashboard(cls, session: AsyncSession,
                                    user: UserRead,
                                    data: TaskMovingDashboard,
                                    task_id: int):
        dashboard = await cls.get_dashboard_project(session, data.dashboard_id)
        cls.access_check(user, dashboard)
        options = [selectinload(Task.creator), selectinload(cls.model.dashboard)]
        task = await cls.get_detail(session, {'id': task_id}, options)
        old_dashboard_id = task.dashboard_id
        if dashboard.project_id != task.dashboard.project_id:
            raise DataConflictException
        if task.dashboard.id != data.dashboard_id:
            previous_index_to_last = await cls.total_task_in_dashboard(session, task.dashboard_id)
            await cls.change_index_task(session, task, previous_index_to_last)
            next_index_to_last = await cls.total_task_in_dashboard(session, data.dashboard_id)
            values = {'dashboard_id': data.dashboard_id, 'index': next_index_to_last}
            task = await cls.update(session, {'id': task_id}, values, [selectinload(Task.creator)])
            task = await cls.change_index_task(session, task, data.index)
            await StoriesService.story_task_moving_dashboard(session,
                                                             user,
                                                             dashboard.project_id,
                                                             old_dashboard_id,
                                                             task.dashboard_id)
        return task

    @classmethod
    async def moving_task(cls, session: AsyncSession, user: UserRead, task_id: int, index: int):
        task = await cls.get_task_dashboard_project(session, task_id)
        cls.access_check(user, task.dashboard)
        return await cls.change_index_task(session, task, index)

    @classmethod
    async def task_assign_responsible(cls, session: AsyncSession, user: UserRead, task_id: int, user_ids: List[int]):
        task = await cls.get_task_dashboard_project(session, task_id)
        cls.access_check(user, task.dashboard)
        user_ids_set = set(user_ids)
        invited_user_ids = {users.id for users in task.dashboard.project.invited_users}
        all_users_exist = user_ids_set.issubset(invited_user_ids)
        if not all_users_exist:
            raise WrongUserIdsException
        responsible_tasks = [ResponsibleTask(task_id=task_id, responsible_id=user_id) for user_id in user_ids]
        session.add_all(responsible_tasks)
        await session.commit()

    @classmethod
    async def task_delete_responsible(cls, session: AsyncSession, user: UserRead, task_id: int, user_ids: List[int]):
        task = await cls.get_task_dashboard_project(session, task_id)
        cls.access_check(user, task.dashboard)
        responsible_tasks = await session.execute(
            select(ResponsibleTask).where(
                ResponsibleTask.task_id == task_id,
                ResponsibleTask.responsible_id.in_(user_ids)
            )
        )
        responsible_tasks = responsible_tasks.scalars().all()

        # Delete the responsible tasks
        for task in responsible_tasks:
            await session.delete(task)

        try:
            await session.commit()
        except IntegrityError:
            raise IntegrityException


    @classmethod
    async def change_index_task(cls, session: AsyncSession,
                                task: Task,
                                index: int):

        if task.index == index:
            return task
        total_count = await cls.total_task_in_dashboard(session, task.dashboard_id)

        if index < 0:
            index = 0
        elif index >= total_count:
            index = total_count - 1

        if index < task.index:
            query = (
                select(cls.model)
                .where(
                    cls.model.dashboard_id == task.dashboard_id,
                    cls.model.index >= index,
                    cls.model.index < task.index,
                    cls.model.id != task.id
                )
            )
        else:
            query = (
                select(cls.model)
                .where(
                    cls.model.dashboard_id == task.dashboard_id,
                    cls.model.index > task.index,
                    cls.model.index <= index,
                    cls.model.id != task.id
                )
            )

        result: Result[tuple[cls.model]] = await session.execute(query)
        tasks = result.scalars().all()

        for el in tasks:
            el.index += 1 if index < task.index else -1

        task.index = index

        await session.commit()

        return task

    @classmethod
    def access_check(cls, user: UserRead, dashboard: Dashboard):
        if not dashboard:
            raise ObjectNotFoundException('Dashboard')
        user_exists = any(dashboard.id == user.id for dashboard in dashboard.project.invited_users)

        if dashboard.project.user_id != user.id and not user_exists:
            raise CreateForbiddenTaskException
        return dashboard

    @classmethod
    async def get_dashboard_project(cls, session: AsyncSession, dashboard_id: int):
        options = [
            selectinload(Dashboard.project).selectinload(Project.invited_users)
        ]
        dashboard = await DashboardService.get_detail(session, {'id': dashboard_id}, options)
        if not dashboard:
            raise ObjectNotFoundException('Dashboard')
        return dashboard

    @classmethod
    async def get_task_dashboard_project(cls, session: AsyncSession, task_id: int, options: List = []):
        options = [
            selectinload(Task.dashboard).options(selectinload(Dashboard.project).selectinload(Project.invited_users)),
            selectinload(Task.creator),
            *options
        ]
        task = await cls.get_detail(session, {'id': task_id}, options)
        if not task:
            raise ObjectNotFoundException('Task')
        return task

    @classmethod
    async def total_task_in_dashboard(cls, session, dashboard_id):
        total_task = await session.execute(select(func.count()).where(cls.model.dashboard_id == dashboard_id))
        return total_task.scalar()


class ResponsibleTaskService(DatabaseService):
    model = ResponsibleTask
