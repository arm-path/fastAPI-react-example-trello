import axios from 'axios'
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
    async detail() {
        const headers = {
            'Authorization': 'Bearer ' + Cookies.get('access_token')
        }
        return await instance.get<APIResponseType<UserType | APIValidationErrorType>>('/detail', {headers})
            .then(
                response => response
            ).catch(
                error => error
            )
    }
}

export default userAPI