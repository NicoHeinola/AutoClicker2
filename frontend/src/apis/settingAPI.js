import axiosInstance from "./axiosInstance";

const BASE_ROUTE = "/settings"

const updateSettings = (settingsToUpdate) => {
    return axiosInstance.put(`${BASE_ROUTE}`, settingsToUpdate).then(response => {
        return response;
    }).catch(e => {
        throw e;
    })
}

const getAllSettings = () => {
    return axiosInstance.get(`${BASE_ROUTE}`).then(response => {
        return response;
    }).catch(e => {
        throw e;
    })
}

const functions = {
    updateSettings,
    getAllSettings
};

export default functions;
