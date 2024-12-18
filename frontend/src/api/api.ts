export type APIResponseType<D = {}> = {
    status: number
    data: D
}

export type APIValidationErrorType = {
    detail: Array<object>
}

export type APIAuthErrorType = {
    detail: {}
}

type BaseErrorType = {
    msg: string,
}

export type APIBaseErrorType = {
    detail: BaseErrorType
}

export const baseUrl = 'http://localhost:8000/'