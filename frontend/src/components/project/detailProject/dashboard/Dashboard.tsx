import {DashboardListType} from '../../../../api/dashboardAPI'

import classes from './Dashboard.module.css'
import Task from './task/Task.tsx';
import CreateTask from './task/CreateTask.tsx'
import DragAndDrop from '../../../auxiliary/DragAndDrop.tsx'
import DashboardUpdate from './DashboardUpdate.tsx'
import {editMovingElement, movingDashboard} from '../../../../redux/reducers/dashboardReducer'

type DashboardProps = {
    data: DashboardListType
}

const Dashboard = (props: DashboardProps) => {
    const data = props.data

    return (
        <div className={classes.container}>
            <DragAndDrop obj={data} setMovingElement={editMovingElement} setIndexElement={movingDashboard}>
                <DashboardUpdate data={data}/>
            </DragAndDrop>
            <hr/>
            {data.tasks.map(el => <Task key={el.id} data={el}/>)}
            <hr/>
            <CreateTask dashboardID={data.id}/>
        </div>
    )
}

export default Dashboard