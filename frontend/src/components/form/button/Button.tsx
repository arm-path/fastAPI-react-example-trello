import classes from './Button.module.css'

const Button = ({type, title}) => {
    return (
        <>
            <button type={type} className={classes.button}> {title}</button>
        </>
    )
}

export default Button