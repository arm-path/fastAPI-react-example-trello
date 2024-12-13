import React, {useEffect} from 'react'
import {NavLink, useLocation} from 'react-router-dom'

import classes from './auth.module.css'
import Input from '../form/input/Input.tsx'
import {
    authThunk,
    changeEmailFormAC,
    changePasswordFormAC,
    checkEmailFormAC,
    clearFormAC
} from '../../redux/reducers/authReducer.ts'
import Button from '../form/button/Button.tsx'
import {useAppDispatch, useAppSelector} from '../../redux/hooks.ts'
import {activateUserError} from '../../utils/changeBackendError.ts';


const Login = () => {
    const form = useAppSelector(state => state.auth.form)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(clearFormAC())
    }, []);

    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const verifyParam = queryParams.get('verify')
    const verifyDetailParam = queryParams.get('detail')
    const verifyError = activateUserError(verifyDetailParam)

    return (
        <div className={classes.container}>
            <div className={classes.formContainer}>
                <h2 className={classes.formTitle}>Авторизация</h2>
                <div className={classes.error}>
                    {form.error
                        ? form.error
                        : verifyParam && verifyParam === 'error'
                            ? verifyError
                            : ''}
                </div>
                <div className={classes.success}>
                    {form.success
                        ? form.success
                        : verifyParam && verifyParam === 'success'
                            ? 'Учетная запись подтверждена!'
                            : ''
                    }
                </div>
                <Input type='text'
                       placeholder={form.email.title}
                       value={form.email.value}
                       error={form.email.error}
                       onchangeHandler={(e: React.ChangeEvent<HTMLInputElement>) => dispatch(changeEmailFormAC(e.target.value))}
                       onBlurHandler={() => dispatch(checkEmailFormAC(form.email.value))}
                />
                <Input type='password'
                       placeholder={form.password.title}
                       value={form.password.value}
                       error={form.password.error}
                       onchangeHandler={(e: React.ChangeEvent<HTMLInputElement>) => dispatch(changePasswordFormAC(e.target.value))}
                />
                <div className={classes.formTitle}>
                    <div><NavLink className={classes.link} to='/register'>Регистрация</NavLink></div>
                    <div><NavLink className={classes.link} to='/forgot-password'>Забыли пароль?</NavLink></div>
                </div>
                <Button type='button'
                        title='Авторизация'
                        style='success'
                        onClickHandler={() => dispatch(authThunk())}
                />

            </div>
        </div>
    )
}

export default Login