import classes from './Settings.module.css'
import Input from '../../form/input/Input.tsx'
import Button from '../../form/button/Button.tsx'
import {useAppDispatch, useAppSelector} from '../../../redux/hooks.ts'
import {ChangeEvent} from 'react';
import {changeInviteUserForm, checkInviteUserEmail, inviteUserThunk} from '../../../redux/reducers/projectReducer.ts'

const InviteInProject = () => {

    const form = useAppSelector(state => state.projects.inviteUserForm)

    const dispatch = useAppDispatch()

    return (
        <div>
            <span className={classes.error}>{form.error}</span>
            {form.invite && <span className={classes.success}>Пользователю отправлено приглашение!</span>}
            <div className={classes.inviteContainer}>
                <div>
                    <span className={classes.error}>{form.emailError ? form.emailError : `\u00a0`}</span>

                    <Input placeholder='Email'
                           value={form.email}
                           containerStyles={classes.inviteEmail}
                           onchangeHandler={(e: ChangeEvent<HTMLInputElement>) => {
                               dispatch(changeInviteUserForm(e.target.value))
                           }}
                           onBlurHandler={() => {
                               dispatch(checkInviteUserEmail())
                           }}
                    />
                </div>
                <div>
                    <Button type='button'
                            title='Пригласить'
                            style='success'
                            className={classes.inviteBtn}
                            onClickHandler={() => {
                                dispatch(inviteUserThunk())
                            }}/>
                </div>
            </div>
        </div>
    )
}


export default InviteInProject