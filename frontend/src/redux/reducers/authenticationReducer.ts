import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import Cookies from 'js-cookie'

import {authenticationAPI, LoginResponseType, RegistrationResponseType} from '../../api/authenticationAPI.ts'
import {ThunkApiConfig} from '../store.ts'
import {initializeApp} from './appReducer'

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


export const registrationThunk = createAsyncThunk<
    RegistrationResponseType | undefined,
    void,
    ThunkApiConfig>
(
    'authentication/registration',
    async (_, thunkApi) => {

        const email = thunkApi.getState().authentication.form.email
        const password = thunkApi.getState().authentication.form.password
        if (email.error || !email.value || password.error || !password.value) {
            thunkApi.dispatch(checkFormAC())
        } else {
            const response = await authenticationAPI.registration('email', 'password')
            return {'status': response.status, 'data': response.data}
        }
    }
)


export const authenticationThunk = createAsyncThunk<
    LoginResponseType | undefined,
    void,
    ThunkApiConfig>
(
    'authentication/authentication',
    async (_, thunkApi) => {
        const email = thunkApi.getState().authentication.form.email
        const password = thunkApi.getState().authentication.form.password
        if (email.error || !email.value || password.error || !password.value) {
            thunkApi.dispatch(checkFormAC())
        } else {
            const response = await authenticationAPI.login(email.value, password.value)
            if (response.status === 200) {
                Cookies.set('access_token', response.data.access_token)
                thunkApi.dispatch(initializeApp())
            }
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
        builder.addCase(registrationThunk.fulfilled, (state, action) => {
            if (action.payload) if (action.payload.status === 200) {
                state.form.success = 'Пользователь успешно зарегистрирован, проверьте почту'
            } else if (action.payload.status === 400) {
                state.form.error = 'Пользователь уже существует'
            } else if (action.payload.status === 422) {
                state.form.error = 'Ошибка валидации данных'
            } else {
                state.form.error = 'Произошла ошибка на стороне сервера'
            }
        })
        builder.addCase(authenticationThunk.fulfilled, (state, action) => {
            if (action.payload) {
                if (action.payload.status === 200) {
                    state.form.success = 'Пользователь успешно авторизовался'
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

export const authenticationReducer = authenticationSlice.reducer
export const {
    changeEmailFormAC,
    changePasswordFormAC,
    checkEmailFormAC,
    checkPasswordFormAC,
    checkFormAC,
    clearFormAC,
} = authenticationSlice.actions

