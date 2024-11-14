import classes from './Task.module.css';
import {TaskDetailType} from '../../../../../api/taskAPI.ts';
import Button from '../../../../form/button/Button.tsx';
import {useAppDispatch} from '../../../../../redux/hooks.ts';
import {closeDetailModal} from '../../../../../redux/reducers/taskReducer.ts';
import dateFormat from '../../../../../utils/dateFormat.ts';


type PropsType = {
    task: TaskDetailType
}

const TaskDetail = (props: PropsType) => {
    const {task} = props

    const dispatch = useAppDispatch()

    return (
        <div className={classes.modalContainer}>
            <div className={classes.modalContent}>
                <div className={classes.modalClose}>
                    <Button type='button'
                            title='X'
                            style='danger'
                            onClickHandler={() => {
                                dispatch(closeDetailModal())
                            }}/>
                </div>
                <div><b>Название: </b><span>{task.title}</span></div>
                <div><b>Срок: </b><span>{dateFormat(task.deadline)}</span></div>
                <div><b>Создан: </b>{dateFormat(task.created)}</div>
                <div><b>Обновлен: </b>{dateFormat(task.updated)}</div>
                <div><b>Описание: </b><span>{task.description}</span></div>
                <div>
                    <b>Создал: </b>
                    {task.creator.email} ({task.creator.first_name} {task.creator.last_name})
                </div>
                <div>
                    <b>Ответственные: </b>
                    <span>
                        {task.responsible.map(el => `${el.email} (${el.first_name} ${el.last_name})  `)}
                    </span>
                </div>

            </div>
        </div>
    )
}

export default TaskDetail