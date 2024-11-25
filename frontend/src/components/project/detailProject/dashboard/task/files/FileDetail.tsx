import {useState} from 'react'

import classes from './Files.module.css'
import imgIcon from '../../../../../../assets/images/iconIMAGE.svg'
import {deleteFileThunk} from '../../../../../../redux/reducers/taskReducer.ts'
import getIcons from '../../../../../../utils/getIcon.ts'
import {TaskFilesType} from '../../../../../../api/taskAPI.ts'
import {useAppDispatch, useAppSelector} from '../../../../../../redux/hooks.ts';


type PropsType = {
    task: TaskFilesType
    edit: boolean
    extensions: string | undefined
}

const FileDetail = (props: PropsType) => {

    const task = props.task

    const [showImage, setShowImage] = useState(0)
    const baseUrl = useAppSelector(state => state.app.baseUrl)
    const dispatch = useAppDispatch()

    return (
        <div>
            <div className={props.edit ? classes.filesEdit : classes.files}>
                        <span key={task.id}
                              onMouseEnter={() => setShowImage(task.id)}
                              onMouseLeave={() => setShowImage(0)}>
                            {
                                showImage === task.id && getIcons(props.extensions) === imgIcon
                                    ? <a href={`${baseUrl}${task.url}`} target='_blank' download>
                                        <img className={classes.filesImages}
                                             src={`${baseUrl}${task.url}`}
                                             alt={`${task.id}`}/>
                                    </a>

                                    :
                                    <img className={classes.thumbnail}
                                         src={getIcons(props.extensions)}
                                         alt={task.url}/>
                            }

                        </span>{props.edit &&
                <span className={classes.deleteFile}
                      onClick={() => {
                          dispatch(deleteFileThunk(task.id))
                      }}>Удалить</span>
            }
            </div>
        </div>
    )
}

export default FileDetail