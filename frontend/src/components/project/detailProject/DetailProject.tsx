import {useParams} from 'react-router-dom'
import React, {useEffect} from 'react'
import classes from './DetailProject.module.css'
import {getDashboards, setEditDashboardAC, updateDashboard} from '../../../redux/reducers/dashboardReducer.ts'
import {useAppDispatch, useAppSelector} from '../../../redux/hooks.ts'
import Dashboard from './dashboard/Dashboard.tsx'
import {getProjectThunk, setShowSettingsDetailAC} from '../../../redux/reducers/projectReducer.ts'
import Loader from '../../auxiliary/Loader.tsx'
import NotFound from '../../auxiliary/NotFound.tsx'
import DashboardCreate from './dashboard/DashboardCreate.tsx'
import TaskDetail from './dashboard/task/TaskDetail.tsx'
import SettingsProject from '../settingsProject/SettingsProject.tsx'

const DetailProject = () => {
    const params = useParams()
    const dispatch = useAppDispatch()
    const project = useAppSelector(state => state.projects.detail)
    const projectLoading = useAppSelector(state => state.projects.loading)
    const dashboards = useAppSelector(state => state.dashboard.list)
    const dashboardEdit = useAppSelector(state => state.dashboard.editDashboard)
    const error = useAppSelector(state => state.dashboard.error)
    const movingLoading = useAppSelector(state => state.dashboard.moving.loading)

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const target = event.target as HTMLElement;
        if (!(target instanceof HTMLInputElement)) {
            if (dashboardEdit.id) {
                if (dashboardEdit.title != dashboardEdit.oldTitle) {
                    dispatch(updateDashboard())
                    dispatch(setEditDashboardAC(null));
                } else {
                    dispatch(setEditDashboardAC(null));
                }
            }
        }
    }

    useEffect(() => {
        dispatch(getDashboards(Number(params.projectID)))
        dispatch(getProjectThunk(Number(params.projectID)))
    }, [params.projectID, dispatch])

    const task = useAppSelector((state) => state.tasks.detail)

    const showSettings = useAppSelector(state => state.projects.showSettingsDetail)

    return (
        <>
            {projectLoading
                ? <div className={classes.loaderCenter}><Loader/></div>
                : <>
                    {!project ? <NotFound/>
                        : <div className={classes.container} onClick={handleClick}
                               style={{cursor: dashboardEdit.loading || movingLoading ? 'wait' : 'default'}}>
                            <div className={classes.settings} onClick={() => {
                                dispatch(setShowSettingsDetailAC(true))
                            }}> Настройки
                            </div>
                            <h3 className={classes.title}>Панели задач <br/> ( {project.title} ) </h3>
                            <div className={error && classes.error}>{error}</div>
                            <div className={classes.dashboards}>
                                <DashboardCreate/>
                                {dashboards.map(el => <Dashboard key={el.id} data={el}/>)}
                            </div>
                            {task && <TaskDetail task={task}/>}
                            {showSettings && <SettingsProject/>}
                        </div>
                    }
                </>
            }
        </>
    )
}

export default DetailProject