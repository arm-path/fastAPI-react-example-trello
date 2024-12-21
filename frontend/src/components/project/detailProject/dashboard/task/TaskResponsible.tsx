import {useState} from 'react'

import classes from './Task.module.css'
import Select from '../../../../form/input/Select.tsx'
import {BaseUserType} from '../../../../../api/userAPI.ts'
import {useAppDispatch, useAppSelector} from '../../../../../redux/hooks.ts'
import {assignUsersForTaskThunk, deleteUsersForTaskThunk} from '../../../../../redux/reducers/taskReducer.ts'
import getProfile from '../../../../../utils/getProfile.ts'
import Button from '../../../../form/button/Button.tsx'
import {selectProjects} from '../../../../../redux/selectors.ts'
import {BaseInvitationType} from '../../../../../api/projectAPI.ts'

type TaskResponsiblePropsType = {
    responsible: Array<BaseUserType>
}

const TaskResponsible = (props: TaskResponsiblePropsType) => {

    const {detail: project} = useAppSelector(selectProjects)
    const dispatch = useAppDispatch()

    let possibleInvitation: Array<{ value: number, label: string }> = []
    const responsibleEmails = new Set(props.responsible.map((el: BaseUserType) => el.email))
    if (project) {
        possibleInvitation = project.invitations.filter(
            (el: BaseInvitationType) => el.accepted && !responsibleEmails.has(el.user.email)).map(
            (el: BaseInvitationType): { value: number, label: string } => ({
                'value': el.user.id, 'label': getProfile(el.user.email, el.user.first_name, el.user.last_name)
            })
        )
        if (!responsibleEmails.has(project.user.email)) {
            possibleInvitation.push({
                'value': project.user.id,
                'label': getProfile(project.user.email, project.user.first_name, project.user.last_name)
            })
        }
    }

    const [editResponsible, setEditResponsible] = useState(0)
    const [crossedOut, setCrossedOut] = useState(false)


    return (
        <div>
            <b>Ответственные: </b>
            <div className={classes.responsibleContainer}>
                <Select placeholder='Пользователи'
                        options={possibleInvitation}
                        onChangeHandler={assignUsersForTaskThunk}
                />
                <div className={classes.responsibleUsers}>
                    {props.responsible.map(el =>
                        <div key={el.id} style={{marginLeft: '0.3rem', marginBottom: '3px'}}
                             onDoubleClick={() => setEditResponsible(el.id)}
                        >
                            {editResponsible === el.id ?
                                <span>
                                    <span className={crossedOut ? classes.textLineThrough : ''}>
                                        {getProfile(el.email, el.first_name, el.last_name)}
                                    </span>

                                    <span
                                        onMouseEnter={() => setCrossedOut(true)}
                                        onMouseLeave={() => setCrossedOut(false)}>
                                        <Button type='button'
                                                title='X'
                                                style='danger'
                                                className={classes.responsibleUserRemove}
                                                onClickHandler={() => {
                                                    dispatch(deleteUsersForTaskThunk(el.id))
                                                }}
                                        />
                                    </span>

                                </span>

                                : getProfile(el.email, el.first_name, el.last_name)
                            }

                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default TaskResponsible