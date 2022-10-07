import axios from 'axios';
import tokenService from './storageService'


axios.interceptors.request.use(req => {
    let tokenData = tokenService.getToken();
    if (tokenData && req.url !== 'https://dog.ceo/api/breeds/list') {
        req.headers = {
            'Authorization': `Bearer ${tokenData}`
        };
    }
    return req;
})




const getAllReq = (url, opt) => {
    return axios.get(url, opt);
}

const getByIdReq = (url, id) => {
    return axios.get(`${url}/${id}`);
}

const postReq = (url, obj, opt = null) => {
    return axios.post(url, obj, opt);
}

const putReq = (url, id, obj) => {
    return axios.put(`${url}/${id}`, obj);
}

const putReqURLnOBJ = (url, obj, opt = null) => {
    return axios.put(`${url}`, obj, opt);
}
const putReqOnlyURL = (url) => {
    return axios.put(`${url}`);
}

const deleteReq = (url, id) => {
    return axios.delete(`${url}/${id}`);
}

const axiosService = { getAllReq, getByIdReq, postReq, putReq, deleteReq, putReqOnlyURL, putReqURLnOBJ }
export default axiosService