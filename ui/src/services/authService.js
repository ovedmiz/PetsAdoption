import axiosService from "./axiosService"
const userURL = 'http://localhost:8080/pa/api/user'


const validateLogin = async (obj) => {
    const resp = await axiosService.postReq('http://localhost:8080/pa/authenticate', obj)
    return resp.data
}


const register = async (obj) => {
    const resp = await axiosService.postReq(`${userURL}`, obj)
    return resp.data
}

const changePassword = async (id, obj) => {
    const resp = await axiosService.putReq(`${userURL}/setPassword`, id, obj)
    return resp.data
}

const forgotPassword = async (obj) => {
    const resp = await axiosService.postReq(`${userURL}/forgotPassword`, obj)
    return resp
}

const resetPassword = async (obj) => {
    const resp = await axiosService.putReqURLnOBJ(`${userURL}/resetPassword`, obj)
    return resp


}


const logOut = () => {
    sessionStorage.clear()
}


const loginUtils = { validateLogin, register, logOut, changePassword, forgotPassword, resetPassword }

export default loginUtils