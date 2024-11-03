import classes from './Input.module.css'
import React from "react";

type InputPropsType = {
    type?: string,
    placeholder: string,
    value: string,
    error: string,
    styles?: string,
    containerStyles?: string,
    onchangeHandler?: (e: React.ChangeEvent<HTMLInputElement>) => void
    onBlurHandler?: () => void

}

const Input = (props: InputPropsType) => {
    const {type, placeholder, value, error, styles, containerStyles, onchangeHandler, onBlurHandler} = props
    return (
        <div className={containerStyles}>
            <span className={classes.msgError}>{error}</span>
            <input className={classes.text + ' ' + styles}
                   type={type}
                   placeholder={placeholder}
                   value={value}
                   onChange={onchangeHandler}
                   onBlur={onBlurHandler}
            />
        </div>
    )
}

export default Input