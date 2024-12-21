import classes from './Profile.module.css'
import ProfileForm from './ProfileForm.tsx';
import ProfileDetail from './ProfileDetail.tsx';
import {useAppSelector} from '../../redux/hooks.ts'
import {selectUser} from '../../redux/selectors.ts'

const Profile = () => {
    const {isUpdateUser: loading} = useAppSelector(selectUser)

    let componentContainerStyle = classes.container
    if (loading) componentContainerStyle = `${componentContainerStyle} ${classes.loading}`
    return (
        <div className={componentContainerStyle}>
            <ProfileForm/>
            <ProfileDetail/>
        </div>
    )
}

export default Profile
