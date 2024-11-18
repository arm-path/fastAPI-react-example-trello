import classes from './Task.module.css'
import Select from '../../../../form/input/Select.tsx'
import {BaseUserType} from '../../../../../api/userAPI.ts'
import {useAppSelector} from '../../../../../redux/hooks.ts'
import {assignUsersForTaskThunk} from '../../../../../redux/reducers/taskReducer.ts';

type TaskResponsiblePropsType = {
    responsible: Array<BaseUserType>
}

const TaskResponsible = (props: TaskResponsiblePropsType) => {
    const projectUsers = useAppSelector(state => state.projects.detail?.invitations)
    let possibleInvitation: any = []
    if (projectUsers) {
        const responsibleEmails = new Set(props.responsible.map(el => el.email))
        possibleInvitation = projectUsers.filter(el => el.accepted && !responsibleEmails.has(el.user.email)).map(
            el => ({
                'value': el.user.id,
                'label': `${el.user.email}${(el.user.first_name || el.user.last_name) ? ` (${el.user.first_name} ${el.user.last_name})` : ''}`,
            })
        )
    }
    return (
        <div>
            <b>Ответственные: </b>
            <span className={classes.responsibleContainer}>
                <Select placeholder='Пользователи'
                        options={possibleInvitation}
                        onChangeHandler={assignUsersForTaskThunk}
                />
                <span className={classes.responsibleUsers}>
                    {props.responsible.map(el =>
                        <span style={{marginRight: '0.3rem'}}>
                            {el.email} {(el.first_name || el.last_name) ? ` (${el.first_name} ${el.last_name})` : ''}
                        </span>
                    )}
                </span>
            </span>
        </div>
    )
}

export default TaskResponsible