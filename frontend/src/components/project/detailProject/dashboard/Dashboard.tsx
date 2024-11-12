import {DashboardListType, TaskType} from '../../../../api/dashboardAPI'

import classes from './Dashboard.module.css'
import Task from './task/Task.tsx';
import CreateTask from './task/CreateTask.tsx'
import DragAndDrop from '../../../auxiliary/DragAndDrop.tsx'
import DashboardUpdate from './DashboardUpdate.tsx'
import {editMovingElement, movingDashboard} from '../../../../redux/reducers/dashboardReducer'
import {editMovingTask, movingTaskThunk} from '../../../../redux/reducers/taskReducer.ts'

type DashboardProps = {
    data: DashboardListType
}

const Dashboard = (props: DashboardProps) => {
    const data = props.data
    const temporaryTask: TaskType = {
        id: 0,
        title: 'temporary task',
        deadline: '1970-12-01T00:00:00',
        created: '1970-12-01T00:00:00',
        updated: '1970-12-01T00:00:00',
        index: 0,
        dashboard_id: data.id,
        creator: {
            id: 0,
            email: 'temporary@email.com',
            first_name: null,
            last_name: null,
        }

    }



    return (
        <div className={classes.container}>
            <DragAndDrop obj={data} setMovingElement={editMovingElement} setIndexElement={movingDashboard}>
                <DashboardUpdate data={data}/>
            </DragAndDrop>
            <hr/>

            {data.tasks.length > 0
                ? data.tasks.map(el => <Task key={el.id} data={el}/>)
                : <DragAndDrop obj={temporaryTask} setMovingElement={editMovingTask} setIndexElement={movingTaskThunk}>
                    <p className={classes.emptyTasks}></p>
                </DragAndDrop>
            }
            <hr/>
            <CreateTask dashboardID={data.id}/>
        </div>
    )
}

export default Dashboard