import * as React from 'react';
import { createRoot } from 'react-dom/client';
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.js';
import './index.css';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import Login from './pages/Login/Login.js';
import Home from './pages/Home/Home.js';
import TimetablePage from './pages/Timetable/TimetablePage.js';


const router = createHashRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/student/home",
    element: <Home />,
  },
  {
    path: "/student/timetable",
    element: <TimetablePage />,
  },
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

console.log('React application is about to render');

root.render(
  <React.StrictMode>

    <RouterProvider router={router} />
  </React.StrictMode>
);


