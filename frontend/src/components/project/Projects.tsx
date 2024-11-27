import React, {useEffect} from 'react'

import classes from './project.module.css'
import withAuthRedirect from '../hoc/Authentication.tsx'
import ProjectLink from './ProjectLink.tsx'
import Loader from '../auxiliary/Loader.tsx'
import ProjectCreate from './ProjectCreate.tsx'
import {getProjects, setEditFormAC} from '../../redux/reducers/projectReducer'
import {useAppDispatch, useAppSelector} from '../../redux/hooks'


const Projects = () => {
    const dispatch = useAppDispatch()
    const projects = useAppSelector(state => state.projects.list)
    const invited_projects = useAppSelector(state => state.projects.invited_projects)
    const loading = useAppSelector(state => state.projects.loading)

    const editForm = useAppSelector(state => state.projects.updateForm)

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const target = event.target as HTMLElement;
        if (!(target instanceof HTMLInputElement)
            && !target.closest(`.${classes.editImg}`)
            && !target.closest(`.${classes.saveImg}`)) {
            dispatch(setEditFormAC(null));
        }
    }

    useEffect(() => {
        dispatch(getProjects())
    }, []);

    return (
        <div className={classes.container} onClick={handleClick}>
            <div className={classes.contentContainer}>
                <h3 className={classes.title}>Список проектов</h3>
                <div className={classes.content}>
                    {loading
                        ? <Loader/>
                        : projects.map(
                            (el) =>
                                <ProjectLink
                                    key={el.id}
                                    id={el.id}
                                    title={el.title}
                                    editForm={editForm}
                                    invited={false}
                                />
                        )
                    }
                    <hr/>
                    <h3 className={classes.title}>Приглашенные проекты</h3>
                    <div className={classes.content}>
                        {loading
                            ? <Loader/>
                            : invited_projects.map((el) =>
                                <ProjectLink
                                    key={el.id}
                                    id={el.id}
                                    title={el.title}
                                    editForm={editForm}
                                    invited={true}
                                />)
                        }
                        <hr/>
                    </div>
                    <ProjectCreate/>
                </div>
            </div>
        </div>
    )
}

export default withAuthRedirect(Projects)