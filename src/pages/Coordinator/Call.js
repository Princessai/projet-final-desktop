import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SidebarCoordinator from '../../components/SidebarCoordinator';
// import '/src/pages/Presence/presence.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../../Providers/AuthProvider';
import { useAxios } from '../../Providers/AxiosProvider';
import { FallbackContent } from '../../components/FallbackContent';
import dayjs from 'dayjs';



function Call() {

    const { user, isUserAuthenticated } = useAuth();

    let userId = user.id

    console.log('userrr', user);

    const [userSessions, setUserSessions] = useState();
    const [type, setType] = useState('comming');
    const [loading, setLoading] = useState(true);  // État de chargement



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



    let sessions = ((type == 'comming') ? upCommingSessions : passedSessions);
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


    return (
        <div className='div-container d-flex flex-column'>
            <Navbar />
            <div className='body-content-container d-flex'>
                < SidebarCoordinator />
                <section className='content-container'>

                    <div className="h-100 m-3 position-relative">
                        <div className="title-container col-md-12 mt-3 ms-5">
                            <h1 className='py-3'>Sessions</h1>
                        </div>
                        <div className="col-md-12 pe-5 d-flex justify-content-end">
                            <button type="button" onClick={setSessionsType('comming')} className="btn btn-light me-3 shadow  rounded"> <strong>current session</strong> </button>
                            <button type="button" onClick={setSessionsType('passed')} className="btn btn-light me-3 shadow  rounded">  <strong>past session</strong> </button>
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

                                    let sessionDayNAme = dayjs(session.date).format('dddd');

                                    // console.log('sessionDate', sessionDate);

                                    // console.log('is afterr',sessionStart.isAfter(now));
                                    // console.log('tesstt ohh',sessionStart.format('HH:mm'));

                                    if (!sessionStart.isAfter(now) && !sessionEnd.isBefore(now)) {

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

                                    if (sessionEnd.isBefore(callTimeout)) {

                                        return <div key={index} className='bloc-inactif shadow d-flex justify-content-center align-items-center text-center' >

                                            <div className='fs-6 d-flex justify-content-around w-100 align-items-center'>
                                                <p className="m-0">{sessionDayNAme} {sessionDate}, {sessionStart.format('HH:mm')}-{sessionEnd.format('HH:mm')}</p>
                                                <p className="m-0">{session.type_seance.label} {session.module.label} </p>
                                                <p className="m-0">{session.classe.label}</p>
                                            </div>

                                            <div className='text-danger fw-bold fst-italic'>Passed!</div>

                                        </div>
                                    }

                                    if (sessionEnd.isBefore(now)) {

                                        return <div key={index} className='bloc-presence shadow d-flex justify-content-between align-items-center text-center'>
                                            {/* <div></div> */}
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
                                        <div className='fst-italic fs-6 fw-bold'>Has not started yet.</div>


                                    </div>


                                })
                            }
                        </div>
                    </div>


                    {/* <div class="row">
                        <div class="col-md-12 mt-3 ms-5">
                            <h1 class='py-3'>Session</h1>
                        </div>
                        <div class="col-md-12  pe-5 d-flex justify-content-end">
                            <button type="button" class="btn btn-light me-3 shadow   rounded"> <strong>current session</strong> </button>
                            <button type="button" class="btn btn-light me-3 shadow  rounded">  <strong>past session</strong> </button>
                        </div>
                        <div class="col-md-12 ">
                            <div className='bloc-presence shadow d-flex justify-content-between align-items-center m-auto text-center mt-5 mb-4' >
                                <div></div>
                                <div>MARDI 9h-12h</div
                                >
                
                                <Link to={'/coordinator/call/session'}>
                                    <button type="button" class="btn btn-success">Start session</button>
                                </Link>
                            </div>

                            <div className='bloc-inactif shadow d-flex justify-content-center align-items-center m-auto text-center mt-5 mb-4' >

                                <div class="me-5">MARD
                                I 9h-12h</div>

               
                                </div>

                            <div className='bloc-inactif shadow d-flex justify-content-center align-items-center m-auto text-center mt-5 mb-4' >

                                <div class="me-5">MARD
                                I 9h-12h</div>

               
                                </div>

                        </div>
                    </div> */}

                </section>
            </div>

            <Footer />
        </div>

    )
}

export default Call