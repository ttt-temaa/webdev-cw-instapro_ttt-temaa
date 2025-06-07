export function saveUserToLocalStorage(user) {
    window.localStorage.setItem('user', JSON.stringify(user))
}

export function getUserFromLocalStorage(user) {
    try {
        return JSON.parse(window.localStorage.getItem('user'))
    } catch (error) {
        return null
    }
}

export function removeUserFromLocalStorage(user) {
    window.localStorage.removeItem('user')
}

export function clearingHtml(unsafe) {
    const clearingTag = unsafe.replace(/<[^>]*>/g, '')
    const clearingChars = clearingTag
        .replace(/&lt;/g, '')
        .replace(/\//g, '')
        .replace(/b&gt;/g, '')
        .replace(/&/g, '')
        .replace(/</g, '')
        .replace(/>/g, '')
        .replace(/"/g, '')
        .replace(/'/g, '')

    return clearingChars.trim().replace(/\s+/g, ' ')
}

export function delay(interval = 400) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, interval)
    })
}