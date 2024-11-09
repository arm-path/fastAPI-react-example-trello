import {DragEvent, ReactNode} from 'react'
import classes from './DragAndDrop.module.css'
import {useAppDispatch} from '../../redux/hooks.ts'
import {ActionCreatorWithPayload} from '@reduxjs/toolkit'


type ObjectType = {
    id: number;
    index: number;
    [key: string]: any;
}

type PropsType = {
    obj: ObjectType
    setMovingElement: ActionCreatorWithPayload<number, 'dashboardSlice/editMovingElement'>
    setIndexElement: any
    children: ReactNode;
}


const DragAndDrop = (props: PropsType) => {
    const dispatch = useAppDispatch()

    const onDragStartHandler = (e: DragEvent<HTMLDivElement>, el: ObjectType) => {
        const target = e.target as HTMLElement;
        target.style.background = '#9f9d9d'
        dispatch(props.setMovingElement(el.id))
    }

    const onDragDropHandler = (e: DragEvent<HTMLDivElement>, el: ObjectType) => {
        e.preventDefault()
        dispatch(props.setIndexElement(el.index))
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