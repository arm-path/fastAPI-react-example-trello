import axios, {AxiosResponse} from 'axios'
import {BaseUserType} from './userAPI.ts';
import Cookies from 'js-cookie';


const instance = axios.create({
    baseURL: 'http://localhost:8000/dashboard/',
    withCredentials: true
})

type DashboardType = {
    id: number,
    title: string,
    color: string | null,
    index: number,
    project_id: number,
}

type TaskType = {
    id: number,
    title: string,
    deadline: string,
    created: string,
    updated: string,
    index: 0,
    creator: BaseUserType
}

export type DashboardListType = DashboardType & {
    tasks: Array<TaskType>,
}

const dashboardAPI = {
    headers: {'Authorization': 'Bearer ' + Cookies.get('access_token')},
    async list(projectID: number): Promise<AxiosResponse> {
        return await instance.get<AxiosResponse<Array<DashboardListType>>>(`${projectID}/list/`, {headers: this.headers})
            .then((response) => response)
            .catch(error => error)
    },
    async update(projectID: number, dashboardID: number, title: string): Promise<AxiosResponse> {
        return await instance.put<AxiosResponse<DashboardListType>>(`${projectID}/update/${dashboardID}/`, {
            title: title,
            color: ''
        }, {headers: this.headers})
            .then(response => response)
            .catch(error => error)
    },
    async create(projectID: number, title: string): Promise<AxiosResponse> {
        return await instance.post<AxiosResponse<DashboardListType>>(`${projectID}/create/`, {
            title: title,
            color: ''
        }, {headers: this.headers})
            .then(response => response)
            .catch(error => error)
    }
}

export default dashboardAPI