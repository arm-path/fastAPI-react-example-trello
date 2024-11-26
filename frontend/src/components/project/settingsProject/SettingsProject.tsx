import Modal from '../../auxiliary/Modal.tsx'
import {setShowSettingsDetailAC} from '../../../redux/reducers/projectReducer.ts'
import {useAppDispatch} from '../../../redux/hooks.ts'

const SettingsProject = () => {

    const dispatch = useAppDispatch()

    return (
        <Modal closeHandler={() => dispatch(setShowSettingsDetailAC(false))}>
            <div>
                qwdwqd
            </div>
        </Modal>
    )
}

export default SettingsProject