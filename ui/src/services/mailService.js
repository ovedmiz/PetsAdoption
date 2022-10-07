import axiosService from "./axiosService";

const mailURL = 'http://localhost:8080/pa/api/contactUs'

const sendMail = async (obj) => {
    const resp = await axiosService.postReq(`${mailURL}`, obj)
    console.log("resp:", resp);
    return resp.data
}

export { sendMail }