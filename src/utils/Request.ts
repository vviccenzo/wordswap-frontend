import axios from 'axios';

import { HttpMethods, IRequest } from './IRequest';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const doRequest = async ({ method, url, params = {}, data = {}, headers = {}, successCallback, errorCallback, token }: IRequest): Promise<void> => {

    try {
        if (method === HttpMethods.GET && Object.keys(data).length !== 0) {
            throw new Error('GET requests cannot have a request body');
        }

        const mergedHeaders = {
            ...api.defaults.headers,
            ...headers,
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        };

        const response: any = await api({
            method,
            url,
            params,
            data,
            headers: mergedHeaders,
        });

        if (successCallback) {
            successCallback(response.data);
        }
    } catch (error) {
        if (errorCallback) {
            if (error?.code === "ERR_BAD_REQUEST") {
                localStorage.clear();
                const errorMessage = error.response ? error.response.data : error.message;
                if(!errorMessage) {
                    errorCallback("Ocorreu um erro, tente novamente!");
                    setTimeout(() => {
                        window.location.reload();
                    }, 5000);
                } else {
                    errorCallback(errorMessage);
                }
            } else {
                const errorMessage = error.response ? error.response.data : error.message;
                if(!errorMessage) {
                    errorCallback("Ocorreu um erro, tente novamente!");
                } else {
                    errorCallback(errorMessage);
                }
            }
        } else {
            throw error.response ? error.response.data : error.message;
        }
    }
};

export default doRequest;
