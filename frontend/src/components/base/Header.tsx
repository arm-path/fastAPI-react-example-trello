import {NavLink} from 'react-router-dom'

import classes from './header.module.css'
import {useAppSelector} from '../../redux/hooks.ts'
import {selectApp} from '../../redux/selectors.ts'


const Header = () => {

    const {isAuth} = useAppSelector(selectApp)

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