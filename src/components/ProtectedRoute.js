
import React, { useState, createContext, useContext, useRef, useEffect } from 'react';
import { redirect, useNavigate } from "react-router-dom";
import { useAuth } from '../Providers/AuthProvider.js';
import { routeRegister } from '../../route.js';
import { useAxios } from '../Providers/AxiosProvider.js';

export function ProtectedRoute({ roles = null, middleware = null, children }) {

    console.log('protected rerenderr');
    const { login, setUser, user, isUserAuthenticated: isUserAuthenticated, reconnect } = useAuth();

    const navigate = useNavigate();

    const { axios, isInterceptorSetted } = useAxios();


    if (isInterceptorSetted.current == false) {
        console.log('interceptor_called')

        axios.interceptors.response.use(function (response) {
            return response;
        }, function (error) {
            console.log("unauthenticated__interceptor")
            console.log('autenticated error', error)

            console.log('error dataaa',error.response.data);
            if (error.response.data !== undefined) {
                
                console.log('error dataaa messaaaageee',error.response.data.message );

                if (error.response.data.message == 'Unauthenticated.') {
                    console.log('error dataaa messaaaageee_ifffff',error.response.data.message );
                    navigate(routeRegister.getRoute('index'));
                    // return ;
                }
            }

            return Promise.reject(error);
        });
        isInterceptorSetted.current = true;

    }






    if (isUserAuthenticated == false) {
        const token = localStorage.getItem('token');
        if (token == null) {
            navigate(routeRegister.getRoute('login'));
            console.log("redirecttt")
        } else {
            console.log("tokenn protected", token);

            reconnect(token, navigate);
        }
    }





    if (isUserAuthenticated) {
        if (roles !== null) {
            const roleLabel = user.role.label
            if (Array.isArray(roles)) {
                if (roles.includes(roleLabel)) return;

            } else {
                if (roles === roleLabel) return;
            }

            navigate(routeRegister.getRoute('login'));
        }
    }



    return (<>{children}</>)
}

