import axiosService from "./axiosService"


const getAllCities = async () => {
    const resp = await axiosService.postReq('https://countriesnow.space/api/v0.1/countries/cities', {
        "country": "israel"
    })
    return resp.data.data
}








const citiesService = { getAllCities }
export default citiesService