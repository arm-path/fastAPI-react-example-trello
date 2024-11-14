import classes from './Task.module.css'
import {TaskType} from '../../../../../api/dashboardAPI.ts'
import dateFormat from '../../../../../utils/dateFormat.ts'
import DragAndDrop from '../../../../auxiliary/DragAndDrop.tsx';
import {detailTaskThunk, editMovingTask, movingTaskThunk} from '../../../../../redux/reducers/taskReducer.ts'
import {useAppDispatch} from '../../../../../redux/hooks.ts';

type TaskProps = {
    data: TaskType
}


const Task = (props: TaskProps) => {
    const task = props.data
    const dispatch = useAppDispatch()

    return (
        <div className={classes.container}
             onDoubleClick={() => dispatch(detailTaskThunk(task.id))}>
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