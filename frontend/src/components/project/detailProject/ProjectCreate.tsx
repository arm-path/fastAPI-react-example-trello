import {ChangeEvent} from 'react'

import classes from '../project.module.css'
import Input from '../../form/input/Input.tsx'
import Button from '../../form/button/Button.tsx'
import ButtonLoading from '../../form/button/ButtonLoading.tsx'
import {changeTitleCreateProjectAC, createProjectThunk} from '../../../redux/reducers/projectReducer.ts'
import {useAppDispatch, useAppSelector} from '../../../redux/hooks.ts'

const ProjectCreate = () => {

    const dispatch = useAppDispatch()
    const form = useAppSelector(state => state.projects.createForm)

    return (
        <div>
            <span className={classes.error}>{form.error}</span>
            <Input placeholder='Проект'
                   value={form.title}
                   error=''
                   onchangeHandler={(e: ChangeEvent<HTMLInputElement>) => {
                       dispatch(changeTitleCreateProjectAC(e.target.value))
                   }}/>
            <div style={{textAlign: 'center'}}>
                {form.loading
                    ? <ButtonLoading/>
                    : <Button type='button' title='Добавить' style='success'
                              onClickHandler={() => {
                                  dispatch(createProjectThunk())
                              }}/>}
            </div>
        </div>
    )
}

export default ProjectCreate