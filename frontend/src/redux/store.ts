import {configureStore} from '@reduxjs/toolkit'

import {authenticationReducer} from './reducers/authenticationReducer'


export const store = configureStore({reducer: {authentication: authenticationReducer}})


export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

// @ts-ignore
window.store = store