import {ChangeEvent, DragEvent} from 'react'
import {DashboardListType} from '../../../../api/dashboardAPI'
import classes from './Dashboard.module.css'
import Input from '../../../form/input/Input'
import {
    changeEditDashboardAC,
    editMovingElement,
    movingDashboard,
    setEditDashboardAC
} from '../../../../redux/reducers/dashboardReducer'
import {useAppDispatch, useAppSelector} from '../../../../redux/hooks'
import Task from './task/Task.tsx';
import CreateTask from './task/CreateTask.tsx'


type DashboardProps = {
    data: DashboardListType
}

const Dashboard = (props: DashboardProps) => {
    const dispatch = useAppDispatch()
    const editEl = useAppSelector(state => state.dashboard.editDashboard)
    const data = props.data
    const edit = editEl.id === data.id

    const onDragStartHandler = (e: DragEvent<HTMLDivElement>, el: DashboardListType) => {
        const target = e.target as HTMLElement;
        target.style.background = '#4db04d'
        dispatch(editMovingElement(el.id))

    }
    const onDragDropHandler = (e: DragEvent<HTMLDivElement>, el: DashboardListType) => {
        e.preventDefault()
        dispatch(movingDashboard(el.index))
        return undefined
    }

    const onDragOverHandler = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        const target = e.target as HTMLElement;
        target.style.background = '#f9f9f9'
    }

    const onDragLeaveHandler = (e: DragEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        target.style.background = '#fff'
    }

    const onDragEndHandler = () => {

    }

    return (
        <div className={classes.container} >
            <div className={classes.grab} draggable={true}
                 onDragStart={(e: DragEvent<HTMLDivElement>) => {
                     onDragStartHandler(e, data)
                 }}
                 onDragEnd={() => {
                     onDragEndHandler()
                 }}
                 onDragLeave={(e: DragEvent<HTMLDivElement>) => {
                     onDragLeaveHandler(e)
                 }}
                 onDragOver={(e: DragEvent<HTMLDivElement>) => {
                     onDragOverHandler(e)

                 }}
                 onDrop={(e: DragEvent<HTMLDivElement>) => {
                     onDragDropHandler(e, data)
                 }}>
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
            <hr className={edit ? classes.hide : ''}/>

            {data.tasks.map(el => <Task key={el.id} data={el}/>)}
            <hr/>
            <CreateTask dashboardID={data.id}/>
        </div>
    )
}

export default Dashboard