import React, {ChangeEvent} from 'react'

import {TaskDetailType} from '../../../../../api/taskAPI.ts'
import {useAppDispatch, useAppSelector} from '../../../../../redux/hooks.ts'
import {closeDetailModal, editDetailField, updateTaskThunk} from '../../../../../redux/reducers/taskReducer.ts'
import dateFormat from '../../../../../utils/dateFormat.ts'
import Input from '../../../../form/input/Input.tsx'
import TaskResponsible from './TaskResponsible.tsx'
import Files from './files/Files.tsx';
import Modal from '../../../../auxiliary/Modal.tsx'


type PropsType = {
    task: TaskDetailType
}

const TaskDetail = (props: PropsType) => {
    const {task} = props

    const edit = useAppSelector(state => state.tasks.editDetail)
    const loading = useAppSelector(state => state.tasks.editDetailLoading)
    const error = useAppSelector(state => state.tasks.editDetailError)
    const dispatch = useAppDispatch()

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const target = event.target as HTMLElement;
        if (!(target instanceof HTMLInputElement)) {
            dispatch(updateTaskThunk())
        }
    }

    return (
        <Modal error={error} loading={loading}
               closeHandler={() => dispatch(closeDetailModal())}
               contentClickHandler={(event: React.MouseEvent<HTMLDivElement>) => handleClick(event)}>
            <div>
                <b>Название: </b>
                {edit?.field === 'title'
                    ? <Input placeholder='Название' value={edit.value}
                             onchangeHandler={(e: ChangeEvent<HTMLInputElement>) => {
                                 dispatch(editDetailField({field: 'title', value: e.target.value}))
                             }}
                    />
                    : <span onDoubleClick={() => {
                        dispatch(editDetailField({field: 'title', value: task.title}))
                    }}>
                        {task.title}
                    </span>
                }

            </div>
            <div>
                <b>Срок: </b>
                {edit?.field === 'deadline'
                    ? <Input type='datetime-local' placeholder='Дедлайн' value={edit.value}
                             onchangeHandler={(e: ChangeEvent<HTMLInputElement>) => {
                                 dispatch(editDetailField({field: 'deadline', value: e.target.value}))
                             }}/>
                    : <span onDoubleClick={() => {
                        dispatch(editDetailField({field: 'deadline', value: task.deadline}))
                    }}>
                        {task.deadline}
                    </span>
                }
            </div>
            <div><b>Создан: </b>{dateFormat(task.created)}</div>
            <div><b>Обновлен: </b>{dateFormat(task.updated)}</div>
            <div><b>Описание: </b>
                {edit?.field === 'description'
                    ? <Input type='text' placeholder='Описание' value={edit.value}
                             onchangeHandler={(e: ChangeEvent<HTMLInputElement>) => {
                                 dispatch(editDetailField({field: 'description', value: e.target.value}))
                             }}/>
                    : <span onDoubleClick={() => {
                        dispatch(editDetailField({field: 'description', value: task.description}))
                    }}>
                        {task.description ? task.description : 'Нет описания'}
                    </span>
                }
            </div>
            <div>
                <b>Создал: </b>
                {task.creator.email} ({task.creator.first_name} {task.creator.last_name})
            </div>
            <TaskResponsible responsible={task.responsible}/>
            <Files task_id={task.id} files={task.files}/>
        </Modal>
    )
}

export default TaskDetail