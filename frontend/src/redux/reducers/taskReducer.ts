import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {AxiosResponse} from 'axios';
import {TaskType} from '../../api/dashboardAPI.ts'
import {ThunkApiConfig} from '../store.ts'
import TaskAPI from '../../api/taskAPI.ts';
import {getDashboards} from './dashboardReducer.ts';

type InitialState = {
    createLoading: boolean,
}

const initialState: InitialState = {
    createLoading: false,
}


type createTaskProps = {
    title: string,
    description: string,
    deadline: string,
    dashboard_id: number
}

export const createTaskThunk = createAsyncThunk<AxiosResponse<TaskType> | undefined, createTaskProps, ThunkApiConfig>
(
    'task/create',
    async (props: createTaskProps, thunkAPI) => {
        if (props.title.length === 0) return undefined
        const response = await TaskAPI.create(props.title, props.description, props.deadline, props.dashboard_id)
        if (response.status === 200) {
            const projectID = thunkAPI.getState().projects.detail?.id
            if (!projectID) return undefined
            thunkAPI.dispatch(getDashboards(projectID))
        }
        return response
    }
)


const taskSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(createTaskThunk.pending, (state) => {
                state.createLoading = true
            })
            .addCase(createTaskThunk.fulfilled, (state, action) => {
                if (action.payload) {
                    if (action.payload.status === 200) {

                    }
                }
                state.createLoading = false
            })
    }
})


export default taskSlice.reducer

export const {} = taskSlice.actions