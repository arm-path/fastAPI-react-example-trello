const dateFormat = (dateToString: string) => {
    const date = new Date(dateToString)
    return date.toLocaleString('ru-RU', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    })

}

export default dateFormat