import * as React from 'react';
import { createRoot } from 'react-dom/client';
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.js';
import './index.css';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import Login from './pages/Login/Login.js';
import Home from './pages/Home/Home.js';
import ProfilPage from './pages/Profil/ProfilPage.js';
import ProfilPresencePage from './pages/Profil/ProfilPresence.js';
import TimetablePage from './pages/Timetable/TimetablePage.js';
import MissingPage from './pages/Missing/MissingPage.js';
import PresenceHome from './pages/Presence/PresenceHome.js'
import Presencedetails from './pages/Presence/Presencedetails.js'
import Parentchoice from './pages/Parent/ParentChoicePage..js'
import Teachersession from './pages/Teacher/TeacherSessionPage.js'
import Teachersessioncall from './pages/Teacher/TeacherSessionCall.js'
import CoordinatorTimetable from './pages/Coordinator/Timetable.js'
import CoordinatorGraphic from './pages/Coordinator/Graphic.js'
import CoordinatorUser from './pages/Coordinator/User.js'
import CoordinatorUserClass from './pages/Coordinator/UserClass.js'
import CoordinatorUserClassProfil from './pages/Coordinator/UserClassProfil.js'
import CoordinatorUserClassProfilPresence from './pages/Coordinator/UserClassProfilPresence.js'
import CoordinatorTimetableClass from './pages/Coordinator/TimetableClass.js'
import CoordinatorTimetableClassPastTimetable from './pages/Coordinator/PastTimetable.js'
import CoordinatorTimetableClassUpcomingTimetable from './pages/Coordinator/UpcomingTimetable.js'
import CoordinatorGraphicClass from './pages/Coordinator/GraphicClass.js'
import CoordinatorGraphicClassDetails from './pages/Coordinator/GraphicClassDetails.js'
import CoordinatorCall from './pages/Coordinator/Call.js'
import CoordinatorCallSession from './pages/Coordinator/CallSession.js'
import AddTimetable from './pages/Coordinator/addTimetable.js';
import { AuthContextProvider } from './Providers/AuthProvider.js';
import { AxiosContextProvider } from './Providers/AxiosProvider.js';
import { routeRegister } from '../route.js';
import { ProtectedRoute } from './components/ProtectedRoute.js';



const router = createHashRouter([
  {
    path: routeRegister.getRoute('index'),
    element: <Login />,
  },
  {
    path: "/student/home", // home student
    element: <Home />,
  },
  {
    path: "/student/timetable",
    element: <TimetablePage />,
  },
  {
    path: "/student/profil/presence",
    element: <ProfilPresencePage />,
  },
  {
    path: "/student/profil",
    element: <ProfilPage />,
  },
  {
    path: "/student/missing",
    element: < MissingPage />,
  },
  {
    path: "/student/presence",
    element: < PresenceHome />,
  },
  {
    path: "/student/presence/details",
    element: < Presencedetails />,
  },
  {
    path: "/parent/home", // home parent
    element: < Parentchoice />,
  },
  {
    path: "/teacher/home",
    element: < Teachersession />, //home teacher
  },

  {
    path: "/teacher/session/call",
    element: < Teachersessioncall />,
  },
  {
    path: "coordinator/graphic",
    element: < CoordinatorGraphic />,
  },
  {
    path: "coordinator/graphic/class",
    element: < CoordinatorGraphicClass />,
  },
  {
    path: "coordinator/graphic/class/details",
    element: < CoordinatorGraphicClassDetails />,
  },

  {
    path: "/coordinator/home",
    element: <ProtectedRoute>< CoordinatorTimetable /></ProtectedRoute>, // home coordinator
  },
  {
    path: routeRegister.getRoute("coordinatorTimetableClass") + "/:classe_id",
    element: <ProtectedRoute>< CoordinatorTimetableClass /></ProtectedRoute>,
  },
  {
    path: "/coordinator/add-timetable",
    element: <AddTimetable />,
  },
  {
    path: "/coordinator/timetable/class/pastimetable",
    element: < CoordinatorTimetableClassPastTimetable />,
  },
  {
    path: "/coordinator/timetable/class/Upcomingimetable",
    element: < CoordinatorTimetableClassUpcomingTimetable />,
  },
  {
    path: "/coordinator/user",
    element: < CoordinatorUser />,
  },
  {
    path: "/coordinator/userClass",
    element: < CoordinatorUserClass />,
  },
  {
    path: "/coordinator/userClass/profil",
    element: < CoordinatorUserClassProfil />,
  },
  {
    path: "/coordinator/userClass/profil/presence",
    element: < CoordinatorUserClassProfilPresence />,
  },
  {
    path: "/coordinator/call",
    element: < CoordinatorCall />,
  },
  {
    path: "/coordinator/call/session",
    element: < CoordinatorCallSession />,
  },


]);


const root = createRoot(document.getElementById('root'));

console.log('React application is about to render');

root.render(
  <AxiosContextProvider>
    <AuthContextProvider>
      {/* <React.StrictMode> */}
      <RouterProvider router={router} />

      {/* </React.StrictMode> */}
    </AuthContextProvider>
  </AxiosContextProvider>

);


