import {useState} from 'react'
import {useNavigate} from 'react-router-dom'

import classes from './Settings.module.css'
import Modal from '../../auxiliary/Modal.tsx'
import InviteInProject from './InviteInProject.tsx'
import InvitedUsers from './InvitedUsers.tsx'
import ConfirmDeleteModal from './ConfirmDeleteModal.tsx'
import {useAppDispatch, useAppSelector} from '../../../redux/hooks.ts'
import {deleteProjectThunk, deleteUserThunk, setShowSettingsDetailAC} from '../../../redux/reducers/projectReducer.ts'
import {selectProjects} from '../../../redux/selectors.ts'
import {BaseInvitationType} from '../../../api/projectAPI.ts'


const SettingsProject = () => {

    const navigate = useNavigate()

    const [confirmationModal, setConfirmationModal] = useState<'invitedUser' | 'project' | null>(null)
    const [invitation, setInvitation] = useState<BaseInvitationType | null>(null)

    const {detail: project, deleteErrorMsg: errorDeleteMsg} = useAppSelector(selectProjects)
    const dispatch = useAppDispatch()

    const deleteProjectHandler = async () => {
        const action = await dispatch(deleteProjectThunk(project?.id))
        if (deleteProjectThunk.fulfilled.match(action)) {
            if (action.payload && action.payload.response && action.payload.response.status === 204) {
                navigate('/projects')
            }
        }
    }

    return (
        <Modal contentStyle={classes.container}
               closeHandler={() => dispatch(setShowSettingsDetailAC(false))}>
            <div>
                <h3 className={classes.header}>Настройки проекта</h3>
                {errorDeleteMsg && <div className={classes.errorAlert}>{errorDeleteMsg}</div>}
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
                        {project && project.invitations.map(el => {
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
                                        projectId: project?.id,
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