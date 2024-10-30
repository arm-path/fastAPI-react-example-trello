import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {authenticationAPI} from '../../api/authenticationAPI.ts'

const initialState: initialStateType = {
    access_token: '',
    token_type: 'bearer',
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
        errors: ''
    }
}

type initialStateType = typeof initialState

export const registrationThunk = createAsyncThunk(
    'authentication/registration',
    async (arg, thunkApi) => {
        const email = thunkApi.getState().authentication.form.email
        const password = thunkApi.getState().authentication.form.password
        if (email.error || !email.value || password.error || !password.value) {
            thunkApi.dispatch(checkFormAC())
        } else {
            const response = await authenticationAPI.registration('email', 'password')
            return response.data
        }
    }
)

export const authenticationThunk = createAsyncThunk(
    'authentication/authentication',
    async (arg, thunkApi) => {
        const email = thunkApi.getState().authentication.form.email
        const password = thunkApi.getState().authentication.form.password
        if (email.error || !email.value || password.error || !password.value) {
            thunkApi.dispatch(checkFormAC())
        } else {
            const response = await authenticationAPI.login(email.value, password.value)
            return response.data
        }
    }
)


const authenticationSlice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {
        changeEmailFormAC(state, action) {
            state.form.email.value = action.payload
            state.form.error = ''
        },
        changePasswordFormAC(state, action) {
            state.form.password.value = action.payload
            state.form.error = ''
        },
        checkEmailFormAC(state, action) {
            const email = action.payload
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email) && email) state.form.email.error = 'Не валидный формат'
            else state.form.email.error = ''
        },
        checkPasswordFormAC(state, action) {
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
                    state.form.password.error = "Пароль должен содержать хотя бы одну заглавную букву."
                } else if (!hasLowerCase) {
                    state.form.password.error = "Пароль должен содержать хотя бы одну строчную букву."
                } else if (!hasNumbers) {
                    state.form.password.error = "Пароль должен содержать хотя бы одну цифру."
                } else if (!hasSpecialChars) {
                    state.form.password.error = "Пароль должен содержать хотя бы один специальный символ."
                } else {
                    state.form.password.error = ''
                }
            } else {
                state.form.password.error = ''
            }
        },
        checkFormAC(state, action) {
            state.form.error = 'В форме регистрации имеются ошибки'
        },
        clearFormAC(state, action) {
            state.form.error = ''
            state.form.email.error = ''
            state.form.email.value = ''
            state.form.password.error = ''
            state.form.password.value = ''
        }
    },
    extraReducers: (builder) => {
        builder.addCase(registrationThunk.fulfilled, (state, action) => {
            if (action.payload) {
                console.log(action.payload)
            }
        })
        builder.addCase(authenticationThunk.fulfilled, (state, action) => {
            if (action.payload) {
                console.log(action.payload)
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
    clearFormAC
} = authenticationSlice.actions

