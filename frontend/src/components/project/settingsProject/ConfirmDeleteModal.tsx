import {BaseInvitationType} from '../../../api/projectAPI.ts'
import Button from '../../form/button/Button.tsx'

type PropsType = {
    invitation: BaseInvitationType
}

const ConfirmDeleteModal = (props: PropsType) => {
    const {invitation} = props
    return (
        <div>
            <h4 style={{textAlign: 'center'}}>Вы уверены что хотите удалить пользователя: {invitation.user.email}?</h4>
            <div style={{textAlign: 'center'}}>
                <Button type='button' title='Да' style='success' onClickHandler={() => {
                }}/>
            </div>

        </div>
    )
}

export default ConfirmDeleteModal