import axiosService from "./axiosService";

const animalURL = 'http://localhost:8080/pa/api/animal'

const getRandomAnimals = async () => {
    const resp = await axiosService.getAllReq(`${animalURL}/random`)
    return resp.data
}


const getAllPetsOfCategory = async (id, pageNumber) => {
    const resp = await axiosService.getAllReq(`${animalURL}/category/${id}?pageNumber=${pageNumber}`
    )
    console.log(resp);
    return resp.data
}

const getCategoryNameByCategoryId = async (id) => {
    const cagtegories = await getAllCategories()
    let cat = cagtegories.find(cat => cat.id == id)
    return cat.categoryName
}

const getAllCategories = async () => {
    const resp = await axiosService.getAllReq(`${animalURL}/allCategories`)
    return resp.data
}

const addNewPet = async (userId, categoryId, obj) => {
    const resp = await axiosService.postReq(`${animalURL}/${userId}/${categoryId}`, obj)
    return resp.data
}

const addNewImage = async (animalId, formData, opt) => {
    const resp = await axiosService.putReq(`${animalURL}/addImage`, animalId, formData, opt)
    return resp.data
}


const getPetById = async (id) => {
    const resp = await axiosService.getAllReq(`${animalURL}/id/${id}`)
    return resp.data
}

const editPet = async (id, obj) => {
    const resp = await axiosService.putReq(`${animalURL}`, id, obj)
    return resp.data
}

const filterPets = async (categoryId, search) => {
    const resp = await axiosService.getAllReq(`${animalURL}/filter/${categoryId}?search=${search}`)
    return resp.data
}

const deletePet = async (animalId) => {
    const resp = await axiosService.deleteReq(`${animalURL}`, animalId)
    return resp
}

const petsService = { getRandomAnimals, getAllPetsOfCategory, getAllCategories, addNewPet, getPetById, addNewImage, editPet, getCategoryNameByCategoryId, filterPets, deletePet }
export default petsService