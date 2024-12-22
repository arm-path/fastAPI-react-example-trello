import axios, {AxiosResponse} from 'axios'

import {APIAuthErrorType, APIBaseErrorType, APIValidationErrorType, baseUrl, getHeader} from './api.ts'

const instance = axios.create({
    baseURL: `${baseUrl}user/`,
    withCredentials: true
})

export type UserType = {
    id: number,
    email: string,
    first_name: string | null,
    last_name: string | null,
    is_active: boolean,
    is_verified: boolean
}

export type BaseUserType = {
    id: number,
    email: string,
    first_name: string | null,
    last_name: string | null,
}

type UserBaseErrorType = APIValidationErrorType | APIBaseErrorType | APIAuthErrorType
export type UserDetailResponseType = AxiosResponse<UserType | UserBaseErrorType>
export type UserUpdateResponseType = AxiosResponse<UserType | UserBaseErrorType>


const userAPI = {
    async detail(): Promise<AxiosResponse> {
        return await instance.get<UserDetailResponseType>('detail/',
            {headers: getHeader()})
            .then(response => response)
            .catch(error => error.response)
    },
    async update(first_name: string, last_name: string): Promise<AxiosResponse> {
        return await instance.put<UserUpdateResponseType>(
            `update/`,
            {first_name, last_name},
            {headers: getHeader()})
            .then(response => response)
            .catch(error => error.response)
    }
}

export default userAPI