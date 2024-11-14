import axios, {AxiosResponse} from 'axios'
import Cookies from 'js-cookie'
import {TaskType} from './dashboardAPI.ts'
import {BaseUserType} from './userAPI.ts'


const instance = axios.create({
    baseURL: 'http://localhost:8000/task/',
    withCredentials: true
})

type TaskFiles = {
    id: number,
    url: string,
    user: BaseUserType
}

export type TaskDetailType = TaskType & {
    description: string,
    responsible: Array<BaseUserType>
    files: Array<TaskFiles>
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
    }
}


export default taskAPI