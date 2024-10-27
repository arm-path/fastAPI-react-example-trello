import classes from './authentication.module.css'
import Input from '../form/input/Input.tsx'
import Button from '../form/button/Button.tsx'

import {useAppDispatch, useAppSelector} from '../../redux/hooks.ts'
import {changeEmailFormAC, changePasswordFormAC} from '../../redux/reducers/authenticationReducer'


const Registration = (props) => {
    const form = useAppSelector(state => state.authentication.form)
    const dispatch = useAppDispatch()
    return (
        <div className={classes.container}>
            <div className={classes.formContainer}>
                <h2 className={classes.formTitle}>Регистрация</h2>

                <Input type='text'
                       placeholder='Email'
                       value={form.email}
                       onchangeHandler={(e) => dispatch(changeEmailFormAC(e.target.value))}
                />
                <Input type='password'
                       placeholder='Password'
                       value={form.password}
                       onchangeHandler={(e) => dispatch(changePasswordFormAC(e.target.value))}
                />
                <Button type='button' title='Регистрация'/>
            </div>
        </div>
    )
}

export default Registration