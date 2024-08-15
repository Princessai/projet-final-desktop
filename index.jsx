import * as React from 'react';
import { createRoot } from 'react-dom/client';
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.js';
import '/src/index.css'
import {RouterProvider, createHashRouter} from 'react-router-dom';
import Login from './src/pages/Login/Login';
import Home from './src/pages/Home/Home';


const router = createHashRouter([
    {
      path: "/",
      element: <Login /> ,
    },
    {
      path: "/student/home",
      element: <Home />,
    },
    // {
    //   path: "",
    //   element: ,
    // },
    // {
    //   path: "",
    //   element: ,
    // },
    // {
    //   path: "",
    //   element: ,
    // },
]);


const root = createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
        </React.StrictMode>

);