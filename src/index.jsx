


import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';


import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.js';
import './index.css';


import { AuthContextProvider } from './Providers/AuthProvider.js';
import { AxiosContextProvider } from './Providers/AxiosProvider.js';
import { routeRegister } from '../route.js';
import { ProtectedRoute } from './components/ProtectedRoute.js';


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
import AddTimetable from './pages/Coordinator/AddTimetable.js';
import Classes from './pages/Coordinator/Classes.js';
import ClasseInfos from './pages/Coordinator/ClasseInfos.js';
import Modules from './pages/Coordinator/Modules.js';
import ChildProfilePage from './pages/Parent/ChildProfilePage.js';




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
    element: <ProtectedRoute><TimetablePage /></ProtectedRoute>,
  },
  {
    path: "/student/profil/presence",
    element: <ProtectedRoute><ProfilPresencePage /></ProtectedRoute>,
  },
  {
    path: "/student/profil",
    element:<ProtectedRoute><ProfilPage /></ProtectedRoute> ,
  },
  {
    path: "/child/profil",
    element:<ProtectedRoute><ChildProfilePage /></ProtectedRoute> ,
  },
  {
    path: "/student/missing",
    element: <ProtectedRoute>< MissingPage /></ProtectedRoute>,
  },
  {
    path: "/student/presence",
    element:<ProtectedRoute>< PresenceHome /></ProtectedRoute> ,
  },
  {
    path: "/student/presence/details",
    element:<ProtectedRoute>< Presencedetails /></ProtectedRoute> ,
  },
  {
    path: "/parent/home", // home parent
    element: <ProtectedRoute>< Parentchoice /></ProtectedRoute>,
  },
  {
    path: "/teacher/home",
    element: <ProtectedRoute>< Teachersession /></ProtectedRoute>, //home teacher
  },

  {
    path: routeRegister.getRoute("teacherSessionCall") + "/:seance_id",
    element: <ProtectedRoute>< Teachersessioncall /></ProtectedRoute>,
  },
  {
    path: "coordinator/graphic",
    element: <ProtectedRoute>< CoordinatorGraphic /></ProtectedRoute>
  },
  {
    path: "coordinator/graphic/class",
    element: <ProtectedRoute>< CoordinatorGraphicClass /></ProtectedRoute>,
  },
  {
    path: "coordinator/graphic/class/details",
    element: <ProtectedRoute>< CoordinatorGraphicClassDetails /></ProtectedRoute>,
  },

  {
    path: "/coordinator/home",
    element: <ProtectedRoute>< CoordinatorTimetable /></ProtectedRoute>, // home coordinator
  },
  {
    path: routeRegister.getRoute("coordinatorTimetableClass") + "/:classe_id/:classe_label",
    element: <ProtectedRoute>< CoordinatorTimetableClass /></ProtectedRoute>,
  },
  {
    path: routeRegister.getRoute('coordinatoradd-timetable') + "/:classe_label",
    element: <ProtectedRoute><AddTimetable /></ProtectedRoute>,
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
    element: <ProtectedRoute>< CoordinatorUser /></ProtectedRoute>,
  },
  {
    path: routeRegister.getRoute("coordinatorUserClass") + "/:classe_id/:classe_label",
    element: <ProtectedRoute>< CoordinatorUserClass /></ProtectedRoute>,
  },
  {
    path: routeRegister.getRoute("coordinatoruserClassprofil") + "/:student_id",
    element: <ProtectedRoute>< CoordinatorUserClassProfil /></ProtectedRoute>,
  },
  {
    path: "/coordinator/userClass/profil/presence",
    element: < CoordinatorUserClassProfilPresence />,
  },
  {
    path: "/coordinator/call",
    element: <ProtectedRoute>< CoordinatorCall /></ProtectedRoute>,
  },
  {
    path: routeRegister.getRoute("coordinatorCallSession") + "/:mode/:seance_id/:seance_classe/:heure_debut/:heure_fin",
    element: <ProtectedRoute>< CoordinatorCallSession /></ProtectedRoute>,
  },
  {
    path: routeRegister.getRoute("coordinatorClasses"),
    element: <ProtectedRoute>< Classes /></ProtectedRoute>,
  },
  {
    path: routeRegister.getRoute("coordinatorClassesInfos") + "/:classe_id/:classe_label",
    element: <ProtectedRoute><ClasseInfos /></ProtectedRoute>,
  },
  {
    path: routeRegister.getRoute("coordinatorClassesModules") + "/:classe_id/:classe_label",
    element: <ProtectedRoute><Modules /></ProtectedRoute>,
  },


]);


const root = createRoot(document.getElementById('root'));

console.log('React application is about to render');

root.render(
  // <React.StrictMode>
  <AxiosContextProvider>
    <AuthContextProvider>
     
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <RouterProvider router={router} />

    
      </LocalizationProvider>
    </AuthContextProvider>
  </AxiosContextProvider>
  // </React.StrictMode>


);


