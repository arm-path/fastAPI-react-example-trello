import axios, {AxiosResponse} from 'axios'
import {TaskType} from './dashboardAPI.ts'
import {BaseUserType} from './userAPI.ts'
import {EditFieldType} from '../redux/reducers/taskReducer.ts';
import {baseUrl, getHeader} from './api.ts'


const instance = axios.create({
    baseURL: `${baseUrl}task/`,
    withCredentials: true
})

export type TaskFilesType = {
    id: number,
    url: string,
    user: BaseUserType
}

export type TaskDetailType = TaskType & {
    description: string,
    responsible: Array<BaseUserType>
    files: Array<TaskFilesType>
}

export type TaskUpdateValue = {
    [key in EditFieldType]: string
}

const taskAPI = {
    async create(title: string, descriptions: string, deadline: string, dashboard_id: number): Promise<AxiosResponse> {
        return await instance.post<AxiosResponse<TaskType>>('create/', {
            title,
            descriptions,
            deadline,
            dashboard_id
        }, {headers: getHeader()})
            .then(response => response)
            .catch(error => error)
    },
    async moving(task_id: number, dashboard_id: number, index: number): Promise<AxiosResponse> {
        return await instance.put<AxiosResponse<TaskType>>(`moving-dashboard/${task_id}/`, {
            index,
            dashboard_id
        }, {headers: getHeader()})
            .then(response => response)
            .catch(error => error)
    },
    async detail(task_id: number): Promise<AxiosResponse> {
        return await instance.get<AxiosResponse<TaskDetailType>>(`detail/${task_id}/`, {headers: getHeader()})
            .then(response => response)
            .catch(error => error)
    },
    async update(task_id: number, value: TaskUpdateValue): Promise<AxiosResponse> {
        return await instance.put<AxiosResponse<TaskDetailType>>(`update/${task_id}/`, value, {headers: getHeader()})
            .then(response => response)
            .catch(error => error)
    },
    async assignUser(task_id: number, user_id: number): Promise<AxiosResponse> {
        return await instance.post(`assign-users/${task_id}/`, {user_ids: [user_id,]}, {headers: getHeader()})
            .then(response => response)
            .catch(error => error)
    },
    async deleteUser(task_id: number, user_id: number): Promise<AxiosResponse> {
        return await instance.put<AxiosResponse<TaskDetailType>>(
            `delete-users/${task_id}/`,
            {user_ids: [user_id,]},
            {headers: getHeader()})
            .then(response => response)
            .catch(error => error)
    }
}


export default taskAPI