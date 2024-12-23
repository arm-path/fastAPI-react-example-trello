import React, {ReactNode} from 'react'

import classes from './Modal.module.css'
import Button from '../form/button/Button.tsx'


type PropsType = {
    children: ReactNode
    closeHandler: () => void
    contentClickHandler?: (event: React.MouseEvent<HTMLDivElement>) => void
    error?: string
    loading?: boolean
    size?: 'sm' | 'md' | 'lg' | 'xl'
    contentStyle?: string
}

const Modal = (props: PropsType) => {

    let contentClass = classes.content
    if (props.loading) contentClass = contentClass + ' ' + classes.loading
    if (props.size === 'sm') {
        contentClass = contentClass + ' ' + classes.sm
    }
    if (props.contentStyle) contentClass = contentClass + ' ' + props.contentStyle

    return (
        <div className={classes.container}>
            <div className={contentClass} onClick={props.contentClickHandler}>
                <div className={classes.header}>
                    <span className={classes.errorMessage}>{props.error}</span>
                    <div className={classes.modalClose}>
                        <Button type='button'
                                title='X'
                                style='danger'
                                onClickHandler={props.closeHandler}/>
                    </div>
                </div>
                {props.children}
            </div>
        </div>
    )
}


export default Modal