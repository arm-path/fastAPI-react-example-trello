import axios, {AxiosResponse} from 'axios'
import qs from 'qs'

const instance = axios.create({
    baseURL: 'http://localhost:8000/auth',
    withCredentials: true,
})

type RegistrationSuccessType = {
    id: number
    email: string
    is_active: boolean
    is_superuser: boolean
    is_verified: boolean
}

export type RegistrationResponseType = {
    status: number
    data: RegistrationSuccessType | { detail: string }
}

type LoginSuccessType = {
    access_token: string
    token_type: string
}

export type LoginResponseType = {
    status: number
    data: LoginSuccessType
}


export const authenticationAPI = {
    async registration(email: string, password: string): Promise<AxiosResponse> {
        return await instance.post<RegistrationResponseType>('/register', {email, password})
            .then((response) => response)
            .catch((error) => error.response)
    },
    async login(username: string, password: string): Promise<AxiosResponse> {
        return await instance.post<LoginResponseType>('/login/', qs.stringify({username, password}))
            .then((response) => response)
            .catch((error) => error.response)
    }
}

