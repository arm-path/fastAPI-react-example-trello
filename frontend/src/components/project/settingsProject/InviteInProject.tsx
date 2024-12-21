import {ChangeEvent} from 'react'

import classes from './Settings.module.css'
import Input from '../../form/input/Input.tsx'
import Button from '../../form/button/Button.tsx'
import {useAppDispatch, useAppSelector} from '../../../redux/hooks.ts'
import {changeInviteUserForm, checkInviteUserEmail, inviteUserThunk} from '../../../redux/reducers/projectReducer.ts'
import {selectProjects} from '../../../redux/selectors.ts'

const InviteInProject = () => {

    const {inviteUserForm: form} = useAppSelector(selectProjects)
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