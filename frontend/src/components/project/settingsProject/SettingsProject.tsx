import {useState} from 'react'

import classes from './Settings.module.css'
import Modal from '../../auxiliary/Modal.tsx'
import {deleteProjectThunk, deleteUserThunk, setShowSettingsDetailAC} from '../../../redux/reducers/projectReducer.ts'
import {useAppDispatch, useAppSelector} from '../../../redux/hooks.ts'
import InviteInProject from './InviteInProject.tsx'
import InvitedUsers from './InvitedUsers.tsx'
import {BaseInvitationType} from '../../../api/projectAPI.ts'
import ConfirmDeleteModal from './ConfirmDeleteModal.tsx'


const SettingsProject = () => {

    const [confirmationModal, setConfirmationModal] = useState<'invitedUser' | 'project' | null>(null)
    const [invitation, setInvitation] = useState<BaseInvitationType | null>(null)
    const projectId = useAppSelector(state => state.projects.detail?.id)

    const dispatch = useAppDispatch()


    const invitedUsers = useAppSelector(state => {
        return state.projects.detail?.invitations
    })

    const deleteProjectHandler = () => {
        dispatch(deleteProjectThunk(projectId))
    }

    return (
        <Modal contentStyle={classes.container}
               closeHandler={() => dispatch(setShowSettingsDetailAC(false))}>
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
                <div className={classes.deleteProject} onClick={() => setConfirmationModal('project')}>
                    Удалить проект
                </div>
                {confirmationModal === 'invitedUser' ?
                    <Modal closeHandler={() => setConfirmationModal(null)} size='sm'>
                        <div>
                            {invitation ? <ConfirmDeleteModal
                                title={`Вы уверены что хотите удалить пользователя: ${invitation.user.email}?`}
                                deleteHandler={() => {
                                    dispatch(deleteUserThunk({
                                        projectId: projectId,
                                        invitationId: invitation.id
                                    }))
                                }

                                }
                                setConfirmation={() => setConfirmationModal(null)}
                            /> : ''}
                        </div>
                    </Modal>
                    : confirmationModal === 'project' ?
                        <Modal closeHandler={() => setConfirmationModal(null)} size='sm'>
                            <div>
                                <ConfirmDeleteModal
                                    title={'Вы уверены что хотите удалить проект?'}
                                    deleteHandler={() => deleteProjectHandler()}
                                    setConfirmation={() => setConfirmationModal(null)}
                                />
                            </div>
                        </Modal> : ''
                }
            </div>
        </Modal>
    )
}

export default SettingsProject