import React from 'react'
import {Navigate} from 'react-router-dom'

import {useAppSelector} from '../../redux/hooks.ts'
import {selectApp} from '../../redux/selectors.ts'


const withAuthRedirect = <P extends { isAuth?: boolean }>(WrappedComponent: React.ComponentType<P>) => {
    const RedirectComponent: React.FC<Omit<P, 'isAuth'>> = (props) => {
        const {isAuth}= useAppSelector(selectApp)
        if (!isAuth) {
            return <Navigate to='/login' />
        }
        return <WrappedComponent {...props as P}/>
    }
    return RedirectComponent;
}

export default withAuthRedirect