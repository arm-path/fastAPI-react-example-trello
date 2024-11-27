import {combineReducers, configureStore} from '@reduxjs/toolkit'

import {authReducer} from './reducers/authReducer.ts'
import {appReducer} from './reducers/appReducer'
import projectReducer from './reducers/projectReducer.ts'
import dashboardReducer from './reducers/dashboardReducer.ts'
import taskReducer from './reducers/taskReducer.ts'


const rootReducer = combineReducers({
    app: appReducer,
    auth: authReducer,
    projects: projectReducer,
    dashboard: dashboardReducer,
    tasks: taskReducer,
})

export const store = configureStore(
    {
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: {
                    ignoredActions: [
                        'project/list/fulfilled',
                        'project/update/fulfilled',
                        'project/detail/fulfilled',
                        'dashboard/list/fulfilled',
                        'dashboard/update/fulfilled',
                        'task/detail/fulfilled',
                        'task/create/fulfilled',
                        'task/update/fulfilled',
                        'task/assignUsers/fulfilled',
                        'task/deleteUser/fulfilled',
                        'task/loadFile/fulfilled',
                        'task/deleteFile/fulfilled'
                    ],
                    ignoredPaths: ['payload.headers'],
                },
            }),
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