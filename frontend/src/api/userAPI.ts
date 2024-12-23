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

export type InvitationProjectsType = {
    id: number,
    title: string,
    user: BaseUserType
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
    },
    async invitationProjects(): Promise<AxiosResponse> {
        return await instance.get<AxiosResponse<Array<InvitationProjectsType>>>('invitations-projects/', {headers: getHeader()})
            .then(response => response)
            .catch(error => error.response)
    },
    async invitationProjectsAccept(projectId: number): Promise<AxiosResponse> {
        return await instance.post<AxiosResponse<Array<InvitationProjectsType>>>(
            'invitation-project/accept/',
            {project_id: projectId},
            {headers: getHeader()})
            .then(response => response)
            .catch(error => error.response)
    },
    async invitationProjectsDelete(projectId: number): Promise<AxiosResponse> {
        return await instance.post<AxiosResponse>('invited-project/delete/',
            {project_id: projectId},
            {headers: getHeader()})
            .then(response => response)
            .catch(error => error.response)
    }
}

export default userAPI