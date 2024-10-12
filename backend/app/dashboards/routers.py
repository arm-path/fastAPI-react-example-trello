from typing import Annotated, List

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.dashboards.schemas import DashboardCreateSchema, DashboardUpdateSchema, DashboardReadSchema, \
    DashboardMovingSchema
from app.dashboards.services import DashboardService
from app.database import db_settings
from app.users.dependencies import current_user
from app.users.schemas import UserRead

router = APIRouter(
    prefix='/dashboard',
    tags=['Dashboard']
)


@router.post('/{project_id}/create/', response_model=DashboardReadSchema)
async def create_dashboard(session: Annotated[AsyncSession, Depends(db_settings.get_session)],
                           user: Annotated[UserRead, Depends(current_user)],
                           project_id: int,
                           data: DashboardCreateSchema):
    return await DashboardService.create_dashboard(session, user, project_id, data)


@router.put('/{project_id}/update/{dashboard_id}/', response_model=DashboardReadSchema)
async def update_dashboard(session: Annotated[AsyncSession, Depends(db_settings.get_session)],
                           user: Annotated[UserRead, Depends(current_user)],
                           project_id: int,
                           dashboard_id: int,
                           data: DashboardUpdateSchema):
    return await DashboardService.update_dashboard(session, user, project_id, dashboard_id, data)


@router.put('/{project_id}/moving/{dashboard_id}')
async def moving_dashboard(session: Annotated[AsyncSession, Depends(db_settings.get_session)],
                           user: Annotated[UserRead, Depends(current_user)],
                           project_id: int,
                           dashboard_id: int,
                           data: DashboardMovingSchema):
    return await DashboardService.moving_dashboard(session, user, project_id, dashboard_id, data.index)


@router.delete('/{project_id}/delete/{dashboard_id}/', status_code=status.HTTP_204_NO_CONTENT)
async def delete_dashboard(session: Annotated[AsyncSession, Depends(db_settings.get_session)],
                           user: Annotated[UserRead, Depends(current_user)],
                           project_id: int,
                           dashboard_id: int):
    return await DashboardService.delete_dashboard(session, user, project_id, dashboard_id)


@router.get('/{project_id}/list/', response_model=List[DashboardReadSchema])
async def get_dashboards(session: Annotated[AsyncSession, Depends(db_settings.get_session)],
                         user: Annotated[UserRead, Depends(current_user)],
                         project_id: int):
    return await DashboardService.get_dashboards(session, user, project_id)


@router.get('/{project_id}/detail/{dashboard_id}/', response_model=DashboardReadSchema)
async def get_dashboard(session: Annotated[AsyncSession, Depends(db_settings.get_session)],
                        user: Annotated[UserRead, Depends(current_user)],
                        project_id: int,
                        dashboard_id: int):
    return await DashboardService.get_dashboard(session, user, project_id, dashboard_id)
