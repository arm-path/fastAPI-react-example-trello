import {ChangeEvent, useState} from 'react'

import classes from './auth.module.css'
import Input from '../form/input/Input.tsx'
import Button from '../form/button/Button.tsx'
import {forgotPasswordThunk} from '../../redux/reducers/authReducer.ts'
import {useAppDispatch, useAppSelector} from '../../redux/hooks.ts'
import {selectAuth} from '../../redux/selectors.ts'


const ForgotPassword = () => {

    const [email, setEmail] = useState('')

    const {forgotPasswordForm: form} = useAppSelector(selectAuth)
    const dispatch = useAppDispatch()

    let styleContainerForm = classes.formContainer
    if (form.isLoading) styleContainerForm = styleContainerForm + ' ' + classes.loading

    return (
        <div className={classes.container}>
            <div className={styleContainerForm}>
                <h3 className={classes.formTitle}>Восстановление пароля</h3>
                <div className={form.success ? classes.success : classes.error}>
                    {form.text}
                </div>
                <Input placeholder='Email'
                       value={email}
                       onchangeHandler={(e: ChangeEvent<HTMLInputElement>) => {
                           setEmail(e.target.value)
                       }}/>
                <Button type='button'
                        title='Восстановить'
                        style='success'
                        onClickHandler={() => {
                            dispatch(forgotPasswordThunk(email))
                        }}/>
            </div>

        </div>
    )
}

export default ForgotPassword