import {NavLink} from 'react-router-dom'
import classes from './header.module.css'


const Header = (props) => {
    return (
        <div className={classes.container}>
            <NavLink className={({ isActive, isPending }) =>
                isActive ? classes.linkAct : classes.link} to='/authentication'>Вход</NavLink>
        </div>
    )
}

export default Header