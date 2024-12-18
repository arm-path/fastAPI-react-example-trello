import axios, {AxiosResponse} from 'axios'
import Cookies from 'js-cookie'

import {BaseUserType} from './userAPI'
import {APIAuthErrorType, APIBaseErrorType, APIValidationErrorType} from './api.ts'


const instance = axios.create({
    baseURL: 'http://localhost:8000/project/',
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
    headers: {'Authorization': 'Bearer ' + Cookies.get('access_token')},

    async create(title: string): Promise<AxiosResponse> {
        return await instance.post<AxiosResponse<CreateResponseType>>('create/', {title}, {headers: this.headers})
            .then(response => response)
            .catch(error => error)
    },
    async update(id: number, title: string) {
        return await instance.put(`update/${id}`, {title}, {headers: this.headers})
            .then((response: AxiosResponse<ProjectType>) => response)
            .catch((error: AxiosResponse<UpdateErrorResponseType>) => error)
    },
    async delete(id: number): Promise<AxiosResponse> {
        return await instance.delete<AxiosResponse<null>>(`delete/${id}/`, {headers: this.headers})
            .then(response => response)
            .catch(error => error)
    },
    async list(): Promise<AxiosResponse> {
        return await instance.get<AxiosResponse<Array<ListProjectType>>>('/list/', {headers: this.headers})
            .then(response => response)
            .catch(error => error)
    },
    async detail(id: number): Promise<AxiosResponse> {
        return await instance.get(`detail/${id}/`, {headers: this.headers})
            .then((response: AxiosResponse<ProjectDetailType>) => response)
            .catch(error => error)
    },
    async inviteUser(project_id: number, email: string): Promise<AxiosResponse> {
        return await instance.post<AxiosResponse<BaseInvitationType | APIBaseErrorType>>(
            `invite-user/${project_id}/`, {email}, {headers: this.headers}
        )
            .then(response => response)
            .catch(error => error.response)
    },
    async deleteUser(project_id: number, invitation_id: number): Promise<AxiosResponse> {
        return await instance.delete(`delete-user/${project_id}/${invitation_id}/`, {headers: this.headers})
            .then(response => response)
            .catch(error => error.response)
    }
}

export default projectAPI