import {AxiosResponse} from 'axios'
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import ProjectAPI, {ListProjectType, ProjectDetailType, ProjectType} from '../../api/objectType.ts'
import {ThunkApiConfig} from '../store'


type InitialState = {
    list: Array<ProjectType>
    detail: ProjectDetailType | null
    loading: boolean
}

const initialState: InitialState = {
    list: [],
    detail: null,
    loading: false,
}

export const getProjects = createAsyncThunk<AxiosResponse<ListProjectType>, void, ThunkApiConfig>
(
    'project/list',
    async (_, thunkAPI) => {
        const response = await ProjectAPI.list()
        console.log(thunkAPI)
        return response
    }
)

const projectSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getProjects.pending, (state) => {
                state.loading = true
            })
            .addCase(getProjects.fulfilled, (state, action) => {
                if (action.payload.status === 200) {
                    state.list = action.payload.data.my_projects
                }
            })
            .addCase(getProjects.rejected, (state) => {
                state.loading = false
            })
    }
})

const projectReducer = projectSlice.reducer
export default projectReducer
