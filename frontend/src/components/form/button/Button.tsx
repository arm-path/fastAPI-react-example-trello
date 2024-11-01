import classes from './Button.module.css'

type ButtonPropsType = {
    type: 'button' | 'submit' | 'reset' | undefined
    title: string
    style: 'success' | 'danger' | 'warning' | 'info'
    disabled?: boolean
    onClickHandler: () => void
}

const Button = ({type, title, style, disabled, onClickHandler}: ButtonPropsType) => {
    let btnStyle: string = classes.button + ' '
    if (!disabled) {
        switch (style) {
            case 'success':
                btnStyle = btnStyle + classes.buttonSuccess
                break
            default:
                btnStyle = btnStyle + classes.buttonSuccess
        }
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