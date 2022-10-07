import axiosService from "./axiosService";
const userURL = 'http://localhost:8080/pa/api/user'
const animalURL = 'http://localhost:8080/pa/api/animal'


const getUserById = async (id) => {
    const resp = await axiosService.getAllReq(`${userURL}/id/${id}`)
    return resp.data
}

const getUserPets = async (id) => {
    const resp = await axiosService.getAllReq(`${animalURL}/owner/${id}`)
    return resp.data
}

const updateUser = async (id, obj) => {
    const resp = await axiosService.putReq(`${userURL}`, id, obj)
    return resp.data
}

const usersService = { getUserById, getUserPets, updateUser }
export default usersService
