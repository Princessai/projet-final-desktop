import React, { useState, createContext, useContext, useRef, useEffect } from 'react';
import { useAxios } from './AxiosProvider.js';
import { useNavigate } from 'react-router-dom';
import { routeRegister } from '../../route.js';

import { roleEnum } from '../../enums/roleEnum.js';


const RoleBasedRedirection = {};

Object.keys(roleEnum).forEach(function (key) {
    const roleLabel = roleEnum[key];
    RoleBasedRedirection[roleLabel] = `/${roleLabel}/home`;
});


export const AuthContext = createContext({
    user: {
    },
    login: () => { },
    logout: () => { },
    currentYear: {},
    isUserAuthenticated: false,
    RoleBasedRedirection
});

export function useAuth() {
    return useContext(AuthContext)
}



export function AuthContextProvider({ children }) {

    const { axios, setAxiosToken } = useAxios();
    const [user, setUser] = useState({})
    const [currentYear, setCurrentYear] = useState({});
    const [isUserAuthenticated, setUserAuthenticated] = useState(false);

    console.log('auth context provider rerenderr');
    console.log(user);
    console.log(localStorage.getItem('token'));



    function initValues(year, userInfo, token) {
        setCurrentYear((oldyear) => year);
        setUser(a => userInfo);
        setAxiosToken(token);
        console.log('tokrn initVlues', token);

        localStorage.setItem("token", token);
        setUserAuthenticated(true)
    }

    function login(email, password) {

        return axios.post('/login', {
            email: email,
            password: password,
        })
            .then(function (response) {

                const token = response.data.token;
                console.log('tokrn login', token);
                const userInfo = response.data.user;
                const year = response.data.currentYear;
                initValues(year, userInfo, token)
                return response;

            });


    }
    function reconnect(token, navigate) {
        setAxiosToken(token);

        axios.get('/logged_user/infos')
            .then(function (response) {

                const userInfo = response.data.user;

                const year = response.data.currentYear;

                initValues(year, userInfo, token);

                const roleLabel = userInfo.role.label;

                const redirectedPath = RoleBasedRedirection[roleLabel];
                navigate(redirectedPath);
                return response;

            });
            
        
    }
    function logout() {

     return axios.get('/logout')
            .then(function (response) {

                localStorage.removeItem('token');
                setAxiosToken(null);

            });

    }


    const providerValues = {
        user,
        setUser,
        login,
        logout,
        reconnect,
        isUserAuthenticated,
        RoleBasedRedirection, currentYear
    };

    return (


        <AuthContext.Provider value={providerValues} >
            {children}
        </AuthContext.Provider>



    )
}


