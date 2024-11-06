import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import DashboardAPI, {DashboardListType} from '../../api/dashboardAPI.ts';

import {AxiosResponse} from 'axios';
import {ThunkApiConfig} from '../store.ts';

type InitialState = {
    list: Array<DashboardListType>
    editDashboard: {
        id: number | null,
        title: string,
        oldTitle: string,
        error: string,
        loading: boolean
    }
}

const initialState: InitialState = {
    list: [],
    editDashboard: {
        id: null,
        title: '',
        oldTitle: '',
        error: '',
        loading: false
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
                state.editDashboard.error = ''
            } else {
                state.editDashboard.id = null
                state.editDashboard.error = ''
            }
        },
        changeEditDashboardAC(state, action: PayloadAction<string>) {

            state.editDashboard.title = action.payload
            state.editDashboard.error = ''
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
                            state.editDashboard.error = 'Не удалось изменить название'
                        }
                    } else {
                        state.editDashboard.error = 'Не удалось изменить название'
                    }
                } else {
                    state.editDashboard.error = 'Не удалось изменить название'
                }
                state.editDashboard.loading = false
            })
    }
})

export default dashboardSlice.reducer

export const {
    setEditDashboardAC,
    changeEditDashboardAC
} = dashboardSlice.actions