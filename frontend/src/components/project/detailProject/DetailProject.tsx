import React, {useEffect} from 'react'
import {useParams} from 'react-router-dom'

import classes from './DetailProject.module.css'
import deleteIcon from '../../../assets/images/delete.png'
import {
    deleteDashboard,
    editMovingElement,
    getDashboards,
    setEditDashboardAC,
    updateDashboard
} from '../../../redux/reducers/dashboardReducer.ts'
import {useAppDispatch, useAppSelector} from '../../../redux/hooks.ts'
import Dashboard from './dashboard/Dashboard.tsx'
import {getProjectThunk, setShowSettingsDetailAC} from '../../../redux/reducers/projectReducer.ts'
import Loader from '../../auxiliary/Loader.tsx'
import NotFound from '../../auxiliary/NotFound.tsx'
import DashboardCreate from './dashboard/DashboardCreate.tsx'
import TaskDetail from './dashboard/task/TaskDetail.tsx'
import SettingsProject from '../settingsProject/SettingsProject.tsx'
import DragAndDrop from '../../auxiliary/DragAndDrop.tsx'
import {selectDashboard, selectProjects} from '../../../redux/selectors.ts'

const DetailProject = () => {
    const params = useParams()

    const dispatch = useAppDispatch()
    const {detail: project, loading: projectLoading} = useAppSelector(selectProjects)
    const {list: dashboards, editDashboard: dashboardEdit, error, moving} = useAppSelector(selectDashboard)


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
                               style={{cursor: dashboardEdit.loading || moving.loading ? 'wait' : 'default'}}>
                            <div className={classes.settings} onClick={() => {
                                dispatch(setShowSettingsDetailAC(true))
                            }}> Настройки
                            </div>
                            <h3 className={classes.title}>Панели задач <br/> ( {project.title} ) </h3>
                            <div className={classes.deleteBasket}>
                                <DragAndDrop obj={{id: -1}}
                                             setMovingElement={editMovingElement}
                                             setIndexElement={deleteDashboard}>
                                    <img className={classes.deleteBasketImg} src={deleteIcon} alt='delete'/>
                                </DragAndDrop>
                            </div>
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