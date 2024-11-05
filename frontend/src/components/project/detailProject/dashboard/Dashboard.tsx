import {DashboardListType} from '../../../../api/dashboardAPI.ts'
import classes from './Dashboard.module.css'

type DashboardProps = {
    data: DashboardListType
}

const Dashboard = (props: DashboardProps) => {
    return (
        <div className={classes.container}>
            {props.data.title}
            <hr/>
        </div>
    )
}

export default Dashboard