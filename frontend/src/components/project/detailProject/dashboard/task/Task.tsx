import classes from './Task.module.css'
import {TaskType} from '../../../../../api/dashboardAPI.ts'
import dateFormat from '../../../../../utils/dateFormat.ts'

type TaskProps = {
    data: TaskType
}


const Task = (props: TaskProps) => {
    const task = props.data

    return (
        <div className={classes.container}>
            <div className={classes.title}>{task.title}</div>
            <b><small>Срок:</small></b>
            <div><small>{dateFormat(task.deadline)}</small></div>
            <b><small>Создан:</small></b>
            <div><small>{dateFormat(task.created)}</small></div>
        </div>
    )
}

export default Task