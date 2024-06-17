import axiosInstance from "./axiosInstance";

const BASE_ROUTE = "/update"

const checkForUpdates = () => {
    return axiosInstance.get(`${BASE_ROUTE}/check`).then(response => {
        return response;
    }).catch(e => {
        throw e;
    })
}

const installLatestUpdate = () => {
    return axiosInstance.post(`${BASE_ROUTE}/install-latest`).then(response => {
        return response;
    }).catch(e => {
        throw e;
    })
}

const functions = {
    checkForUpdates,
    installLatestUpdate
};

export default functions;
