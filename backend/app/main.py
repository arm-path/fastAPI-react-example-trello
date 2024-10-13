from fastapi import FastAPI

from app.dashboards.routers import router as dashboard_router
from app.projects.routers import router as project_router
from app.tasks.routers import router as task_router
from app.users.routers import router as user_router

app = FastAPI()
app.include_router(user_router)
app.include_router(project_router)
app.include_router(dashboard_router)
app.include_router(task_router)
