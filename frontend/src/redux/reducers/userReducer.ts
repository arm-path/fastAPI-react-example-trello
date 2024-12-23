import {createAsyncThunk, createSlice, PayloadAction, Slice} from '@reduxjs/toolkit'
import {AxiosResponse} from 'axios'

import UserAPI from '../../api/userAPI.ts'
import userAPI, {InvitationProjectsType, UserDetailResponseType, UserType} from '../../api/userAPI.ts'
import {ThunkApiConfig} from '../store.ts'


type InitialStateType = {
    user: UserType
    isGetUser: boolean
    isUpdateUser: boolean
    invitationProjects: {
        isGetPending: boolean,
        list: Array<InvitationProjectsType>
    },
    invitationProjectAction: {
        id: number,
        isGetPending: boolean,
    }
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
    isUpdateUser: false,
    invitationProjects: {
        isGetPending: false,
        list: [],
    },
    invitationProjectAction: {
        id: 0,
        isGetPending: false,
    }

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

export const getInvitationProjectsThunk = createAsyncThunk<
    AxiosResponse<Array<InvitationProjectsType>>, void>
(
    'user/getInvitationProjects',
    async () => {
        return await UserAPI.invitationProjects()
    }
)

export const invitationProjectAcceptThunk = createAsyncThunk<
    AxiosResponse<Array<InvitationProjectsType>>, number>
(
    'user/invitationProjectAccept',
    async (projectId: number) => {
        return await UserAPI.invitationProjectsAccept(projectId)
    }
)

export const invitationProjectDeleteThunk = createAsyncThunk<
    AxiosResponse, number>
(
    'user/invitationProjectDelete',
    async (projectId: number) => {
        return await UserAPI.invitationProjectsDelete(projectId)
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
            .addCase(getInvitationProjectsThunk.pending, (state) => {
                state.invitationProjects.isGetPending = true
            })
            .addCase(getInvitationProjectsThunk.fulfilled, (state, action) => {
                if (action.payload) {
                    if (action.payload.status === 200) {
                        state.invitationProjects.list = action.payload.data
                    }
                }
                state.invitationProjects.isGetPending = false
            })
            .addCase(invitationProjectAcceptThunk.pending, (state, action) => {
                state.invitationProjectAction.id = action.meta.arg
                state.invitationProjectAction.isGetPending = true
            })
            .addCase(invitationProjectAcceptThunk.fulfilled, (state: InitialStateType, action) => {
                if (action.payload) {
                    if (action.payload.status === 200) {
                        state.invitationProjects.list = state.invitationProjects.list.filter(
                            (el: InvitationProjectsType): boolean => {
                                return el.id !== action.meta.arg
                            })
                    }
                }
                state.invitationProjectAction.id = 0
                state.invitationProjectAction.isGetPending = false
            })
            .addCase(invitationProjectDeleteThunk.pending, (state, action) => {
                state.invitationProjectAction.id = action.meta.arg
                state.invitationProjectAction.isGetPending = true
            })
            .addCase(invitationProjectDeleteThunk.fulfilled, (state, action) => {
                if (action.payload) {
                    if (action.payload.status === 200) {
                        state.invitationProjects.list = state.invitationProjects.list.filter(
                            (el: InvitationProjectsType): boolean => {
                                return el.id !== action.meta.arg
                            })
                    }
                }
                state.invitationProjectAction.id = 0
                state.invitationProjectAction.isGetPending = false
            })
    }
})


export const {setUserDataAC, changeFormFirstNameAC, changeFormLastNameAC} = userSlice.actions

export default userSlice.reducer