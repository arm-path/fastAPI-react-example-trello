import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://127.0.0.1:8000/auth',
})

type RegistrationResponse = {
    id: number
    email: string
    is_active: boolean
    is_superuser: boolean
    is_verified: boolean
}

type LoginResponse = {
    access_token: string
    token_type: string
}

export const authenticationAPI = {
    async registration(email: string, password: string): Promise<RegistrationResponse> {
        return await instance.post('/register/', {email, password})
    },
    async login(username: string, password: string): Promise<LoginResponse> {
        return await instance.post('/login/', {username, password})
    }
}