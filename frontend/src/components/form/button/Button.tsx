import classes from './Button.module.css'

const Button = ({type, title, style, disabled, onClickHandler}) => {
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