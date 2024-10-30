import classes from './Input.module.css'

const Input = ({type, placeholder, value, error, onchangeHandler, onBlurHandler}) => {
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