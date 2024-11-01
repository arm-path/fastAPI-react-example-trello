import {createSlice, PayloadAction} from '@reduxjs/toolkit'

import userAPI from '../../api/userAPI'


type InitialStateType = {
    initialization: boolean;
}

const initialState: InitialStateType = {
    initialization: false,
}


const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        initializationAC(state, action: PayloadAction<boolean>) {
            state.initialization = action.payload;
        }
    },
})

export const initializeApp = () => async (dispatch: any) => {

    const response = await userAPI.detail()
    if (response.status === 200) {
        dispatch(initializationAC(true))
    } else {
        dispatch(initializationAC(false))
    }
}


export const appReducer = appSlice.reducer
export const {
    initializationAC
} = appSlice.actions
