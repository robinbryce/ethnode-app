export const UPDATE_IDTOKEN = 'AUTH_UPDATE_IDTOKEN';

export const updateIDToken = idToken => {
    return {
        type: UPDATE_IDTOKEN,
        idToken
    }
}