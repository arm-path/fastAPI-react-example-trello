const initialState: initialStateType = {
    access_token: '',
    token_type: 'bearer',
    form: {
        email: '',
        password: ''
    }
}

type initialStateType = typeof initialState

export const authenticationReducer = (state: initialStateType = initialState, action: any): initialStateType => {
    switch (action.type) {
        case 'CHANGE_EMAIL':
            return {
                ...state,
                form: {
                    ...state.form,
                    email: action.email
                }
            }
        case 'CHANGE_PASSWORD':
            return {
                ...state,
                form: {
                    ...state.form,
                    password: action.password
                }
            }
        case 'REGISTRATION':
            return state
        case 'LOGIN':
            return state
        default:
            return state
    }
}

export const changeEmailFormAC = (email: string) => ({type: 'CHANGE_EMAIL', email})
export const changePasswordFormAC = (password: string) => ({type: 'CHANGE_PASSWORD', password})