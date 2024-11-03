import {useEffect} from 'react'

import classes from './project.module.css'
import Input from '../form/input/Input.tsx'
import Button from '../form/button/Button.tsx'
import withAuthRedirect from '../hoc/Authentication.tsx'
import ProjectLink from './ProjectLink.tsx'
import {getProjects} from '../../redux/reducers/projectReducer.ts';
import {useAppDispatch, useAppSelector} from '../../redux/hooks.ts';


const Projects = () => {
    const dispatch = useAppDispatch()
    const projects = useAppSelector(state => state.projects.list)
    useEffect(() => {
        dispatch(getProjects())
    }, []);
    console.log(projects)
    return (
        <div className={classes.container}>
            <div className={classes.contentContainer}>
                <h3 className={classes.title}>Список проектов</h3>
                <div className={classes.content}>
                    {projects.map((el)=> <ProjectLink id={el.id} title={el.title}/>)}

                    <hr/>
                    <Input placeholder='Проект' value='' error='' onchangeHandler={()=>{}}/>
                    <Button type='button' title='Добавить' style='success' onClickHandler={() => {
                    }}/>
                </div>

            </div>

        </div>
    )
}

export default withAuthRedirect(Projects)