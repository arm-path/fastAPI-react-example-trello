import classes from './Profile.module.css'
import {useAppSelector} from '../../redux/hooks.ts'

const ProfileDetail = () => {
    const user = useAppSelector(state => state.user.user)
    return (
        <div className={classes.detail}>
            <h3 className={classes.title}>Профиль пользователя</h3>
            <div><b>Email: </b>{user.email}</div>
            <div><b>Имя: </b>{user.first_name && user.first_name}</div>
            <div><b>Имя: </b>{user.last_name && user.last_name}</div>
        </div>
    )
}

export default ProfileDetail