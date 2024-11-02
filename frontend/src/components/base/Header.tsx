import {NavLink} from 'react-router-dom'
import classes from './header.module.css'


const Header = () => {
    return (
        <div className={classes.container}>
            <div className={classes.containerLink}>
                <NavLink className={({ isActive}) =>
                    isActive ? classes.linkAct : classes.link} to='/projects'>Проекты
                </NavLink>
            </div>
            <div>
                <NavLink className={({ isActive}) =>
                    isActive ? classes.linkAct : classes.link} to='/login'>Вход
                </NavLink>
            </div>

        </div>
    )
}

export default Header