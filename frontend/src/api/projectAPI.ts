import axios, {AxiosResponse} from 'axios'

import {BaseUserType} from './userAPI'
import {APIAuthErrorType, APIBaseErrorType, APIValidationErrorType, baseUrl, getHeader} from './api.ts'


const instance = axios.create({
    baseURL: `${baseUrl}project/`,
    withCredentials: true,
})

export type ProjectType = {
    id: number,
    title: string,
}

export type InvitedProjectType = {
    id: number,
    title: string,
    user_id: number,
}

export type ListProjectType = {
    my_projects: Array<ProjectType>,
    invited_projects: Array<InvitedProjectType>,
}

export type BaseInvitationType = {
    id: number,
    accepted: boolean,
    user: BaseUserType
}

export type ProjectDetailType = {
    id: number,
    title: string
    user: BaseUserType
    invitations: Array<BaseInvitationType>

}

export type CreateResponseType = ProjectType | APIValidationErrorType | APIAuthErrorType | APIBaseErrorType
export type UpdateErrorResponseType = APIValidationErrorType | APIAuthErrorType
export type UpdateResponseType = ProjectType | APIValidationErrorType | APIAuthErrorType | APIBaseErrorType

const projectAPI = {
    async create(title: string): Promise<AxiosResponse> {
        return await instance.post<AxiosResponse<CreateResponseType>>('create/', {title}, {headers: getHeader()})
            .then(response => response)
            .catch(error => error)
    },
    async update(id: number, title: string) {
        return await instance.put(`update/${id}`, {title}, {headers: getHeader()})
            .then((response: AxiosResponse<ProjectType>) => response)
            .catch((error: AxiosResponse<UpdateErrorResponseType>) => error)
    },
    async delete(id: number): Promise<AxiosResponse> {
        return await instance.delete<AxiosResponse<null>>(`delete/${id}/`, {headers: getHeader()})
            .then(response => response)
            .catch(error => error)
    },
    async list(): Promise<AxiosResponse> {
        return await instance.get<AxiosResponse<Array<ListProjectType>>>('/list/', {headers: getHeader()})
            .then(response => response)
            .catch(error => error.response)
    },
    async detail(id: number): Promise<AxiosResponse> {
        return await instance.get(`detail/${id}/`, {headers: getHeader()})
            .then((response: AxiosResponse<ProjectDetailType>) => response)
            .catch(error => error)
    },
    async inviteUser(project_id: number, email: string): Promise<AxiosResponse> {
        return await instance.post<AxiosResponse<BaseInvitationType | APIBaseErrorType>>(
            `invite-user/${project_id}/`, {email}, {headers: getHeader()}
        )
            .then(response => response)
            .catch(error => error.response)
    },
    async deleteUser(project_id: number, invitation_id: number): Promise<AxiosResponse> {
        return await instance.delete(`delete-user/${project_id}/${invitation_id}/`, {headers: getHeader()})
            .then(response => response)
            .catch(error => error.response)
    }
}

export default projectAPI