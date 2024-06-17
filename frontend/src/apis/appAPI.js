import axiosInstance from "./axiosInstance";

const BASE_ROUTE = "/app"

const minimizeApp = () => {
    return axiosInstance.post(`${BASE_ROUTE}/minimize`).then(response => {
        return response;
    }).catch(e => {
        throw e;
    })
}

const quitApp = () => {
    return axiosInstance.post(`${BASE_ROUTE}/quit`).then(response => {
        return response;
    }).catch(e => {
        throw e;
    })
}


const functions = {
    minimizeApp,
    quitApp
};

export default functions;
