import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import DashboardAPI, {DashboardListType} from '../../api/dashboardAPI.ts';

import {AxiosResponse} from 'axios';
import {ThunkApiConfig} from '../store.ts';

type InitialState = {
    list: Array<DashboardListType>
    error: string
    editDashboard: {
        id: number | null,
        title: string,
        oldTitle: string,
        loading: boolean
    },
    formDashboard: {
        title: string,
        loading: boolean,
    }
}

const initialState: InitialState = {
    list: [],
    error: '',
    editDashboard: {
        id: null,
        title: '',
        oldTitle: '',
        loading: false
    },
    formDashboard: {
        title: '',
        loading: false,
    }
}

export const getDashboards = createAsyncThunk<AxiosResponse<Array<DashboardListType>> | undefined, number, ThunkApiConfig>
(
    'dashboard/list',
    async (projectID: number) => {
        return await DashboardAPI.list(projectID)
    }
)

export const updateDashboard = createAsyncThunk<AxiosResponse<DashboardListType> | undefined, void, ThunkApiConfig>
(
    'dashboard/update',
    async (_, thunkAPI) => {
        const projectID = thunkAPI.getState().projects.detail?.id
        if (!projectID) return undefined
        const editDashboard = thunkAPI.getState().dashboard.editDashboard
        if (!editDashboard.id) return undefined
        if (!editDashboard.title) return undefined
        if (editDashboard.title === editDashboard.oldTitle) return undefined
        return await DashboardAPI.update(projectID, editDashboard.id, editDashboard.title)
    }
)

export const createDashboard = createAsyncThunk<AxiosResponse<Array<DashboardListType>> | undefined, void, ThunkApiConfig>
(
    'dashboard/create',
    async (_, thunkAPI) => {
        const projectID = thunkAPI.getState().projects.detail?.id
        if (!projectID) return undefined
        const title = thunkAPI.getState().dashboard.formDashboard.title
        if (title.trim().length === 0) return undefined
        return await DashboardAPI.create(projectID, title)

    }
)


const dashboardSlice = createSlice({
    name: 'dashboardSlice',
    initialState,
    reducers: {
        setEditDashboardAC(state, action: PayloadAction<number | null>) {
            state.editDashboard.id = action.payload
            const dashboard = state.list.find(el => el.id === action.payload)
            if (dashboard) {
                state.editDashboard.title = dashboard.title
                state.editDashboard.oldTitle = dashboard.title
                state.error = ''
            } else {
                state.editDashboard.id = null
                state.error = ''
            }
        },
        changeEditDashboardAC(state, action: PayloadAction<string>) {

            state.editDashboard.title = action.payload
            state.error = ''
        },
        changeTitleCreateDashboard(state, action: PayloadAction<string>) {
            state.formDashboard.title = action.payload
            state.error = ''
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getDashboards.fulfilled, (state, action) => {
                if (action.payload) {
                    if (action.payload.status === 200) {
                        state.list = action.payload.data
                    }
                }
            })
            .addCase(updateDashboard.pending, (state) => {
                state.editDashboard.loading = true
            })
            .addCase(updateDashboard.fulfilled, (state, action) => {
                if (action.payload) {
                    if (action.payload.status === 200 && 'id' in action.payload.data) {
                        // @ts-ignore
                        const dashboard = state.list.find(el => el.id === action.payload.data.id)
                        if (dashboard) {
                            dashboard.title = action.payload.data.title
                        } else {
                            state.error = 'Не удалось изменить название'
                        }
                    } else {
                        state.error = 'Не удалось изменить название'
                    }
                } else {
                    state.error = 'Не удалось изменить название'
                }
                state.editDashboard.loading = false
            })
            .addCase(createDashboard.pending, (state) => {
                state.formDashboard.loading = true
            })
            .addCase(createDashboard.fulfilled, (state, action) => {
                if (action.payload) {
                    if (action.payload.status === 200) {
                        state.list = action.payload.data
                        state.formDashboard.title = ''
                        state.error = ''
                    } else {
                        state.error = 'Не удалось создать панель'
                    }
                } else {
                    state.error = 'Не удалось создать панель'
                }
                state.formDashboard.loading = false
            })
    }
})

export default dashboardSlice.reducer

export const {
    setEditDashboardAC,
    changeEditDashboardAC,
    changeTitleCreateDashboard
} = dashboardSlice.actions