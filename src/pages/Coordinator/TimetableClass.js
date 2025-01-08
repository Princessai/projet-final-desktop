import React, { useState, createContext, useContext, useRef, useEffect, Suspense } from 'react';
import Navbar from '../../components/Navbar';
import SidebarCoordinator from '../../components/SidebarCoordinator';
import Footer from '../../components/Footer';
import { useAxios } from '../../Providers/AxiosProvider.js';
import { Link, useParams } from 'react-router-dom';
import Timetable from '../../components/Timetable';
import { useAuth } from '../../Providers/AuthProvider';
import { FallbackContent } from '../../components/FallbackContent';
import { routeRegister } from '../../../route.js';

import dayjs from 'dayjs';
import { SaveAltOutlined } from '@mui/icons-material';

function TimetableClassPage() {

    const { classe_id, classe_label } = useParams();

    const [timetables, setTimetables] = useState([]);
    const [timetablesWithoutSeances, setTimetablesWithoutSeances] = useState([]);

    const [selectedView, setSelectedView] = useState('currentTimetable');

    const [loading, setLoading] = useState(true);  // État de chargement
    const { axios } = useAxios();

    const { currentYear, isUserAuthenticated } = useAuth();

    const annee_id = currentYear.id;


    const interval = 0;


    useEffect(function () {
        console.log('useffet', isUserAuthenticated)
        let controller;
        controller = new AbortController();

        if (isUserAuthenticated) {
            console.log('fetch timetable');

            Promise.all([
                axios.get(`/timetable/${classe_id}/${annee_id}/${interval}?withSeances=true`, {
                    signal: controller.signal
                }),
                axios.get(`/timetable/${classe_id}/${annee_id}/${interval}?withSeances=false`)
            ])

                .then(function ([timetablesRes, timetablesWithoutSeancesRes]) {

                    const timetables = timetablesRes.data;
                    const timetablesWithoutSeances = timetablesWithoutSeancesRes.data;

                    setTimetables((oldvalue) => [...timetables]);
                    setTimetablesWithoutSeances((oldvalue) => [...timetablesWithoutSeances]);
                    setLoading(false);
                    console.log(timetables);
                    console.log(timetablesWithoutSeances);

                })
                .catch(function (error) {
                    // handle error
                    console.error(error);
                });


        }
        return () => {
            controller.abort()
        }

    }, [isUserAuthenticated])




    if (loading) return <FallbackContent />;

    const passedTimetables = timetablesWithoutSeances.filter((timetable) => {
        let timetableStart = dayjs(timetable.date_debut);
        let today = dayjs().format('YYYY-MM-DD');
        return timetableStart.isBefore(today);
    })
    const upCommingTimetables = timetablesWithoutSeances.filter((timetable) => {
        let timetableStart = dayjs(timetable.date_debut);
        let today = dayjs().format('YYYY-MM-DD');
        return timetableStart.isAfter(today);
    })

    console.log("🚀 ~ passedTimetables ~ passedTimetables:", passedTimetables)
    console.log("🚀 ~ upCommingTimetables ~ upCommingTimetables:", upCommingTimetables)

    console.log('timetablesWithoutSeances', timetablesWithoutSeances);
    const currentTimetable = timetables[0];


    const weekStart = currentTimetable.date_debut;

    const weekEnd = currentTimetable.date_fin;

    const date_debut = dayjs(weekStart).format('DD MMMM YYYY');

    const date_fin = dayjs(weekEnd).format('DD MMMM YYYY');







    return (

        <div className='div-container d-flex flex-column'>
            <Navbar />
            <div className='body-content-container d-flex'>
                <SidebarCoordinator />
                <section className='content-container'>
                    <div className="">
                        <div className=" mb-4 mt-3 ps-5">
                            <h1 className='py-3'>{classe_label}</h1>
                        </div>
                        <div className="col-md-12 mb-5 d-flex justify-content-around">
                            <div className="col-md-8 d-flex justify-content-between">
                               

                                <div>
                                    <button type="button" className={`btn btn-danger m-2 ${selectedView == 'currentTimetable' && 'active' }`}
                                        onClick={() => {
                                            setSelectedView('currentTimetable')
                                        }}
                                    >Current Timetable</button>
                                </div >
                                <div >
                                    <button type="button" className={`btn btn-danger m-2 ${selectedView == 'pastTimetables' && 'active' }`}
                                        onClick={() => {
                                            setSelectedView('pastTimetables')
                                        }}
                                    >Past Timetable</button>
                                </div >

                                <div >
                                    <button type="button" className={`btn btn-danger m-2 ${selectedView == 'upCommingTimetables' && 'active' }`}
                                        onClick={() => {
                                            setSelectedView('upCommingTimetables')
                                        }}
                                    >Upcoming Timetable</button>
                                </div>

                            </div>
                            <div className="col-md-2 d-flex justify-content-center">
                                <Link to={`/coordinator/add-timetable/${classe_id}/${classe_label}`}>
                                    <button type="button" className="btn btn-success m-2">Add Timetable</button>
                                </Link>

                            </div>

                        </div>
                        <div className="col-md-12">

                            {selectedView == 'currentTimetable' && <div className='mx-5'>
                                <h5 className='text-center fw-bold text-decoration-underline mb-5'> Timetable from {date_debut} to {date_fin}</h5>
                                <div>
                                    <SaveAltOutlined />
                                </div>
                                <Timetable seances={currentTimetable.seances}
                                    breaks={currentTimetable.pauses} timetableStart={currentTimetable.date_debut} timetableEnd={currentTimetable.date_fin} />
                                <div>
                                    <p className='text-center text-danger fw-bold text-decoration-underline'>NB: VOTRE RENDU EST A FAIRE DANS LE DELAIS. VOUS PRESENTEREZ LE 14 MAI</p>
                                </div>

                            </div>}

                            {selectedView == 'pastTimetables' &&

                                passedTimetables.map((timetable) => {
                                    let start = dayjs(timetable.date_debut).format('dddd, MMMM D, YYYY');
                                    let end = dayjs(timetable.date_fin).format('dddd, MMMM D, YYYY');
                                    return <div className='bloc-presence shadow border-0 d-flex justify-content-center align-items-center ms-5  my-3' >
                                         <Link to={`/coordinator/specific-timetable/${timetable.id}/${classe_label}`}>
                                             <div className='text-center p-3'>
                                                <p className='fs-6 m-0'>Timetable from {start} to {end} </p>
                                            </div>
                                         </Link>
                                    </div>
                                })
                            }
                            {selectedView == 'upCommingTimetables' &&

                                upCommingTimetables.map((timetable) => {
                                    let start = dayjs(timetable.date_debut).format('dddd, MMMM D, YYYY');
                                    let end = dayjs(timetable.date_fin).format('dddd, MMMM D, YYYY');
                                    return <div className='bloc-presence shadow border-0 d-flex justify-content-center align-items-center ms-5  my-3' >
                                         <Link to={`/coordinator/specific-timetable/${timetable.id}/${classe_label}`}>
                                             <div className='text-center p-3'>
                                                <p className='fs-6 m-0'>Timetable from {start} to {end} </p>
                                            </div>
                                         </Link>
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

export default TimetableClassPage