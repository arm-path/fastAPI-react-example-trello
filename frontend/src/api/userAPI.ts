import axios, {AxiosResponse} from 'axios'

import {APIResponseType, APIValidationErrorType, baseUrl, getHeader} from './api.ts'

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


const userAPI = {
    async detail() {
        return await instance.get<APIResponseType<UserType | APIValidationErrorType>>('detail/',
            {headers: getHeader()})
            .then(response => response)
            .catch(error => error.response)
    },
    async update(first_name: string, last_name: string): Promise<AxiosResponse> {
        return await instance.put<APIResponseType<UserType | APIValidationErrorType>>(
            `update/`,
            {first_name, last_name},
            {headers: getHeader()})
            .then(response => response)
            .catch(error => error.response)
    }
}

export default userAPI