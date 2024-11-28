function validateEmail(email: string | null) {
    if (email == null) return false
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email);
}

export default validateEmail