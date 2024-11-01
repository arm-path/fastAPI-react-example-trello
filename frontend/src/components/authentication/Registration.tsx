import React, {useEffect} from 'react'
import {NavLink} from 'react-router-dom'

import classes from './authentication.module.css'
import Input from '../form/input/Input.tsx'
import Button from '../form/button/Button.tsx'

import {useAppDispatch, useAppSelector} from '../../redux/hooks.ts'
import {
    changeEmailFormAC,
    changePasswordFormAC,
    checkEmailFormAC,
    checkPasswordFormAC,
    clearFormAC,
    registrationThunk
} from '../../redux/reducers/authenticationReducer'



const Registration = () => {
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
                       onchangeHandler={(e: React.ChangeEvent<HTMLInputElement>) => dispatch(changeEmailFormAC(e.target.value))}
                       onBlurHandler={() => dispatch(checkEmailFormAC(form.email.value))}
                />


                <Input type='password'
                       placeholder={form.password.title}
                       value={form.password.value}
                       error={form.password.error}
                       onchangeHandler={(e: React.ChangeEvent<HTMLInputElement>) => dispatch(changePasswordFormAC(e.target.value))}
                       onBlurHandler={() => dispatch(checkPasswordFormAC(form.password.value))}
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