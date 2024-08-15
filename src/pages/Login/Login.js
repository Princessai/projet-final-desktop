import React from 'react';
import '/src/pages/Login/Login.css';
import logo from '/src/assets/logo_app@2x.png';
import { Link } from 'react-router-dom';

function Login() {
    return (
        <div className="form-container d-flex justify-content-center align-items-center">
            <div id="login-form" className="form">
                <div className="logo-app d-flex justify-content-center mb-5">
                    <img src={logo} className="w-50 img-fluid" alt="logo trackIn ifran" />
                </div>

                <div id="errorMessage" className=" w-100 text-danger text-center fw-bold">
                </div>

                <form className=" d-flex flex-column">
                    <div className="mb-3">
                        <label for="exampleInputEmail1" className="form-label">Email</label>
                        <input type="text" placeholder="email..." className="form-control" id="exampleInputEmail1"
                            aria-describedby="emailHelp" required />
                    </div>
                    <div className=" d-flex flex-column mb-3">
                        <label for="exampleInputPassword1" className="form-label">Password</label>
                        <input type="password" className="form-control" placeholder="password..." id="exampleInputPassword1" required />
                    </div>
                    <a href="#" id="registerUrl" className='mb-3 ms-auto'>Forgotten password ?</a>
                        <Link to={'/student/home'} >
                            <button type="submit" className="btn w-100">LOGIN</button>
                        </Link>

                </form>
            </div>

        </div>
    )
}

export default Login