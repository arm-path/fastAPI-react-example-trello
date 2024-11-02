import React from 'react'
import {useAppSelector} from '../../redux/hooks.ts'
import {RootState} from '../../redux/store.ts'
import {Navigate} from 'react-router-dom'


const withAuthRedirect = <P extends { isAuth?: boolean }>(WrappedComponent: React.ComponentType<P>) => {
    const RedirectComponent: React.FC<Omit<P, 'isAuth'>> = (props) => {
        const isAuth: boolean = useAppSelector((state: RootState) => state.app.isAuth)
        if (!isAuth) {
            return <Navigate to='/login' />
        }
        return <WrappedComponent {...props as P}/>
    }
    return RedirectComponent;
}

export default withAuthRedirect