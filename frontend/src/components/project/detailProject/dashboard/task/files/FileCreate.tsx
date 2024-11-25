import {ChangeEvent, useState} from 'react'

import classes from './Files.module.css'
import Input from '../../../../../form/input/Input.tsx'
import Button from '../../../../../form/button/Button.tsx'
import {editFileValue, loadFileThunk} from '../../../../../../redux/reducers/taskReducer.ts'
import {useAppDispatch, useAppSelector} from '../../../../../../redux/hooks.ts'


type PropsType = {
    task_id: number
}

const FileCreate = (props: PropsType) => {

    const [formData, setFormData] = useState(new FormData());
    const fileValue = useAppSelector(state => state.tasks.files.value)

    const dispatch = useAppDispatch()

    return (
        <div className={classes.filesContainer}>
            <b>Добавить файл: </b>
            <div className={classes.filesAddContainer}>
                <Input type='file'
                       placeholder='Файл'
                       value={fileValue}
                       onchangeHandler={(e: ChangeEvent<HTMLInputElement>) => {
                           if (e.target.files?.[0]) {
                               formData.append('file', e.target.files[0]);
                               setFormData(formData)
                               dispatch(editFileValue(formData))
                           } else {
                               dispatch(editFileValue(null))
                           }
                       }}/>
                <Button
                    type='button'
                    title='+'
                    style='success'
                    className={classes.btnFileAdd}
                    onClickHandler={
                        () => {
                            dispatch(loadFileThunk(props.task_id))
                        }}/>
            </div>
        </div>
    )
}

export default FileCreate