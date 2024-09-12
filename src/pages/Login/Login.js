import React, { useState, createContext, useContext, useRef, useEffect } from 'react';
import '/src/pages/Login/Login.css';
import logo from '/src/assets/logo_app@2x.png';
import { Link, redirect, useNavigate } from 'react-router-dom';

import { AxiosContext } from '../../Providers/AxiosProvider.js';
import { useAuth } from '../../Providers/AuthProvider.js';
import { useForm, } from "react-hook-form";
import { ErrorSpan } from "../../components/ErrorSpan.js";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";



const schema = yup
    .object()
    .shape({
        email: yup.string().email().required(),
        password: yup.string().min(8).required(),
    })
    .required();


function Login() {
    console.log('loginn  rerenderr');
    console.log(localStorage.getItem('token'));

    const { register, handleSubmit, formState, setValue, setError, clearErrors } = useForm({
        resolver: yupResolver(schema),

    });

    const { errors, isDirty } = formState;
    const { login, setUser, user, RoleBasedRedirection: RoleBasedRedirection } = useAuth();
    const navigate = useNavigate();
    // const { Student: Student, Parent: Parent, Teacher: Teacher,Coordinator:Coordinator,Admin:Admin } = roleEnum;


    function onSubmit(data) {

        const { email, password } = data;
        login(email, password).then(function (response) {
            const roleLabel = response.data.user.role.label;
            const redirectionPath = RoleBasedRedirection[roleLabel];
            console.log('login_redirect_path', redirectionPath)
            navigate(redirectionPath);




        })

            .catch(function (error) {

                const response = error.response;
                const data = response.data;
                const errors = data.errors;

                const errorsKeys = Object.keys(errors);
                if (errorsKeys.length > 0) {
                    errorsKeys.forEach(function (key) {
                        setError(key, { message: errors[key] });
                    });

                }

            });
    }



    return (
        <div className="form-container d-flex justify-content-center align-items-center">
            <div id="login-form" className="form">
                <ErrorSpan errors={errors} inputName="message" />
                <div className="logo-app d-flex justify-content-center mb-5">
                    <img src={logo} className="w-50 img-fluid" alt="logo trackIn ifran" />
                </div>

                <div id="errorMessage" className=" w-100 text-danger text-center fw-bold">
                </div>

                <form className=" d-flex flex-column" onSubmit={handleSubmit(onSubmit)}>
                    <div className="d-flex flex-column mb-3">
                        <ErrorSpan errors={errors} inputName="email" />
                        <label htmlFor="exampleInputEmail1" className="form-label">Email</label>
                        <input type="text" placeholder="email..." className="form-control" id="exampleInputEmail1"
                            aria-describedby="emailHelp"     {...register("email")
                            } />
                    </div>
                    <div className=" d-flex flex-column mb-3">
                        <ErrorSpan errors={errors} inputName="password" />
                        <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                        <input type="password" className="form-control" placeholder="password..." id="exampleInputPassword1" {...register("password")} />
                    </div>
                    <a href="#" id="registerUrl" className='mb-3 ms-auto'>Forgotten password ?</a>
                    {/* <Link to={'/coordinator/timetable/class'} > */}
                    <button type="submit" className="btn w-100">LOGIN</button>
                    {/* </Link> */}

                </form>
            </div>

        </div>
    )
}

export default Login