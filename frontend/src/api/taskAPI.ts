import axios, {AxiosResponse} from 'axios'
import Cookies from 'js-cookie'
import {TaskType} from './dashboardAPI.ts'
import {BaseUserType} from './userAPI.ts'
import {EditFieldType} from '../redux/reducers/taskReducer.ts';


const instance = axios.create({
    baseURL: 'http://localhost:8000/task/',
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

export type TaskUpdateValueType =
    { title: string; deadline?: never; description?: never }
    | { title?: never; deadline: string; description?: never }
    | { title?: never; deadline?: never; description: string }


export type TaskUpdateValue = {
    [key in EditFieldType]: string
}

const taskAPI = {
    headers: {'Authorization': 'Bearer ' + Cookies.get('access_token')},

    async create(title: string, descriptions: string, deadline: string, dashboard_id: number): Promise<AxiosResponse> {
        return await instance.post<AxiosResponse<TaskType>>('create/', {
            title,
            descriptions,
            deadline,
            dashboard_id
        }, {headers: this.headers})
            .then(response => response)
            .catch(error => error)
    },
    async moving(task_id: number, dashboard_id: number, index: number): Promise<AxiosResponse> {
        return await instance.put<AxiosResponse<TaskType>>(`moving-dashboard/${task_id}/`, {
            index,
            dashboard_id
        }, {headers: this.headers})
            .then(response => response)
            .catch(error => error)
    },
    async detail(task_id: number): Promise<AxiosResponse> {
        return await instance.get<AxiosResponse<TaskDetailType>>(`detail/${task_id}/`, {headers: this.headers})
            .then(response => response)
            .catch(error => error)
    },
    async update(task_id: number, value: TaskUpdateValue): Promise<AxiosResponse> {
        return await instance.put<AxiosResponse<TaskDetailType>>(`update/${task_id}/`, value, {headers: this.headers})
            .then(response => response)
            .catch(error => error)
    },
    async assignUser(task_id: number, user_id: number): Promise<AxiosResponse> {
        return await instance.post(`assign-users/${task_id}/`, {user_ids: [user_id,]}, {headers: this.headers})
            .then(response => response)
            .catch(error => error)
    },
    async deleteUser(task_id: number, user_id: number): Promise<AxiosResponse> {
        return await instance.put<AxiosResponse<TaskDetailType>>(
            `delete-users/${task_id}/`,
            {user_ids: [user_id,]},
            {headers: this.headers})
            .then(response => response)
            .catch(error => error)
    }
}


export default taskAPI