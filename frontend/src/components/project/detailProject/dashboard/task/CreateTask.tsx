import classes from './Task.module.css';
import Input from '../../../../form/input/Input.tsx'
import Textarea from '../../../../form/input/TextArea.tsx'
import Button from '../../../../form/button/Button.tsx'
import {ChangeEvent, useState} from 'react';
import {useAppDispatch} from '../../../../../redux/hooks.ts';
import {createTaskThunk} from '../../../../../redux/reducers/taskReducer.ts';


type CreateTaskPropsType = {
    dashboardID: number
}

const CreateTask = (props: CreateTaskPropsType) => {

    const [title, setTitle] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [deadline, setDeadline] = useState<string>('')

    const dispatch = useAppDispatch()

    return (
        <div className={classes.createTaskContainer}>
            <Input containerStyles={classes.createTaskForm}
                   placeholder='Название'
                   value={title}
                   onchangeHandler={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            />
            <Textarea
                containerStyles={classes.createTaskForm}
                placeholder='Описание'
                value={description}
                onchangeHandler={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            />
            <Input
                type='datetime-local'
                placeholder='Дедлайн'
                value={deadline}
                onchangeHandler={(e: ChangeEvent<HTMLInputElement>) => setDeadline(e.target.value)}
            />
            <div className={classes.createTaskBtnContainer}>
                <Button
                    type='button'
                    title='Создать'
                    style='success'
                    onClickHandler={() => {
                        dispatch(createTaskThunk({
                            title: title,
                            description: description,
                            deadline: deadline,
                            dashboard_id: props.dashboardID
                        }))
                    }}
                />
            </div>
        </div>
    )
}

export default CreateTask