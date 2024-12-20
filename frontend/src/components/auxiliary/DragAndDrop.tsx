import {DragEvent, ReactNode} from 'react'
import classes from './DragAndDrop.module.css'
import {useAppDispatch} from '../../redux/hooks.ts'
import {ActionCreatorWithPayload} from '@reduxjs/toolkit'
import {DashboardType, TaskType} from '../../api/dashboardAPI.ts'


type DashboardBasketType = {
    id: -1
}

type ObjectType = DashboardType | TaskType | DashboardBasketType

type MovingElementAC = (ActionCreatorWithPayload<number, 'dashboardSlice/editMovingElement'>
    | ActionCreatorWithPayload<number, 'task/editMovingTask'>)

type PropsType = {
    obj: ObjectType
    setMovingElement: MovingElementAC
    setIndexElement: any
    children: ReactNode
}


const DragAndDrop = (props: PropsType) => {
    const dispatch = useAppDispatch()

    const onDragStartHandler = (e: DragEvent<HTMLDivElement>, el: ObjectType) => {
        if (el.id !== -1) {
            e.dataTransfer.setData('text', JSON.stringify(el))
            const target = e.target as HTMLElement;
            target.style.background = '#9f9d9d'
            dispatch(props.setMovingElement(el.id))
        } else {
            e.preventDefault()
            return
        }

    }

    const onDragDropHandler = (e: DragEvent<HTMLDivElement>, el: ObjectType) => {
        e.preventDefault()
        const draggedData = e.dataTransfer.getData('text/plain')
        const draggedObject: ObjectType = JSON.parse(draggedData)
        if (el.id === -1) {
            if ('project_id' in draggedObject) {
                dispatch(props.setIndexElement(draggedObject))
                return undefined
            } else {
                return undefined
            }
        } else {
            if (('project_id' in draggedObject && 'project_id' in el)
                ||
                ('dashboard_id' in draggedObject && 'dashboard_id' in el)) {
                dispatch(props.setIndexElement(el))
                e.dataTransfer.effectAllowed = 'move'
            }

            return undefined
        }

    }

    const onDragOverHandler = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()

        const target = e.target as HTMLElement;
        target.style.background = '#ffffff';
    }

    const onDragLeaveHandler = (e: DragEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        target.style.background = '#fff'

    }

    const onDragEndHandler = () => {

    }


    return (
        <div className={classes.grab} draggable={true}
             onDragStart={(e: DragEvent<HTMLDivElement>) => {
                 onDragStartHandler(e, props.obj)
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
                 onDragDropHandler(e, props.obj)
             }}>
            {props.children}
        </div>
    )
}

export default DragAndDrop