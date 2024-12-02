import {useState} from 'react'

import classes from './Settings.module.css'
import Modal from '../../auxiliary/Modal.tsx'
import {setShowSettingsDetailAC} from '../../../redux/reducers/projectReducer.ts'
import {useAppDispatch, useAppSelector} from '../../../redux/hooks.ts'
import InviteInProject from './InviteInProject.tsx'
import InvitedUsers from './InvitedUsers.tsx'
import {BaseInvitationType} from '../../../api/projectAPI.ts'
import ConfirmDeleteModal from './ConfirmDeleteModal.tsx'


const SettingsProject = () => {

    const [confirmationModal, setConfirmationModal] = useState<boolean>(false)
    const [invitation, setInvitation] = useState<BaseInvitationType | null>(null)
    const dispatch = useAppDispatch()

    const invitedUsers = useAppSelector(state => {
        return state.projects.detail?.invitations
    })

    return (
        <Modal closeHandler={() => dispatch(setShowSettingsDetailAC(false))}>
            <div>
                <h3 className={classes.header}>Настройки проекта</h3>
                <div>
                    <InviteInProject/>
                </div>
                <div>
                    <b>Приглашенные пользователи: </b>
                    <table className={classes.invitedUsersTable}>
                        <thead>
                        <tr>
                            <th scope="col">Электронный адрес</th>
                            <th scope="col">Пользователь</th>
                            <th scope="col">Подтверждение</th>
                            <th scope="col">Действие</th>
                        </tr>
                        </thead>
                        <tbody>
                        {invitedUsers?.map(el => {
                            return <InvitedUsers
                                key={el.id}
                                invitation={el}
                                confirmationDelete={setConfirmationModal}
                                invitationDelete={setInvitation}
                            />
                        })}
                        </tbody>
                    </table>
                </div>
                {confirmationModal &&
                    <Modal closeHandler={() => setConfirmationModal(false)} size='sm'>
                        <div>
                            {invitation ? <ConfirmDeleteModal
                                invitation={invitation}
                                setConfirmation={() => setConfirmationModal(false)}
                            /> : ''}
                        </div>
                    </Modal>
                }
            </div>
        </Modal>
    )
}

export default SettingsProject