import classes from './Button.module.css'


const ButtonLoading = () => {


    return (
        <>
            <button type='button' className={classes.buttonLoader} disabled>
                Загружаем ...
            </button>
        </>
    )
}

export default ButtonLoading