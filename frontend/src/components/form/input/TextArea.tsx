import {ChangeEvent} from 'react'
import classes from './Input.module.css'


type InputPropsType = {
    placeholder: string,
    value: string,
    error?: string,
    styles?: string,
    containerStyles?: string,
    onchangeHandler?: (e: ChangeEvent<HTMLTextAreaElement>) => void
}

const Textarea = (props: InputPropsType) => {
    const {placeholder, value, error, styles, containerStyles, onchangeHandler} = props
    return (
        <div className={containerStyles}>
            <span className={classes.msgError}>{error}</span>
            <textarea className={classes.text + ' ' + styles}
                      value={value}
                      onChange={onchangeHandler}
                      placeholder={placeholder}
            />
        </div>
    )
}

export default Textarea