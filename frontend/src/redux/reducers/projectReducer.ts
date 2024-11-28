import {AxiosResponse} from 'axios'
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import ProjectAPI, {
    BaseInvitationType,
    CreateResponseType,
    InvitedProjectType,
    ListProjectType,
    ProjectDetailType,
    ProjectType,
    UpdateResponseType
} from '../../api/projectAPI.ts'
import {ThunkApiConfig} from '../store'
import validateEmail from '../../utils/validations/validateEmail.ts';
import {APIBaseErrorType} from '../../api/api.ts';
import projectAPI from '../../api/projectAPI.ts';


type InitialState = {
    list: Array<ProjectType>
    invited_projects: Array<InvitedProjectType>
    inviteUserForm: {
        email: string | null,
        emailError: string | null,
        error: string | null,
        loading: boolean,
        invite: boolean
    }
    createForm: CreateForm
    updateForm: UpdateForm
    detail: ProjectDetailType | null
    showSettingsDetail: boolean
    loading: boolean
}

type CreateForm = {
    title: string,
    loading: boolean,
    error: string
}

export type UpdateForm = {
    id: number | null,
    title: string,
    loading: boolean,
    error: string
}

const initialState: InitialState = {
    list: [],
    invited_projects: [],
    inviteUserForm: {
        email: null,
        emailError: null,
        error: null,
        loading: false,
        invite: false
    },
    createForm: {
        title: '',
        loading: false,
        error: ''
    },
    updateForm: {
        id: null,
        title: '',
        error: '',
        loading: false
    },
    detail: null,
    showSettingsDetail: false,
    loading: false,
}

export const getProjects = createAsyncThunk<AxiosResponse<ListProjectType>>
(
    'project/list',
    async () => {
        return await ProjectAPI.list()
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

export const updateProjectThunk = createAsyncThunk<AxiosResponse<UpdateResponseType> | undefined, void, ThunkApiConfig>
(
    'project/update',
    async (_, thunkAPI) => {
        const editForm: UpdateForm = thunkAPI.getState().projects.updateForm
        if (editForm.title.length === 0) return undefined
        if (editForm.id) return await ProjectAPI.update(editForm.id, editForm.title)
        else return undefined
    }
)

export const getProjectThunk = createAsyncThunk<AxiosResponse<ProjectDetailType>, number>
(
    'project/detail',
    async (projectID: number) => {
        return await ProjectAPI.detail(projectID)
    }
)

export const inviteUserThunk = createAsyncThunk<
    AxiosResponse<BaseInvitationType> | AxiosResponse<APIBaseErrorType> | undefined, void, ThunkApiConfig>
(
    'project/inviteUser',
    async (_, thunkAPI) => {
        const form = thunkAPI.getState().projects.inviteUserForm
        const projectId = thunkAPI.getState().projects.detail?.id
        if (!form.email || form.emailError || !projectId) return undefined
        else return await projectAPI.inviteUser(projectId, form.email)
    }
)

const projectSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {
        changeTitleCreateProjectAC(state, action: PayloadAction<string>) {
            state.createForm.title = action.payload
            state.createForm.error = ''
        },
        setEditFormAC(state, action: PayloadAction<number | null>) {
            state.updateForm.id = action.payload
            state.updateForm.error = ''
            if (action.payload) {
                const project = state.list.find(el => el.id === action.payload)
                if (project) state.updateForm.title = project.title
            } else {
                state.updateForm.title = ''
            }
        },
        changeTitleUpdateProjectAC(state, action: PayloadAction<string>) {
            state.updateForm.title = action.payload
        },
        setShowSettingsDetailAC(state, action: PayloadAction<boolean>) {
            if (state.detail) {
                state.showSettingsDetail = action.payload
            }
        },
        changeInviteUserForm(state, action: PayloadAction<string>) {
            state.inviteUserForm.email = action.payload
            state.inviteUserForm.emailError = null
            state.inviteUserForm.error = null
            state.inviteUserForm.invite = false
        },
        checkInviteUserEmail(state) {
            if (state.inviteUserForm.email && !validateEmail(state.inviteUserForm.email)) {
                state.inviteUserForm.emailError = 'Email адрес не действительный!'
                state.inviteUserForm.invite = false
            }
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
                    state.invited_projects = action.payload.data.invited_projects
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
            .addCase(updateProjectThunk.pending, (state) => {
                state.updateForm.loading = true
            })
            .addCase(updateProjectThunk.fulfilled, (state, action) => {
                if (action.payload) {
                    if (action.payload.status === 200 && 'id' in action.payload.data) {
                        const project = state.list.find(el => el.id === state.updateForm.id)
                        if (project) project.title = action.payload.data.title
                        state.updateForm.id = null
                        state.updateForm.title = ''
                    } else if (action.payload.status === 409) {
                        state.updateForm.error = 'Произошел конфликт при создании'
                    } else if (action.payload.status === 422) {
                        state.updateForm.error = 'Ошибка валидации данных'
                    } else {
                        state.updateForm.error = 'Произошла ошибка на стороне сервера'
                    }
                } else {
                    state.updateForm.error = 'Не удалось изменить название'
                }

                state.updateForm.loading = false
            })
            .addCase(getProjectThunk.pending, (state) => {
                state.loading = true
            })
            .addCase(getProjectThunk.fulfilled, (state, action) => {
                if (action.payload.status === 200) {
                    state.detail = action.payload.data
                }
                state.loading = false
            })
            .addCase(inviteUserThunk.pending, (state) => {
                state.inviteUserForm.loading = true
            })
            .addCase(inviteUserThunk.fulfilled, (state, action) => {
                if (action.payload) {
                    if (action.payload.status === 200) {
                        const data = action.payload.data as BaseInvitationType
                        console.log(data)
                        state.inviteUserForm.invite = true
                        state.inviteUserForm.email = null
                    } else if (action.payload.status === 409 || action.payload.status === 404) {
                        state.inviteUserForm.invite = false
                        const error = action.payload.data as APIBaseErrorType
                        if (error.detail.msg === 'Unique violation error') {
                            state.inviteUserForm.error = 'Пользователь уже приглашен.'
                        } else if (error.detail.msg === 'User not found') {
                            state.inviteUserForm.error = 'Пользователь не существует.'
                        } else {
                            state.inviteUserForm.error = 'Конфликт на сервере.'
                        }
                    } else if (action.payload.status === 422) {
                        state.inviteUserForm.invite = false
                        state.inviteUserForm.error = 'Не прошла валидация данных на сервере.'
                    } else {
                        state.inviteUserForm.invite = false
                        state.inviteUserForm.error = 'Ошибка сервера.'
                    }
                } else {
                    state.inviteUserForm.invite = false
                    state.inviteUserForm.error = 'Не прошла валидация данных на клиенте.'
                }
                state.inviteUserForm.loading = false
            })
    }
})

export const {
    changeTitleCreateProjectAC,
    changeTitleUpdateProjectAC,
    setEditFormAC,
    setShowSettingsDetailAC,
    changeInviteUserForm,
    checkInviteUserEmail
} = projectSlice.actions

const projectReducer = projectSlice.reducer
export default projectReducer
