import {useEffect} from 'react'

import classes from './authentication.module.css'
import Input from '../form/input/Input.tsx'
import Button from '../form/button/Button.tsx'

import {useAppDispatch, useAppSelector} from '../../redux/hooks.ts'
import {
    changeEmailFormAC,
    changePasswordFormAC,
    checkEmailFormAC, checkPasswordFormAC, clearFormAC,
    registrationThunk
} from '../../redux/reducers/authenticationReducer'
import {NavLink} from "react-router-dom";


const Registration = (props) => {
    const form = useAppSelector(state => state.authentication.form)
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(clearFormAC())
    }, []);
    return (
        <div className={classes.container}>
            <div className={classes.formContainer}>
                <h2 className={classes.formTitle}>Регистрация</h2>
                <div className={classes.error}>{form.error}</div>
                <Input type='text'
                       placeholder={form.email.title}
                       value={form.email.value}
                       error={form.email.error}
                       onchangeHandler={(e) => dispatch(changeEmailFormAC(e.target.value))}
                       onBlurHandler={(e) => dispatch(checkEmailFormAC(form.email.value))}
                />
                <Input type='password'
                       placeholder={form.password.title}
                       value={form.password.value}
                       error={form.password.error}
                       onchangeHandler={(e) => dispatch(changePasswordFormAC(e.target.value))}
                       onBlurHandler={(e) => dispatch(checkPasswordFormAC(form.password.value))}
                />
                <div className={classes.formTitle}>
                    <NavLink className={classes.link} to='/authentication'>Вход</NavLink>
                </div>
                <Button type='button'
                        title='Регистрация'
                        style='success'
                        onClickHandler={() => dispatch(registrationThunk())}
                />
            </div>
        </div>
    )
}

export default Registration