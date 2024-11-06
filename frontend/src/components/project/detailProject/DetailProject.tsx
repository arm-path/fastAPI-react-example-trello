import {useParams} from 'react-router-dom'
import React, {useEffect} from 'react'
import classes from './DetailProject.module.css'
import {getDashboards, setEditDashboardAC, updateDashboard} from '../../../redux/reducers/dashboardReducer.ts'
import {useAppDispatch, useAppSelector} from '../../../redux/hooks.ts'
import Dashboard from './dashboard/Dashboard.tsx'
import Input from '../../form/input/Input.tsx'
import Button from '../../form/button/Button.tsx'
import {getProjectThunk} from '../../../redux/reducers/projectReducer.ts'
import Loader from '../../auxiliary/Loader.tsx'
import NotFound from '../../auxiliary/NotFound.tsx'

const DetailProject = () => {
    const params = useParams()
    const dispatch = useAppDispatch()

    const project = useAppSelector(state => state.projects.detail)
    const projectLoading = useAppSelector(state => state.projects.loading)
    const dashboards = useAppSelector(state => state.dashboard.list)
    const dashboardEdit = useAppSelector(state => state.dashboard.editDashboard)

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
    }, [])

    return (
        <>
            {projectLoading
                ? <div className={classes.loaderCenter}><Loader/></div>
                : <>
                    {!project ? <NotFound/>
                        : <div className={classes.container} onClick={handleClick}
                               style={{cursor: dashboardEdit.loading ? 'wait' : 'default'}}>
                            <h3 className={classes.title}>Панели задач <br/> ( {project.title} ) </h3>
                            <div className={dashboardEdit.error && classes.error}>{dashboardEdit.error}</div>
                            <div className={classes.dashboards}>
                                <div className={classes.dashboardCreate}>
                                    <h4 className={classes.createTitle}>Создать панель</h4>
                                    <Input type='text' placeholder='Название' value=''/>
                                    <div className={classes.btnCenter}>
                                        <Button type='button' title='Создать' style='success'
                                                onClickHandler={() => console.log()}/>
                                    </div>
                                </div>

                                {dashboards.map(el => <Dashboard key={el.id} data={el}/>)}
                            </div>
                        </div>
                    }
                </>
            }
        </>
    )
}

export default DetailProject