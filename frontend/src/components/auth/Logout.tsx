import {useEffect} from 'react'
import {useAppDispatch, useAppSelector} from '../../redux/hooks.ts'
import {logoutThunk} from '../../redux/reducers/authReducer.ts'
import withAuthRedirect from '../hoc/Authentication.tsx'

const Logout = () => {
    const isAuth = useAppSelector(state => state.app.isAuth)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(logoutThunk())
    }, [isAuth]);

    return null
}

export default withAuthRedirect(Logout)