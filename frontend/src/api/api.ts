import Cookies from 'js-cookie';

export type APIResponseType<D = {}> = {
    status: number
    data: D
}

export type APIValidationErrorType = {
    detail: Array<object>
}

export type APIAuthErrorType = {
    detail: string
}

export type APIBaseErrorType = {
    detail: { msg: string }
}

export const getHeader = () => {
    return {'Authorization': 'Bearer ' + Cookies.get('access_token')}
}

export const baseUrl = 'http://localhost:8000/'