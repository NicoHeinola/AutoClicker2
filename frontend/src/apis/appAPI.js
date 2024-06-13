import axiosInstance from "./axiosInstance";

const BASE_ROUTE = "/app"

const minimizeApp = () => {
    return axiosInstance.post(`${BASE_ROUTE}/minimize`).then(response => {
        return response;
    }).catch(e => {
        throw e;
    })
}

const functions = {
    minimizeApp
};

export default functions;
