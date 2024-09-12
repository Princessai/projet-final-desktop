import React, { useState, createContext, useContext, useRef, useEffect } from 'react';
import axios from "axios";


export const AxiosContext = createContext({
    axios: {
    },
    setAxiosToken: (token) => { },
    isInterceptorSetted: false
});


export function useAxios() {
    return useContext(AxiosContext);
}

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/trackin/',
    headers: {
        'Content-Type': 'application/json'
    },

});

axiosInstance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
});
function setAxiosToken(token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

}



export function AxiosContextProvider({ children }) {



    return (
        <AxiosContext.Provider value={{
            "axios": axiosInstance,
            setAxiosToken,
            isInterceptorSetted: useRef(false),
        }} >

            {children}
        </AxiosContext.Provider>
    )
}


