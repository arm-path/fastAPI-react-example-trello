import classes from './Settings.module.css'
import {BaseInvitationType} from '../../../api/projectAPI.ts'

type PropsType = {
    invitation: BaseInvitationType
    confirmationDelete: (el: boolean) => void
    invitationDelete: (invitation: BaseInvitationType) => void
}

const InvitedUsers = (props: PropsType) => {
    const {invitation, confirmationDelete, invitationDelete} = props
    return (
        <tr>
            <th scope='row'>{invitation.user.email}</th>
            <td>{invitation.user.first_name} {invitation.user.last_name}</td>
            <td>{invitation.accepted ? 'Принято' : 'Не принято'}</td>
            <td className={classes.delete} onClick={() => {
                invitationDelete(invitation)
                confirmationDelete(true)
            }}>Удалить</td>
        </tr>
    )
}

export default InvitedUsers