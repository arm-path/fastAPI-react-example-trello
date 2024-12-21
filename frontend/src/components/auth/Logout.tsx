import {useEffect} from 'react'

import withAuthRedirect from '../hoc/Authentication.tsx'
import {useAppDispatch, useAppSelector} from '../../redux/hooks.ts'
import {logoutThunk} from '../../redux/reducers/authReducer.ts'
import {selectApp} from '../../redux/selectors.ts'

const Logout = () => {
    const {isAuth} = useAppSelector(selectApp)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(logoutThunk())
    }, [isAuth]);

    return null
}

export default withAuthRedirect(Logout)