import classes from './Input.module.css'

const Input = ({type, placeholder, value, onchangeHandler}) => {
    return (
        <div>
            <input className={classes.text}
                   type={type}
                   placeholder={placeholder}
                   value={value}
                   onChange={onchangeHandler}
            />
        </div>
    )
}

export default Input