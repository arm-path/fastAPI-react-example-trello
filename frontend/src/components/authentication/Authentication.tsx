import React, {useEffect} from 'react'
import {NavLink} from 'react-router-dom'

import classes from './authentication.module.css'
import Input from '../form/input/Input.tsx'
import {
    authenticationThunk,
    changeEmailFormAC,
    changePasswordFormAC,
    checkEmailFormAC,
    clearFormAC
} from '../../redux/reducers/authenticationReducer.ts'
import Button from '../form/button/Button.tsx'
import {useAppDispatch, useAppSelector} from '../../redux/hooks.ts'


const Authentication = () => {
    const form = useAppSelector(state => state.authentication.form)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(clearFormAC())
    }, []);

    return (
        <div className={classes.container}>
            <div className={classes.formContainer}>
                <h2 className={classes.formTitle}>Авторизация</h2>
                <div className={classes.error}>{form.error}</div>
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
                    <NavLink className={classes.link} to='/registration'>Регистрация</NavLink>
                </div>
                <Button type='button'
                        title='Авторизация'
                        style='success'
                        onClickHandler={() => dispatch(authenticationThunk())}
                />

            </div>
        </div>
    )
}

export default Authentication