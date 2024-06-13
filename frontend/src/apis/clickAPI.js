import axiosInstance from "./axiosInstance";

const BASE_ROUTE = "/click"

const startClicking = () => {
    return axiosInstance.post(`${BASE_ROUTE}/start`).then(response => {
        return response;
    }).catch(e => {
        throw e;
    })
}

const stopClicking = () => {
    return axiosInstance.post(`${BASE_ROUTE}/stop`).then(response => {
        return response;
    }).catch(e => {
        throw e;
    })
}

const getPlayState = () => {
    return axiosInstance.get(`${BASE_ROUTE}/state`).then(response => {
        return response;
    }).catch(e => {
        throw e;
    })
}

const getMousePosition = () => {
    return axiosInstance.get(`${BASE_ROUTE}/mouse/position`).then(response => {
        return response;
    }).catch(e => {
        throw e;
    })
}

const functions = {
    startClicking,
    stopClicking,
    getPlayState,
    getMousePosition
};

export default functions;
