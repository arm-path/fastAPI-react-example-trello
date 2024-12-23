import {ChangeEvent} from 'react'

import classes from './Dashboard.module.css'
import {changeEditDashboardAC, setEditDashboardAC} from '../../../../redux/reducers/dashboardReducer.ts'
import Input from '../../../form/input/Input.tsx'
import {useAppDispatch, useAppSelector} from '../../../../redux/hooks.ts'
import {DashboardListType} from '../../../../api/dashboardAPI.ts'
import {selectDashboard} from '../../../../redux/selectors.ts';


type DashboardUpdatePropsType = {
    data: DashboardListType
}

const DashboardUpdate = (props: DashboardUpdatePropsType) => {
    const {data} = props

    const {editDashboard: editEl} = useAppSelector(selectDashboard)
    const dispatch = useAppDispatch()

    const edit = editEl.id === data.id

    return (
        <div>
            <div onDoubleClick={() => dispatch(setEditDashboardAC(data.id))}
                 className={edit ? classes.hide : classes.show}>
                {data.title}
            </div>

            <div className={edit ? classes.show : classes.hide}>
                <Input
                    placeholder={data.title}
                    value={editEl.title}
                    styles={classes.text}
                    onchangeHandler={(e: ChangeEvent<HTMLInputElement>) => {
                        dispatch(changeEditDashboardAC(e.target.value))
                    }}
                />
            </div>
        </div>
    )
}

export default DashboardUpdate