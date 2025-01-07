import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SidebarCoordinator from '../../components/SidebarCoordinator';
// import '/src/pages/Presence/presence.css';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../Providers/AuthProvider';
import { useAxios } from '../../Providers/AxiosProvider';
import { FallbackContent } from '../../components/FallbackContent';
import dayjs from 'dayjs';
import { Box, Snackbar } from '@mui/material';
import { green } from '@mui/material/colors';


let sessionType = {
    comming: 'comming',
    passed: 'passed'
}
function Call() {

    const { user, isUserAuthenticated } = useAuth();
    const timeoutArr = useRef([]);

    let userId = user.id;

    let location = useLocation();
    console.log("🚀 ~ Call ~ location.state:", location.state)

    const [snackBar, setSnackBar] = useState({
        open: location.state ? true : false,
        vertical: 'top',
        horizontal: 'center',
    });

    const { vertical, horizontal, open } = snackBar

    const handleClose = () => {
        setSnackBar({ ...snackBar, open: false });
    };


    useEffect(() => {

        let timer = setTimeout(() => {
            handleClose();
            location.state = null;


        }, 5000);


        return (() => {
            clearTimeout(timer);
        })

    }, [])


    console.log('userrr', user);
    const floatingMinute = 10;
    const [userSessions, setUserSessions] = useState();
    const [type, setType] = useState(sessionType.comming);
    const [loading, setLoading] = useState(true);  // État de chargement




    timeoutArr.current.forEach(timer => {
        clearTimeout(timer);
    });

    timeoutArr.current = [];

    const { axios } = useAxios();

    function fetchUserSessions() {
        console.log('fetch sessions');

        axios.get(`/user/seances/${userId}`)
            .then(function (response) {
                const userSessions = response.data;
                setUserSessions((oldvalue) => userSessions);
                setLoading(false);

                console.log('fetch user session', userSessions);

            })
            .catch(function (error) {
                console.log(error);
            });

    }



    useEffect(() => {

        if (isUserAuthenticated) {

            fetchUserSessions();
        }

    }, [isUserAuthenticated]);



    console.log(userSessions);

    if (loading) return <FallbackContent />;

    let upCommingSessions = userSessions.comming;
    let passedSessions = userSessions.passed;

    console.log('database upComming', upCommingSessions)


    upCommingSessions.sort((a, b) => {
        // Convertir les dates en objets Day.js pour la comparaison
        return dayjs(a.heure_debut).unix() - dayjs(b.heure_debut).unix(); // Tri décroissant
    });



    let sessions = ((type == sessionType.comming) ? upCommingSessions : passedSessions);
    let noSessions;

    if (sessions.length == 0) {
        noSessions = "No sessions available.";
    }

    console.log('sesionssss.', sessions)

    function setSessionsType(type) {

        return function () {
            setType(type);
        }
    }
    console.log('upComming', upCommingSessions)
    // console.log('sortedupCommingSessions', sortedupCommingSessions)

    console.log(type);



    return (
        <div className='div-container d-flex flex-column'>
            <Navbar />
            <div className='body-content-container d-flex'>
                < SidebarCoordinator />
                <section className='content-container'>
                    <Box sx={{ width: 500 }}>
                        <Snackbar
                            sx={{
                                '& .MuiSnackbarContent-root': {
                                    backgroundColor: '#4caf50', // Set your background color
                                    color: '#000',          // Set text color
                                },
                            }}
                            anchorOrigin={{ vertical, horizontal }}
                            open={open}
                            // onClose={handleClose}
                            message={location.state}
                            key={vertical + horizontal}
                        />
                    </Box>

                    <div className="h-100 m-3 position-relative">
                        <div className="title-container col-md-12 mt-3 ms-5">
                            <h1 className='py-3'>Sessions</h1>
                        </div>
                        <div className="col-md-12 pe-5 d-flex justify-content-end">
                            <button type="button" onClick={setSessionsType(sessionType.comming)} className="btn btn-light me-3 shadow  rounded"> <strong>current session</strong> </button>
                            <button type="button" onClick={setSessionsType(sessionType.passed)} className="btn btn-light me-3 shadow  rounded">  <strong>past session</strong> </button>
                        </div>
                        <div className="d-flex justify-content-center align-items-center flex-column">
                            <p className='noSessions fw-bold text-black-50 fst-italic'>{noSessions}</p>

                            {

                                sessions.map(function (session, index) {
                                    let sessionStart = dayjs(session.heure_debut);
                                    let sessionEnd = dayjs(session.heure_fin);
                                    let sessionDate = dayjs(session.date).format('YYYY MM DD');
                                    let now = dayjs();
                                    let callTimeout = now.subtract(2, 'week');

                                    console.log('conditionnn', type == sessionType.comming, (sessionStart.isBefore(now) || sessionStart.isSame(now)),
                                        sessionEnd.add(floatingMinute, 'minutes').isAfter(now))

                                    let sessionDayNAme = dayjs(session.date).format('dddd');
                                    // console.log('sessionDate', sessionDate);
                                    if (type == sessionType.comming) {
                                        let timeout = sessionEnd.add(floatingMinute, 'minutes').diff(now);

                                        console.log("🚀 ~ timeout:", timeout)

                                        const timer = setTimeout(() => {

                                            setUserSessions((oldValue) => {
                                                const comming = oldValue.comming.filter(oldSession => oldSession.id != session.id)
                                                const oldPassed = oldValue.passed
                                                const passed = [session, ...oldPassed]
                                                return { comming, passed }
                                            })
                                        }, timeout);

                                        timeoutArr.current.push(timer);

                                    }


                                    if (type == sessionType.comming && (sessionStart.isBefore(now) || sessionStart.isSame(now)) && sessionEnd.add(floatingMinute, 'minutes').isAfter(now)) {

                                        return <div key={index} className='bloc-presence shadow d-flex justify-content-between align-items-center text-center'>
                                            {/* <div></div> */}

                                            <div className='fs-6 d-flex justify-content-around align-items-center fw-bold w-100'>
                                                <p className="m-0">{sessionDayNAme} {sessionDate}, {sessionStart.format('HH:mm')}-{sessionEnd.format('HH:mm')}</p>
                                                <p className="m-0">{session.type_seance.label} {session.module.label} </p>
                                                <p className="m-0">{session.classe.label}</p>
                                            </div>

                                            <Link to={`/coordinator/call/session/show/${session.id}/${session.classe.label}/${session.heure_debut}/${session.heure_fin}`}>
                                                <button type="button" className="btn btn-success">Start session</button>
                                            </Link>
                                        </div>
                                    }

                                    if (type == sessionType.passed && sessionEnd.isBefore(callTimeout)) {

                                        return <div key={index} className='bloc-inactif shadow d-flex justify-content-center align-items-center text-center' >

                                            <div className='fs-6 d-flex justify-content-around w-100 align-items-center'>
                                                <p className="m-0">{sessionDayNAme} {sessionDate}, {sessionStart.format('HH:mm')}-{sessionEnd.format('HH:mm')}</p>
                                                <p className="m-0">{session.type_seance.label} {session.module.label} </p>
                                                <p className="m-0">{session.classe.label}</p>
                                            </div>

                                            <div className='text-danger fw-bold fst-italic'>Passed!</div>

                                        </div>
                                    }

                                    if (type == sessionType.passed && sessionEnd.isBefore(now)) {

                                        return <div key={index} className='bloc-presence shadow d-flex justify-content-between align-items-center text-center'>

                                            <div className='fs-6 d-flex justify-content-around align-items-center fw-bold w-100'>
                                                <p className="m-0">{sessionDayNAme} {sessionDate}, {sessionStart.format('HH:mm')}-{sessionEnd.format('HH:mm')}</p>
                                                <p className="m-0">{session.type_seance.label} {session.module.label} </p>
                                                <p className="m-0">{session.classe.label}</p>
                                            </div>

                                            <Link to={`/coordinator/call/session/edit/${session.id}/${session.classe.label}/${session.heure_debut}/${session.heure_fin}`}>
                                                <button type="button" className="btn btn-success">Edit session</button>
                                            </Link>
                                        </div>
                                    }



                                    return <div key={index} className='bloc-inactif shadow d-flex justify-content-center align-items-center text-center' >

                                        <div className='fs-6 d-flex justify-content-around align-items-center w-100'>
                                            <p>{sessionDayNAme} {sessionDate}, {sessionStart.format('HH:mm')}-{sessionEnd.format('HH:mm')}</p>
                                            <p>{session.type_seance.label} {session.module.label} </p>
                                            <p>{session.classe.label}</p>
                                        </div>
                                        <div className='fst-italic fs-6 fw-bold'>Has not started yet.    </div>


                                    </div>


                                })
                            }
                        </div>
                    </div>



                </section>
            </div>

            <Footer />
        </div>

    )
}

export default Call