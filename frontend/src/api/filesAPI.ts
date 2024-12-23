import axios, {AxiosResponse} from 'axios'
import {baseUrl, getHeader} from './api.ts'
import Cookies from 'js-cookie'
import {TaskFilesType} from './taskAPI.ts'

const instance = axios.create({
    baseURL: `${baseUrl}files`,
})


const filesAPI = {
    async load(task_id: number, files: FormData | File): Promise<AxiosResponse> {
        return await instance.post<AxiosResponse<TaskFilesType>>(
            `load/${task_id}/`,
            files,
            {headers: {'Authorization': 'Bearer ' + Cookies.get('access_token'), 'content-type': 'multipart/form-data'}}
        )
            .then(response => response)
            .catch(error => error.response)
    },
    async delete(file_id: number): Promise<AxiosResponse> {
        return await instance.delete<AxiosResponse>(`delete/${file_id}/`, {headers: getHeader()})
            .then(response => response)
            .catch(error => error.response)
    }
}

export default filesAPI