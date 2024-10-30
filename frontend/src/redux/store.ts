import {configureStore, createAsyncThunk} from '@reduxjs/toolkit'

import {authenticationReducer} from './reducers/authenticationReducer'


export const store = configureStore({reducer: {authentication: authenticationReducer}})


export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = typeof store.dispatch

export type ThunkApiConfig = {
    state: RootState
    dispatch: AppDispatch
}

// @ts-ignore
window.store = store