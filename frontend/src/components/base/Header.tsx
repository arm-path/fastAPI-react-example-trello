import {NavLink} from 'react-router-dom'
import classes from './header.module.css'
import {useAppSelector} from '../../redux/hooks.ts';


const Header = () => {

    const isAuth = useAppSelector(state => state.app.isAuth)

    return (
        <div className={classes.container}>
            <div className={classes.containerLink}>
                <NavLink className={({isActive}) =>
                    isActive ? classes.linkAct : classes.link} to='/projects'>Проекты
                </NavLink>
            </div>
            <div className={classes.containerLink}>
                <NavLink className={({isActive}) =>
                    isActive ? classes.linkAct : classes.link} to='/profile'>Профиль
                </NavLink>
            </div>
            {!isAuth
                ? <div className={classes.containerLink}>
                    <NavLink
                        className={({isActive}) => {
                            return isActive ? classes.linkAct : classes.link
                        }}
                        to='/login'>
                        Вход
                    </NavLink>
                </div>
                : <div className={classes.containerLink}>
                    <NavLink
                        className={({isActive}) => {
                            return isActive ? classes.linkAct : classes.link
                        }}
                        to='/logout'>
                        Выход
                    </NavLink>
                </div>
            }


        </div>
    )
}

export default Header