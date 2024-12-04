import axios, {AxiosResponse} from 'axios'
import Cookies from 'js-cookie'

import {APIResponseType, APIValidationErrorType} from './api.ts'

const instance = axios.create({
    baseURL: 'http://localhost:8000/user/',
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
    headers: {'Authorization': 'Bearer ' + Cookies.get('access_token')},
    async detail() {
        return await instance.get<APIResponseType<UserType | APIValidationErrorType>>('detail/',
            {headers: this.headers})
            .then(response => response)
            .catch(error => error.response)
    },
    async update(first_name: string, last_name: string): Promise<AxiosResponse> {
        return await instance.put<APIResponseType<UserType | APIValidationErrorType>>(
            `update/`,
            {first_name, last_name},
            {headers: this.headers})
            .then(response => response)
            .catch(error => error.response)
    }
}

export default userAPI