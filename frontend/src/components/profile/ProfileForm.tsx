import {ChangeEvent, useState} from 'react'
import classes from './Profile.module.css'
import Input from '../form/input/Input.tsx'
import Button from '../form/button/Button.tsx';
import {useAppDispatch} from '../../redux/hooks.ts';
import {userUpdateThunk} from '../../redux/reducers/userReducer.ts';


const ProfileForm = () => {

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')

    const dispatch = useAppDispatch()

    return (
        <div className={classes.form}>
            <h3 className={classes.title}>Изменить данные профиля</h3>
            <Input placeholder='Имя'
                   value={firstName}
                   onchangeHandler={(e: ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}/>
            <Input placeholder='Фамилие'
                   value={lastName}
                   onchangeHandler={(e: ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
            />
            <Button type='button' title='Изменить' style='success' onClickHandler={() => {
                dispatch(userUpdateThunk({firstName, lastName}))
                setFirstName('')
                setLastName('')
            }}/>
        </div>
    )
}

export default ProfileForm