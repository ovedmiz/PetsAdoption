
import jwt_decode from "jwt-decode";


const getToken = () => {
    try {
        let token = sessionStorage.getItem('token')
        return token
    } catch (e) {
        return false
    }
}

const getConnectedUserId = () => {
    try {
        let user = JSON.parse(sessionStorage.getItem('user'))
        return user.id
    } catch (e) {
        return false
    }
}

const getConnectedUser = () => {
    try {
        let user = JSON.parse(sessionStorage.getItem('user'))
        return user
    } catch (e) {
        return false
    }
}

const decodeAndStoreTokenData = (token) => {
    let decoded = jwt_decode(token);
    let obj = { id: decoded.userId, firstName: decoded.firstName, lastName: decoded.lastName }
    sessionStorage.setItem('user', JSON.stringify(obj))
    sessionStorage.setItem('token', token)
    return obj
}


const storageService = {
    getToken, decodeAndStoreTokenData,
    getConnectedUserId, getConnectedUser
}

export default storageService