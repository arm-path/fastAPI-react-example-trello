import {ChangeEvent, useEffect} from 'react'

import classes from './project.module.css'
import Input from '../form/input/Input.tsx'
import Button from '../form/button/Button.tsx'
import withAuthRedirect from '../hoc/Authentication.tsx'
import ProjectLink from './ProjectLink.tsx'
import {changeTitleCreateProjectAC, createProjectThunk, getProjects} from '../../redux/reducers/projectReducer'
import {useAppDispatch, useAppSelector} from '../../redux/hooks'
import Loader from '../auxiliary/Loader.tsx'
import ButtonLoading from '../form/button/ButtonLoading'


const Projects = () => {
    const dispatch = useAppDispatch()
    const projects = useAppSelector(state => state.projects.list)
    const loading = useAppSelector(state => state.projects.loading)
    const form = useAppSelector(state => state.projects.createForm)
    useEffect(() => {
        dispatch(getProjects())
    }, []);

    return (
        <div className={classes.container}>
            <div className={classes.contentContainer}>
                <h3 className={classes.title}>Список проектов</h3>
                <div className={classes.content}>
                    {loading
                        ? <Loader/>
                        : projects.map((el) => <ProjectLink key={el.id} id={el.id} title={el.title}/>)
                    }
                    <hr/>
                    <span className={classes.error}>{form.error}</span>
                    <Input placeholder='Проект'
                           value={form.title}
                           error=''
                           onchangeHandler={(e: ChangeEvent<HTMLInputElement>) => dispatch(changeTitleCreateProjectAC(e.target.value))}
                    />
                    {form.loading
                        ? <ButtonLoading/>
                        : <Button type='button' title='Добавить' style='success'
                                  onClickHandler={() => dispatch(createProjectThunk())}/>}

                </div>

            </div>

        </div>
    )
}

export default withAuthRedirect(Projects)