import {useEffect} from 'react'

import classes from './Profile.module.css'
import ProfileForm from './ProfileForm.tsx'
import ProfileDetail from './ProfileDetail.tsx'
import Invitations from './Invitations.tsx'
import {useAppDispatch, useAppSelector} from '../../redux/hooks.ts'
import {selectUser} from '../../redux/selectors.ts'
import withAuthRedirect from '../hoc/Authentication.tsx'
import {userDetailThunk} from '../../redux/reducers/userReducer.ts'


const Profile = () => {

    const {isUpdateUser: loading} = useAppSelector(selectUser)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(userDetailThunk())
    }, [dispatch])

    let componentContainerStyle = classes.container
    if (loading) componentContainerStyle = `${componentContainerStyle} ${classes.loading}`
    return (
        <div className={componentContainerStyle}>
            <ProfileForm/>
            <ProfileDetail/>
            <div></div>
            <Invitations/>
        </div>
    )
}

const ProfileWrapped = withAuthRedirect(Profile)

export default ProfileWrapped
