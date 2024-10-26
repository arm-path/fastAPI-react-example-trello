import os

from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.authentication.schemas import UserRead
from app.database import DatabaseService
from app.exceptions import (HighFileSizeException,
                            UnsupportedFileTypeException,
                            FileSystemErrorException,
                            UnexpectedErrorOccurred,
                            FileNotFoundException)
from app.files import File
from app.settings import settings
from app.stories.services import StoriesService
from app.tasks.services import TaskService


class FileService(DatabaseService):
    model = File

    @classmethod
    async def upload_file(cls, session: AsyncSession, user: UserRead, file: UploadFile, task_id: int):
        cls.check_file(file)
        task = await TaskService.get_task_dashboard_project(session, task_id)
        TaskService.access_check(user, task.dashboard)
        path_to_file = cls.generate_path(task.dashboard.project_id, task.dashboard_id, file.filename)
        await cls.save_file(file, path_to_file)
        values = {'task_id': task.id, 'user_id': user.id, 'url': path_to_file}
        file = await cls.create(session, values)
        await StoriesService.story_task_load_file(session, user, task.dashboard.project_id, path_to_file)
        return file

    @classmethod
    async def delete_file(cls, session: AsyncSession, user: UserRead, file_id: int):
        file = await cls.get_detail(session, {'id': file_id})
        if not file:
            raise FileNotFoundException
        task = await TaskService.get_task_dashboard_project(session, file.task_id)
        TaskService.access_check(user, task.dashboard)
        try:
            os.remove(file.url)
        except FileNotFoundError:
            raise FileNotFoundException
        except Exception as e:
            raise UnexpectedErrorOccurred

        await cls.delete(session, {'id': file.id})
        await StoriesService.story_task_delete_file(session, user, task.dashboard.project_id, task.id)


    @classmethod
    def check_file(cls, file: UploadFile):
        if file.size > 5 * 1024 * 1024:
            raise HighFileSizeException
        if file.content_type not in settings.ALLOWED_MIME_TYPES:
            raise UnsupportedFileTypeException

    @classmethod
    async def save_file(cls, file: UploadFile, file_path: str):
        try:
            with open(file_path, "wb") as buffer:
                while content := await file.read(1024):
                    buffer.write(content)
        except OSError as e:
            raise FileSystemErrorException
        except Exception as e:
            raise UnexpectedErrorOccurred

    @classmethod
    def generate_path(cls, project_id: int, task_id: int, file_name: str):
        static_directory = f'static/{project_id}/{task_id}'
        os.makedirs(static_directory, exist_ok=True)
        path_to_file = f'{static_directory}/{file_name}'
        return path_to_file
