import classes from './Button.module.css'

type ButtonPropsType = {
    type: 'button' | 'submit' | 'reset' | undefined
    title: string
    style: 'success' | 'danger' | 'warning' | 'info'
    className?: string
    disabled?: boolean
    onClickHandler: () => void
}

const Button = ({type, title, style, className, disabled, onClickHandler}: ButtonPropsType) => {
    let btnStyle: string = classes.button + ' '
    if (!disabled) {
        switch (style) {
            case 'success':
                btnStyle = btnStyle + classes.buttonSuccess
                break
            case 'danger':
                btnStyle = btnStyle + classes.buttonDanger
                break
            default:
                btnStyle = btnStyle + classes.buttonSuccess
        }
    }
    if (className) {
        btnStyle += `${btnStyle} ${className}`
    }
    return (
        <>
            <button type={type} className={btnStyle} onClick={onClickHandler}>
                {title}
            </button>
        </>
    )
}

export default Button