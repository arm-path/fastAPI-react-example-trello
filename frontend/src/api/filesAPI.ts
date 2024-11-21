import axios, {AxiosResponse} from 'axios'
import {baseUrl} from './api.ts'
import Cookies from 'js-cookie'
import {TaskFilesType} from './taskAPI.ts'

const instance = axios.create({
    baseURL: `${baseUrl}files`,
})


const filesAPI = {
    access_token: Cookies.get('access_token'),
    headers: {'Authorization': 'Bearer ' + Cookies.get('access_token')},
    async load(task_id: number, files: FormData | File): Promise<AxiosResponse> {
        return await instance.post<AxiosResponse<TaskFilesType>>(
            `load/${task_id}/`,
            files,
            {
                headers: {
                    'Authorization': 'Bearer ' + this.access_token, 'content-type': 'multipart/form-data'
                }
            }).then(response => response)
            .catch(error => error)
    }
}

export default filesAPI