import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import DashboardAPI, {DashboardListType} from '../../api/dashboardAPI.ts';

import {AxiosResponse} from 'axios';
import {ThunkApiConfig} from '../store.ts';

type InitialState = {
    list: Array<DashboardListType>
}

const initialState: InitialState = {
    list: []
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
    reducers: {},
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