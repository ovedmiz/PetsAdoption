import axiosService from "./axiosService"

const requestURL = 'http://localhost:8080/pa/api/request'


const getRequestsByUser = async (id) => {
    const resp = await axiosService.getAllReq(`${requestURL}/user/${id}`)
    return resp.data
}

const getRequestsByAnimal = async (id) => {
    const resp = await axiosService.getAllReq(`${requestURL}/animal/${id}`)
    return resp
}

const addRequest = async (userId, petId) => {
    const resp = await axiosService.postReq(`${requestURL}/${userId}/${petId}`)
    return resp
}


const setRequestStatus = async (requestId, status) => {
    const resp = await axiosService.putReqOnlyURL(`${requestURL}/status/${requestId}?newStatus=${status}`)
    return resp.data
}


const deleteRequest = async (requestId) => {
    const resp = await axiosService.deleteReq(`${requestURL}`, requestId)
    return resp
}

const requestsService = {
    getRequestsByUser, getRequestsByAnimal, addRequest, setRequestStatus, deleteRequest
}
export default requestsService