import axios, {AxiosResponse} from 'axios'
import Cookies from 'js-cookie'
import {TaskType} from './dashboardAPI.ts'


const instance = axios.create({
    baseURL: 'http://localhost:8000/task/',
    withCredentials: true
})


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
    }
}


export default taskAPI