import {combineReducers, configureStore} from '@reduxjs/toolkit'

import {authenticationReducer} from './reducers/authenticationReducer'
import {appReducer} from './reducers/appReducer'


const rootReducer = combineReducers({
    app: appReducer,
    authentication: authenticationReducer,
})

export const store = configureStore(
    {
        reducer: rootReducer
    }
)


export type AppStore = typeof store
export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch


export type ThunkApiConfig = {
    state: RootState
    dispatch: AppDispatch
}

// @ts-ignore
window.store = store