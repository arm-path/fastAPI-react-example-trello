import {useParams} from 'react-router-dom'
import React, {ChangeEvent, useEffect} from 'react'
import classes from './DetailProject.module.css'
import {
    changeTitleCreateDashboard, createDashboard,
    getDashboards,
    setEditDashboardAC,
    updateDashboard
} from '../../../redux/reducers/dashboardReducer.ts'
import {useAppDispatch, useAppSelector} from '../../../redux/hooks.ts'
import Dashboard from './dashboard/Dashboard.tsx'
import Input from '../../form/input/Input.tsx'
import Button from '../../form/button/Button.tsx'
import {getProjectThunk} from '../../../redux/reducers/projectReducer.ts'
import Loader from '../../auxiliary/Loader.tsx'
import NotFound from '../../auxiliary/NotFound.tsx'
import ButtonLoading from '../../form/button/ButtonLoading.tsx';

const DetailProject = () => {
    const params = useParams()
    const dispatch = useAppDispatch()

    const project = useAppSelector(state => state.projects.detail)
    const projectLoading = useAppSelector(state => state.projects.loading)
    const dashboards = useAppSelector(state => state.dashboard.list)
    const dashboardEdit = useAppSelector(state => state.dashboard.editDashboard)
    const error = useAppSelector(state => state.dashboard.error)
    const createFormDashboard = useAppSelector(state => state.dashboard.formDashboard)
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
    }, [])

    return (
        <>
            {projectLoading
                ? <div className={classes.loaderCenter}><Loader/></div>
                : <>
                    {!project ? <NotFound/>
                        : <div className={classes.container} onClick={handleClick}
                               style={{cursor: dashboardEdit.loading || movingLoading ? 'wait' : 'default'}}>
                            <h3 className={classes.title}>Панели задач <br/> ( {project.title} ) </h3>
                            <div className={error && classes.error}>{error}</div>
                            <div className={classes.dashboards}>
                                <div className={classes.dashboardCreate}>
                                    <h4 className={classes.createTitle}>Создать панель</h4>
                                    <Input type='text' placeholder='Название' value={createFormDashboard.title}
                                           onchangeHandler={(e: ChangeEvent<HTMLInputElement>) => {
                                               dispatch(changeTitleCreateDashboard(e.target.value))
                                           }}/>
                                    <div className={classes.btnCenter}>
                                        {createFormDashboard.loading
                                            ? <ButtonLoading/>
                                            : <Button type='button' title='Создать' style='success'
                                                      onClickHandler={() => dispatch(createDashboard())}/>
                                        }
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