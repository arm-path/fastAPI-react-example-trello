import {AxiosResponse} from 'axios'
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import ProjectAPI, {CreateResponseType, ListProjectType, ProjectDetailType, ProjectType} from '../../api/projectAPI.ts'
import {ThunkApiConfig} from '../store'


type InitialState = {
    list: Array<ProjectType>
    createForm: CreateForm
    detail: ProjectDetailType | null
    loading: boolean
}

type CreateForm = {
    title: string,
    loading: boolean,
    error: string
}

const initialState: InitialState = {
    list: [],
    createForm: {
        title: '',
        loading: false,
        error: ''
    },
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

export const createProjectThunk = createAsyncThunk<AxiosResponse<CreateResponseType> | undefined, void, ThunkApiConfig>
(
    'project/create',
    async (_, thunkAPI) => {
        const title = thunkAPI.getState().projects.createForm.title
        if (title.trim().length === 0) return undefined

        return await ProjectAPI.create(title)
    }
)

const projectSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {
        changeTitleCreateProjectAC(state, action: PayloadAction<string>) {
            state.createForm.title = action.payload
            state.createForm.error = ''
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProjects.pending, (state) => {
                state.loading = true
            })
            .addCase(getProjects.fulfilled, (state, action) => {
                if (action.payload.status === 200) {
                    state.list = action.payload.data.my_projects
                }
                state.loading = false
            })
            .addCase(getProjects.rejected, (state) => {
                state.loading = false
            })
            .addCase(createProjectThunk.pending, (state) => {
                state.createForm.loading = true
            })
            .addCase(createProjectThunk.fulfilled, (state, action) => {
                if (action.payload) {
                    if (action.payload.status === 200 && 'id' in action.payload.data) {
                        state.list.push(action.payload.data)
                        state.createForm.title = ''
                    } else if (action.payload.status === 409) {
                        state.createForm.error = 'Произошел конфликт при создании'
                    } else if (action.payload.status === 422) {
                        state.createForm.error = 'Ошибка валидации данных'
                    } else {
                        state.createForm.error = 'Произошла ошибка на стороне сервера'
                    }
                } else {
                    state.createForm.error = 'Название не может быть пустым'
                }

                state.createForm.loading = false
            })
    }
})

export const {
    changeTitleCreateProjectAC
} = projectSlice.actions

const projectReducer = projectSlice.reducer
export default projectReducer
