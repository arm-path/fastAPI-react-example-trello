export const activateUserError = (backendMessage: string | null) => {
    switch (backendMessage) {
        case 'UserAlreadyActivated':
            return 'Пользователь уже активен.'
        case 'TokenExpired':
            return 'Ссылка активации пользователя устарела и не активна.'
        case 'InvalidToken':
            return 'Ссылка активации пользователя некорректно.'
        default:
            return ''
    }
}