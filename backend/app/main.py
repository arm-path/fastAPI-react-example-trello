from fastapi import FastAPI
from starlette.staticfiles import StaticFiles

from app.dashboards.routers import router as dashboard_router
from app.projects.routers import router as project_router
from app.tasks.routers import router as task_router
from app.authentication.routers import router as authentication_router
from app.users.routers import router as user_router
from app.files.routers import router as file_router
from app.stories.routers import router as story_router

app = FastAPI()

app.mount('/static', StaticFiles(directory='static'), name='static')

app.include_router(authentication_router)
app.include_router(user_router)
app.include_router(project_router)
app.include_router(dashboard_router)
app.include_router(task_router)
app.include_router(file_router)
app.include_router(story_router)
