import {DashboardListType} from '../../../../api/dashboardAPI'
import classes from './Dashboard.module.css'
import Input from '../../../form/input/Input';
import {changeEditDashboardAC, setEditDashboardAC} from '../../../../redux/reducers/dashboardReducer'
import {useAppDispatch, useAppSelector} from '../../../../redux/hooks'
import {ChangeEvent} from 'react';


type DashboardProps = {
    data: DashboardListType
}

const Dashboard = (props: DashboardProps) => {
    const dispatch = useAppDispatch()
    const editEl = useAppSelector(state => state.dashboard.editDashboard)
    const data = props.data
    const edit = editEl.id === data.id
    return (
        <div className={classes.container}>
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

            <hr className={edit ? classes.hide : ''}/>

        </div>
    )
}

export default Dashboard