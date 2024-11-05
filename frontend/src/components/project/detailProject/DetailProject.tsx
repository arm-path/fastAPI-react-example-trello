import {useParams} from 'react-router-dom'
import {useEffect} from 'react'
import classes from './DetailProject.module.css'
import {getDashboards} from '../../../redux/reducers/dashboardReducer.ts'
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
                        : <div className={classes.container}>
                            <h3 className={classes.title}>Панели задач <br/> ( {project.title} ) </h3>
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