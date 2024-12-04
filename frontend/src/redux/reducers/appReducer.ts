import {createSlice, PayloadAction, Slice} from '@reduxjs/toolkit'
import {AxiosResponse} from 'axios'

import userAPI, {UserType} from '../../api/userAPI'
import {AppDispatch} from '../store.ts'
import {baseUrl} from '../../api/api.ts'
import {setUserDataAC} from './userReducer.ts'


type InitialStateType = {
    isAuth: boolean,
    initialization: boolean;
    baseUrl: string
}

const initialState: InitialStateType = {
    isAuth: false,
    initialization: false,
    baseUrl: baseUrl
}


const appSlice: Slice<InitialStateType> = createSlice({
    name: 'app',
    initialState,
    reducers: {
        initializationAC(state: InitialStateType, action: PayloadAction<boolean>) {
            state.initialization = action.payload;
        },
        changeIsAuthAC(state: InitialStateType, action: PayloadAction<boolean>) {
            state.isAuth = action.payload
        }
    },
})

export const initializeApp = () => async (dispatch: AppDispatch) => {

    const response: AxiosResponse<UserType> = await userAPI.detail()
    if (response.status === 200) {
        dispatch(changeIsAuthAC(true))
        dispatch(setUserDataAC(response.data))
    } else {
        dispatch(changeIsAuthAC(false))
    }
    dispatch(initializationAC(true))
}


export const appReducer = appSlice.reducer
export const {
    changeIsAuthAC,
    initializationAC
} = appSlice.actions
