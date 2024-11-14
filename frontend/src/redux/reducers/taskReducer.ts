import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {AxiosResponse} from 'axios';
import {TaskType} from '../../api/dashboardAPI.ts'
import {ThunkApiConfig} from '../store.ts'
import TaskAPI, {TaskDetailType} from '../../api/taskAPI.ts';
import {getDashboards} from './dashboardReducer.ts';

type InitialState = {
    createLoading: boolean,
    moving: {
        id: number | null,
        loading: boolean
    },
    isGetDetail: boolean,
    detail: TaskDetailType | null
}

const initialState: InitialState = {
    createLoading: false,
    moving: {
        id: null,
        loading: false
    },
    isGetDetail: false,
    detail: null
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

export const movingTaskThunk = createAsyncThunk<AxiosResponse<TaskType> | undefined, TaskType, ThunkApiConfig>
(
    'task/moving',
    async (obj: TaskType, thunkAPI) => {
        const moving_id = thunkAPI.getState().tasks.moving.id
        if (!moving_id) return undefined
        const response = await TaskAPI.moving(moving_id, obj.dashboard_id, obj.index)
        if (response.status === 200) {
            const projectID = thunkAPI.getState().projects.detail?.id
            if (!projectID) return undefined
            thunkAPI.dispatch(getDashboards(projectID))
            return response
        }
        return response
    }
)

export const detailTaskThunk = createAsyncThunk<AxiosResponse<TaskDetailType> | undefined, number>
(
    'task/detail',
    async (task_id: number) => {
        return await TaskAPI.detail(task_id)
    }
)


const taskSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {
        editMovingTask(state, action: PayloadAction<number>) {
            state.moving.id = action.payload
        },
        closeDetailModal(state) {
            state.detail = null
        }
    },
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
            .addCase(movingTaskThunk.pending, (state) => {
                state.moving.loading = true
            })
            .addCase(movingTaskThunk.fulfilled, (state, action) => {
                if (action.payload) {
                    if (action.payload.status === 200) {
                        state.moving.id = null
                    }
                }
                state.moving.id = null
                state.moving.loading = false
            })
            .addCase(detailTaskThunk.pending, (state) => {
                state.isGetDetail = true
            })
            .addCase(detailTaskThunk.fulfilled, (state, action) => {
                if (action.payload) {
                    if (action.payload.status === 200) {
                        state.detail = action.payload.data
                        console.log(action.payload.data)
                    }
                }
                state.isGetDetail = false
            })
    }
})


export default taskSlice.reducer

export const {
    editMovingTask,
    closeDetailModal
} = taskSlice.actions