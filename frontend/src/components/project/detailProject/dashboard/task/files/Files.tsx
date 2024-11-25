import {useState} from 'react'

import classes from './Files.module.css'
import FileCreate from './FileCreate.tsx'
import FileDetail from './FileDetail.tsx'
import {TaskFilesType} from '../../../../../../api/taskAPI.ts'


type TaskFilesProps = {
    task_id: number
    files: Array<TaskFilesType>
}

const Files = (props: TaskFilesProps) => {
    const [edit, setEdit] = useState(false);
    return (
        <div>
            <FileCreate task_id={props.task_id}/>
            <div className={edit ? classes.filesListContainerEdit : classes.filesListContainer}>
                {props.files.map(el => {
                    const extensions = el.url.split('.').pop();
                    return (
                        <FileDetail key={el.id} task={el} extensions={extensions} edit={edit}/>
                    )
                })}
            </div>
            <span className={classes.editAction} onClick={() => setEdit(!edit)}>
                {edit ? 'Отменить': 'Редактировать'}
            </span>
        </div>
    )
}

export default Files