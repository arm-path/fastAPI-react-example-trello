import classes from './Input.module.css'
import React from "react";

type InputPropsType = {
    type?: string,
    placeholder: string,
    value: string | FormData | File | null,
    error?: string,
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
            {type === 'file' ? (
                <input
                    className={classes.text + ' ' + styles}
                    type={type}
                    placeholder={placeholder}
                    onChange={onchangeHandler}
                    onBlur={onBlurHandler}
                />
            ) : (
                <input
                    className={classes.text + ' ' + styles}
                    type={type}
                    placeholder={placeholder}
                    value={value as string}
                    onChange={onchangeHandler}
                    onBlur={onBlurHandler}
                />
            )}
        </div>
    )
}

export default Input