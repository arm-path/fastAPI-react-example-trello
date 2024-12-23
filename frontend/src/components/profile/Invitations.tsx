import {useEffect} from 'react'

import classes from './Profile.module.css'
import {useAppDispatch, useAppSelector} from '../../redux/hooks.ts'
import {selectUser} from '../../redux/selectors.ts'
import {InvitationProjectsType} from '../../api/userAPI.ts'
import {getInvitationProjectsThunk} from '../../redux/reducers/userReducer.ts'
import Invitation from './Invitation.tsx';


const Invitations = () => {

    const {invitationProjects: invitations} = useAppSelector(selectUser)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(getInvitationProjectsThunk())
    }, [dispatch])

    return (
        <div>
            <table className={classes.invitationsUsersTable}>
                <thead>
                <tr>
                    <td>Проект</td>
                    <td>Пользователь</td>
                    <td>Принять</td>
                    <td>Отклонить</td>
                </tr>
                </thead>

                {invitations.list.map((invitation: InvitationProjectsType) => (
                    <Invitation invitation={invitation}/>
                ))}
            </table>
        </div>
    )
}


export default Invitations