import classes from './Settings.module.css'

import Modal from '../../auxiliary/Modal.tsx'
import {setShowSettingsDetailAC} from '../../../redux/reducers/projectReducer.ts'
import {useAppDispatch} from '../../../redux/hooks.ts'

const SettingsProject = () => {

    const dispatch = useAppDispatch()

    return (
        <Modal closeHandler={() => dispatch(setShowSettingsDetailAC(false))}>
            <div>
                <h3 className={classes.header}>Настройки проекта</h3>
                <div>
                    <b>Приглашенные пользователи: </b>
                </div>
            </div>
        </Modal>
    )
}

export default SettingsProject