import {ChangeEvent, useState} from 'react'

import classes from './Task.module.css'
import {useAppDispatch, useAppSelector} from '../../../../../redux/hooks.ts'
import {TaskFilesType} from '../../../../../api/taskAPI.ts'
import getIcons from '../../../../../utils/getIcon.ts'
import imgIcon from '../../../../../assets/images/iconIMAGE.svg'
import Input from '../../../../form/input/Input.tsx';
import {editFileValue, loadFileThunk} from '../../../../../redux/reducers/taskReducer.ts';
import Button from '../../../../form/button/Button.tsx';


type TaskFilesProps = {
    task_id: number
    files: Array<TaskFilesType>
}

const TaskFiles = (props: TaskFilesProps) => {

    const [showImage, setShowImage] = useState(0)
    const [formData, setFormData] = useState(new FormData());

    const baseUrl = useAppSelector(state => state.app.baseUrl)
    const fileValue = useAppSelector(state => state.tasks.files.value)

    const dispatch = useAppDispatch()

    return (
        <div>
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
            {props.files.map(el => {
                const fileExtension = el.url.split('.').pop();
                return (
                    <span key={el.id}
                          className={classes.files}
                          onMouseEnter={() => setShowImage(el.id)}
                          onMouseLeave={() => setShowImage(0)}

                    >
                        {
                            showImage === el.id && getIcons(fileExtension) === imgIcon
                                ? <a href={`${baseUrl}${el.url}`} target='_blank' download>
                                    <img className={classes.filesImages}
                                         src={`${baseUrl}${el.url}`}
                                         alt={`${el.id}`}/>
                                </a>
                                :
                                <img className={classes.thumbnail}
                                     src={getIcons(fileExtension)}
                                     alt={el.url}/>

                        }
            </span>
                )
            })}
        </div>
    )
}

export default TaskFiles