const getProfile = (email: string,
                    first_name: string | null,
                    last_name: string | null) => {
    let profile: string = `${email} `
    if (first_name || last_name) {
        profile = profile + '('
        if (first_name) profile = profile + ` ${first_name}`
        if (last_name) profile = profile + ` ${last_name}`
        profile = profile + ' )'
    }
    return profile

}

export default getProfile