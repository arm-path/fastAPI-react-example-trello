import axios, {AxiosResponse} from 'axios'
import qs from 'qs'
import {APIAuthErrorType, APIResponseType, APIValidationErrorType, baseUrl} from './api.ts'

const instance = axios.create({
    baseURL: `${baseUrl}auth`,
    withCredentials: true,
})

type RegisterType = {
    id: number
    email: string
    is_active: boolean
    is_superuser: boolean
    is_verified: boolean
}


type LoginType = {
    access_token: string
    token_type: string
}

export type RegisterResponseType = RegisterType | APIValidationErrorType | APIAuthErrorType
export type LoginResponseType = LoginType | APIValidationErrorType | APIAuthErrorType


export const authAPI = {
    async register(email: string, password: string): Promise<AxiosResponse> {
        return await instance.post<APIResponseType<RegisterResponseType>>('/register/', {
            email,
            password
        })
            .then((response) => response)
            .catch((error) => error.response)
    },
    async login(username: string, password: string): Promise<AxiosResponse> {
        return await instance.post<APIResponseType<LoginResponseType>>('/login/', qs.stringify({username, password}))
            .then((response) => response)
            .catch((error) => error.response)
    },
    async forgotPassword(email: string): Promise<AxiosResponse> {
        return await instance.post<AxiosResponse>('/forgot-password/', {email: email})
            .then((response) => response)
            .catch((error) => error.response)
    },
    async resetPassword(token: string, password: string): Promise<AxiosResponse> {
        return await instance.post<AxiosResponse>('/reset-password/', {token, password})
            .then((response) => response)
            .catch((error) => error.response)
    }
}

