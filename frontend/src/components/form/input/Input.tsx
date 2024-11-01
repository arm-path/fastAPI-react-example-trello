import classes from './Input.module.css'
import React from "react";

type InputPropsType = {
    type?: string,
    placeholder: string,
    value: string,
    error: string,
    onchangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void
    onBlurHandler?: () => void

}

const Input = ({type, placeholder, value, error, onchangeHandler, onBlurHandler}: InputPropsType) => {
    return (
        <div>
            <span className={classes.msgError}>{error}</span>
            <input className={classes.text}
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