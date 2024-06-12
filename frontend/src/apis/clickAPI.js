import axiosInstance from "./axiosInstance";

const BASE_ROUTE = "/click"

const startClicking = () => {
    return axiosInstance.put(`${BASE_ROUTE}/start`).then(response => {
        return response;
    }).catch(e => {
        throw e;
    })
}

const stopClicking = () => {
    return axiosInstance.put(`${BASE_ROUTE}/stop`).then(response => {
        return response;
    }).catch(e => {
        throw e;
    })
}

const functions = {
    startClicking,
    stopClicking
};

export default functions;
