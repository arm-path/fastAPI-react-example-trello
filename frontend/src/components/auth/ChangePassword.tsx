import {ChangeEvent, useState} from 'react'
import {useParams} from 'react-router-dom'

import classes from './auth.module.css'
import Input from '../form/input/Input.tsx'
import Button from '../form/button/Button.tsx'
import {useAppDispatch, useAppSelector} from '../../redux/hooks.ts'
import {resetPasswordThunk} from '../../redux/reducers/authReducer.ts';


const ChangePassword = () => {
    const params = useParams()
    const [password, setPassword] = useState('')
    const [passwordRepeat, setPasswordRepeat] = useState('')

    const [error, setError] = useState('')

    const setPasswordHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (error) setError('')
        setPassword(e.target.value)
    }
    const setPasswordRepeatHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (error) setError('')
        setPasswordRepeat(e.target.value)
    }

    const checkPasswordHandler = () => {
        if (password && passwordRepeat && password !== passwordRepeat) {
            setError('Пароли не совпадают!')
        }
    }

    const form = useAppSelector(state => state.auth.resetPasswordForm)

    const dispatch = useAppDispatch()

    return (
        <div className={classes.container}>
            <div className={classes.formContainer}>
                <h3 className={classes.formTitle}>Изменение пароля</h3>
                <div className={classes.error}>{error}</div>
                <div className={form.success ? classes.success : classes.error}>
                    {form.text}
                </div>
                <Input placeholder='Password'
                       value={password}
                       onchangeHandler={(e: ChangeEvent<HTMLInputElement>) => setPasswordHandler(e)}
                       onBlurHandler={checkPasswordHandler}/>
                <Input placeholder='Repeat password'
                       value={passwordRepeat}
                       onchangeHandler={(e: ChangeEvent<HTMLInputElement>) => setPasswordRepeatHandler(e)}
                       onBlurHandler={checkPasswordHandler}/>
                <Button type='button'
                        title='Изменить'
                        style='success'
                        onClickHandler={() => {
                            if (params.token) dispatch(resetPasswordThunk({token: params.token, password: password}))
                            else setError('Не валидная ссылка.')
                        }}/>
            </div>

        </div>
    )
}

export default ChangePassword