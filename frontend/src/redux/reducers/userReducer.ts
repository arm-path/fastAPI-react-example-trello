import {createAsyncThunk, createSlice, PayloadAction, Slice} from '@reduxjs/toolkit'

import UserAPI from '../../api/userAPI.ts'
import userAPI, {UserDetailResponseType, UserType} from '../../api/userAPI.ts'
import {ThunkApiConfig} from '../store.ts'


type InitialStateType = {
    user: UserType
    isGetUser: boolean
    isUpdateUser: boolean
}

const initialState: InitialStateType = {
    user: {
        id: 0,
        email: 'Не определено',
        first_name: null,
        last_name: null,
        is_active: false,
        is_verified: false
    },
    isGetUser: false,
    isUpdateUser: false

}

export const userDetailThunk = createAsyncThunk<UserDetailResponseType, void>
(
    'user/detail',
    async () => {
        return await userAPI.detail()
    }
)

export const userUpdateThunk = createAsyncThunk<
    UserType | undefined, { firstName: string; lastName: string }, ThunkApiConfig>
(
    'user/update',
    async ({firstName, lastName}) => {
        const response = await UserAPI.update(firstName, lastName)
        if (response.status === 200) {
            return response.data
        } else return undefined
    }
)

const userSlice: Slice<InitialStateType> = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserDataAC(state, action: PayloadAction<UserType>) {
            state.user = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(userUpdateThunk.pending, (state) => {
                state.isUpdateUser = true
            })
            .addCase(userUpdateThunk.fulfilled, (state, action) => {
                if (action.payload) state.user = action.payload
                state.isUpdateUser = false
            })
            .addCase(userDetailThunk.pending, (state) => {
                state.isGetUser = true
            })
            .addCase(userDetailThunk.fulfilled, (state, action) => {
                if (action.payload) {
                    if (action.payload.status === 200) {
                        state.user = action.payload.data as UserType
                    }
                }
                state.isGetUser = false
            })
    }
})


export const {setUserDataAC, changeFormFirstNameAC, changeFormLastNameAC} = userSlice.actions

export default userSlice.reducer