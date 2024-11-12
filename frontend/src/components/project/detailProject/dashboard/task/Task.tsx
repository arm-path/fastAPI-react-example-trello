import classes from './Task.module.css'
import {TaskType} from '../../../../../api/dashboardAPI.ts'
import dateFormat from '../../../../../utils/dateFormat.ts'
import DragAndDrop from '../../../../auxiliary/DragAndDrop.tsx';
import {editMovingTask, movingTaskThunk} from '../../../../../redux/reducers/taskReducer.ts'

type TaskProps = {
    data: TaskType
}


const Task = (props: TaskProps) => {
    const task = props.data

    return (
        <div className={classes.container}>
            <DragAndDrop obj={task} setMovingElement={editMovingTask} setIndexElement={movingTaskThunk}>
                <div className={classes.title}>{task.title}</div>
                <b><small>Срок:</small></b>
                <div><small>{dateFormat(task.deadline)}</small></div>
                <b><small>Создан:</small></b>
                <div><small>{dateFormat(task.created)}</small></div>
            </DragAndDrop>

        </div>
    )
}

export default Task