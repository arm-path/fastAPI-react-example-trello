import {BaseInvitationType} from '../../../api/projectAPI.ts'
import Button from '../../form/button/Button.tsx'
import {useAppDispatch, useAppSelector} from '../../../redux/hooks.ts'
import {deleteUserThunk} from '../../../redux/reducers/projectReducer.ts'

type PropsType = {
    invitation: BaseInvitationType
    setConfirmation: () => void
}

const ConfirmDeleteModal = (props: PropsType) => {
    const {invitation, setConfirmation} = props

    const dispatch = useAppDispatch()
    const projectId = useAppSelector(state => state.projects.detail?.id)

    return (
        <div>
            <h4 style={{textAlign: 'center'}}>Вы уверены что хотите удалить пользователя: {invitation.user.email}?</h4>
            <div style={{textAlign: 'center'}}>
                <Button type='button' title='Да' style='success' onClickHandler={() => {
                    if (projectId) {
                        dispatch(deleteUserThunk({projectId: projectId, invitationId: invitation.id}))
                        setConfirmation()
                    }
                }}/>
            </div>

        </div>
    )
}

export default ConfirmDeleteModal