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