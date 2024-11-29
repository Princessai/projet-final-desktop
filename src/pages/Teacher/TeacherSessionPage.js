import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import SidebarTeacher from '../../components/SidebarTeacher';
import Footer from '../../components/Footer';
import '/src/pages/Presence/presence.css';
import { Link } from 'react-router-dom';
import { useAxios } from '../../Providers/AxiosProvider';
import { useAuth } from '../../Providers/AuthProvider';
import { FallbackContent } from '../../components/FallbackContent';
import dayjs from 'dayjs';





function Teachersession() {

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

                console.log('fetch user session',userSessions);

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
                < SidebarTeacher />
                <section className='content-container'>
                    <div className="row">
                        <div className="col-md-12 mt-3 ms-5">
                            <h1 className='py-3'>Session</h1>
                        </div>
                        <div className="col-md-12  pe-5 d-flex justify-content-end">
                            <button type="button" onClick={setSessionsType('comming')} className="btn btn-light me-3 shadow  rounded"> <strong>current session</strong> </button>
                            <button type="button" onClick={setSessionsType('passed')} className="btn btn-light me-3 shadow  rounded">  <strong>past session</strong> </button>
                        </div>
                        <div className="col-md-12 ">
                            {
                                sessions.map(function (session, index) {
                                    let sessionStart = dayjs(session.heure_debut);
                                    let sessionEnd = dayjs(session.heure_fin);
                                    let sessionDate = dayjs(session.date).format('YYYY-MM-DD');
                                    let now = dayjs();
                                    let callTimeout = now.subtract(2, 'week');

                                    let sessionDayNAme = dayjs(session.date).format('dddd');

                                    // console.log('sessionDate', sessionDate);

                                    // console.log('is afterr',sessionStart.isAfter(now));
                                    // console.log('tesstt ohh',sessionStart.format('HH:mm'));

                                    if (!sessionStart.isAfter(now) && !sessionEnd.isBefore(now)) {

                                        return <div key={index} className='bloc-presence shadow d-flex justify-content-between align-items-center m-auto text-center mt-5 mb-4'>
                                            {/* <div></div> */}
                                            <h5 className= 'fs-6'>{sessionDayNAme} {sessionDate} {sessionStart.format('HH:mm')}-{sessionEnd.format('HH:mm')} {session.module.label} {session.classe.label} </h5>
                                            <Link to={`/teacher/session/call/${session.id}`}>
                                                <button type="button" className="btn btn-success">Start session</button>
                                            </Link>
                                        </div>
                                    }

                                    if (sessionEnd.isBefore(callTimeout)) {

                                        return <div key={index} className='bloc-inactif shadow d-flex justify-content-center align-items-center m-auto text-center mt-5 mb-4' >

                                            <h5 className= 'fs-6'>{sessionDayNAme} {sessionDate} {sessionStart.format('HH:mm')}-{sessionEnd.format('HH:mm')} {session.module.label} {session.classe.label} </h5>
                                            <span className='text-danger fst-italic'>Passed !</span>

                                        </div>
                                    }

                                    if (sessionEnd.isBefore(now)) {

                                        return <div key={index} className='bloc-presence shadow d-flex justify-content-between align-items-center m-auto text-center mt-5 mb-4'>
                                            {/* <div></div> */}
                                            <h5 className= 'fs-6'>{sessionDayNAme} {sessionDate} {sessionStart.format('HH:mm')}-{sessionEnd.format('HH:mm')} {session.module.label} {session.classe.label} </h5>
                                            <Link to={`/teacher/session/call/${session.id}`}>
                                                <button type="button" className="btn btn-success">Edit session</button>
                                            </Link>
                                        </div>
                                    }
                                    return <div key={index} className='bloc-inactif shadow d-flex justify-content-center align-items-center m-auto text-center mt-5 mb-4' >

                                    <h5 className= 'fs-6'>{sessionDayNAme} {sessionDate} {sessionStart.format('HH:mm')}-{sessionEnd.format('HH:mm')} {session.module.label} {session.classe.label} </h5>

                                </div>


                                })
                            }
                            {/* <div className='bloc-presence shadow d-flex justify-content-between align-items-center m-auto text-center mt-5 mb-4' >
                                <div></div>
                                <h5>MARDI 9h-12h</h5>
                                <Link to={'/teacher/session/call'}>
                                    <button type="button" className="btn btn-success">Start session</button>
                                </Link>
                            </div>

                            <div className='bloc-inactif shadow d-flex justify-content-center align-items-center m-auto text-center mt-5 mb-4' >

                                <h5 className="me-5">MARDI 9h-12h</h5>

                            </div>
 */}
                        </div>
                    </div>

                </section>
            </div>

            <Footer />
        </div>

    )
}

export default Teachersession