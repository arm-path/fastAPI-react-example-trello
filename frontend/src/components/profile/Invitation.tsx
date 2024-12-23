import classes from './Profile.module.css'

import {InvitationProjectsType} from '../../api/userAPI.ts'
import {invitationProjectAcceptThunk, invitationProjectDeleteThunk} from '../../redux/reducers/userReducer.ts';
import {useAppDispatch, useAppSelector} from '../../redux/hooks.ts';
import {selectUser} from '../../redux/selectors.ts'

type PropsType = {
    invitation: InvitationProjectsType
}

const Invitation = (props: PropsType) => {

    const {id, title, user} = props.invitation

    const {invitationProjectAction: invitation} = useAppSelector(selectUser)
    const dispatch = useAppDispatch()


    return (
        <tr>
            <td>{title}</td>
            <td>{user.email}</td>
            <td className={invitation.isGetPending && invitation.id === id ? classes.invitationLoading : classes.accept}
                onClick={() => dispatch(invitationProjectAcceptThunk(id))}>
                {invitation.isGetPending && invitation.id === id ? 'Loading...' : 'Принять'}
            </td>
            <td className={invitation.isGetPending && invitation.id === id ? classes.invitationLoading : classes.delete}
                onClick={()=>dispatch(invitationProjectDeleteThunk(id))}>
                {invitation.isGetPending && invitation.id === id ? 'Loading...' : 'Удалить'}
            </td>
        </tr>
    )
}

export default Invitation