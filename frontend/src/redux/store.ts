import {combineReducers, configureStore} from '@reduxjs/toolkit'

import {authReducer} from './reducers/authReducer.ts'
import {appReducer} from './reducers/appReducer'
import projectReducer from './reducers/projectReducer.ts'
import dashboardReducer from './reducers/dashboardReducer.ts'


const rootReducer = combineReducers({
    app: appReducer,
    auth: authReducer,
    projects: projectReducer,
    dashboard: dashboardReducer
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