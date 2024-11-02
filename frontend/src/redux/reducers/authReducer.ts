import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import Cookies from 'js-cookie'

import {authAPI, LoginResponseType, RegisterResponseType} from '../../api/authAPI.ts'
import {ThunkApiConfig} from '../store'
import {changeIsAuthAC} from './appReducer'
import {APIResponseType} from '../../api/api'

type FormFieldType = {
    title: string;
    value: string;
    error: string;
}

type  FormStateType = {
    email: FormFieldType;
    password: FormFieldType;
    valid: boolean;
    error: string;
    success: string
}

type InitialStateType = {
    form: FormStateType;
}

const initialState: InitialStateType = {
    form: {
        email: {
            title: 'Email',
            value: '',
            error: ''
        },
        password: {
            title: 'Password',
            value: '',
            error: ''
        },
        valid: false,
        error: '',
        success: ''
    }
}


export const registerThunk = createAsyncThunk<
    APIResponseType<RegisterResponseType> | undefined,
    void,
    ThunkApiConfig>
(
    'auth/register',
    async (_, thunkApi) => {

        const email = thunkApi.getState().auth.form.email
        const password = thunkApi.getState().auth.form.password
        if (email.error || !email.value || password.error || !password.value) {
            thunkApi.dispatch(checkFormAC())
        } else {
            const response = await authAPI.register(email.value, password.value)
            return {'status': response.status, 'data': response.data}
        }
    }
)


export const authThunk = createAsyncThunk<
    APIResponseType<LoginResponseType> | undefined,
    void,
    ThunkApiConfig>
(
    'auth/auth',
    async (_, thunkApi) => {
        const email = thunkApi.getState().auth.form.email
        const password = thunkApi.getState().auth.form.password
        if (email.error || !email.value || password.error || !password.value) {
            thunkApi.dispatch(checkFormAC())
        } else {
            const response = await authAPI.login(email.value, password.value)
            if (response.status === 200) {
                Cookies.set('access_token', response.data.access_token)
                thunkApi.dispatch(changeIsAuthAC(true))
            } else thunkApi.dispatch(changeIsAuthAC(false))

            return {'status': response.status, 'data': response.data}
        }
    }
)


const authenticationSlice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {
        changeEmailFormAC(state, action: PayloadAction<string>) {
            state.form.email.value = action.payload
            state.form.error = ''
        },
        changePasswordFormAC(state, action: PayloadAction<string>) {
            state.form.password.value = action.payload
            state.form.error = ''
        },
        checkEmailFormAC(state, action: PayloadAction<string>) {
            const email = action.payload
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email) && email) state.form.email.error = 'Не валидный формат'
            else state.form.email.error = ''
        },
        checkPasswordFormAC(state, action: PayloadAction<string>) {
            const password = action.payload
            const minLength: number = 8;
            const hasUpperCase: boolean = /[A-Z]/.test(password);
            const hasLowerCase: boolean = /[a-z]/.test(password);
            const hasNumbers: boolean = /\d/.test(password);
            const hasSpecialChars: boolean = /[!@#$%^&*(),.?":{}|<>]/.test(password);

            if (password) {
                if (password.length < minLength) {
                    state.form.password.error = `Пароль должен содержать не менее ${minLength} символов.`
                } else if (!hasUpperCase) {
                    state.form.password.error = 'Пароль должен содержать хотя бы одну заглавную букву.'
                } else if (!hasLowerCase) {
                    state.form.password.error = 'Пароль должен содержать хотя бы одну строчную букву.'
                } else if (!hasNumbers) {
                    state.form.password.error = 'Пароль должен содержать хотя бы одну цифру.'
                } else if (!hasSpecialChars) {
                    state.form.password.error = 'Пароль должен содержать хотя бы один специальный символ.'
                } else {
                    state.form.password.error = ''
                }
            } else {
                state.form.password.error = ''
            }
        },
        checkFormAC(state) {
            state.form.error = 'В форме регистрации имеются ошибки'
        },
        clearFormAC(state) {
            state.form.error = ''
            state.form.email.error = ''
            state.form.email.value = ''
            state.form.password.error = ''
            state.form.password.value = ''
        }
    },
    extraReducers: (builder) => {
        builder.addCase(registerThunk.fulfilled, (state, action) => {
            if (action.payload) if (action.payload.status === 201) {
                state.form.success = 'Пользователь успешно зарегистрирован, проверьте почту'
                state.form.email.value = ''
                state.form.password.value = ''
            } else if (action.payload.status === 400) {
                state.form.error = 'Пользователь уже существует'
            } else if (action.payload.status === 422) {
                state.form.error = 'Ошибка валидации данных'
            } else {
                state.form.error = 'Произошла ошибка на стороне сервера'
            }
        })
        builder.addCase(authThunk.fulfilled, (state, action) => {
            if (action.payload) {
                if (action.payload.status === 200) {
                    state.form.success = 'Пользователь успешно авторизовался'
                    state.form.email.value = ''
                    state.form.password.value = ''
                } else if (action.payload.status === 400) {
                    state.form.error = 'Неверно введен Email или Password'
                } else if (action.payload.status === 422) {
                    state.form.error = 'Ошибка валидации данных'
                } else {
                    state.form.error = 'Произошла ошибка на стороне сервера'
                }
            }
        })
    }
})

export const authReducer = authenticationSlice.reducer
export const {
    changeEmailFormAC,
    changePasswordFormAC,
    checkEmailFormAC,
    checkPasswordFormAC,
    checkFormAC,
    clearFormAC,
} = authenticationSlice.actions

