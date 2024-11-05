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
        loading: false
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
            } else {
                state.editDashboard.id = null
            }
        },
        changeEditDashboardAC(state, action: PayloadAction<string>) {

            state.editDashboard.title = action.payload
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
    }
})

export default dashboardSlice.reducer

export const {
    setEditDashboardAC,
    changeEditDashboardAC
} = dashboardSlice.actions