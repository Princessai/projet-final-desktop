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

function TimetableClassPage() {

    const { classe_id, classe_label } = useParams();

    const [timetables, setTimetables] = useState([]);

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
            axios.get(`/timetable/${classe_id}/${annee_id}/${interval}`, {
                signal: controller.signal
            })
                .then(function (response) {

                    const timetables = response.data;

                    setTimetables((oldvalue) => [...timetables]);
                    setLoading(false);
                    console.log(timetables);

                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                });


        }
        return () => {
            controller.abort()
        }

    }, [isUserAuthenticated])






    if (loading) return <FallbackContent />;
   
    
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
                                {/* <Link to={routeRegister.getRoute('coordinatorTimetableClassPastimetable')}>
                                    <button type="button" className="btn btn-danger">Current Timetable</button>
                                </Link> */}

                                <Link>
                                    <button type="button" className="btn btn-danger m-2 active">Current Timetable</button>
                                </Link >
                                <Link to={'/coordinator/timetable/class/pastimetable'}>
                                    <button type="button" className="btn btn-danger m-2">Past Timetable</button>
                                </Link >

                                <Link to={'/coordinator/timetable/class/Upcomingimetable'}>
                                    <button type="button" className="btn btn-danger m-2">Upcoming Timetable</button>
                                </Link>

                            </div>
                            <div className="col-md-2 d-flex justify-content-center">
                                <Link to={`/coordinator/add-timetable/${classe_id}/${classe_label}`}>
                                    <button type="button" className="btn btn-success m-2">Add Timetable</button>
                                </Link>

                            </div>

                        </div>
                        <div className="col-md-12">

                            <div className='mx-5'>
                                <h5 className='text-center fw-bold text-decoration-underline mb-5'> Timetable from {date_debut} to {date_fin}</h5>

                                <Timetable  seances={currentTimetable.seances}
                                    breaks={currentTimetable.pauses} timetableStart={currentTimetable.date_debut} timetableEnd={currentTimetable.date_fin} />


                            </div>

                            <div>
                                <p className='text-center text-danger fw-bold text-decoration-underline'>NB: VOTRE RENDU EST A FAIRE DANS LE DELAIS. VOUS PRESENTEREZ LE 14 MAI</p>
                            </div>



                            {/* <div className='mx-5'>
                                <h5 className='text-center fw-bold text-decoration-underline mb-3'>Emploi du temps B3 Développement Web du 13 mai 17 mai 24</h5>
                                <div className='d-flex'>
                                    <table className=''>
                                        <thead>
                                            <tr className='d-flex flex-column justify-content-between'>
                                                <th>Hours</th>
                                                <th>08:00</th>
                                                <th>09:00</th>
                                                <th>10:00</th>
                                                <th>11:00</th>
                                                <th>12:00</th>
                                                <th>13:00</th>
                                                <th>14:00</th>
                                                <th>15:00</th>
                                                <th>16:00</th>
                                                <th>17:00</th>
                                                <th>18:00</th>
                                            </tr>
                                        </thead>
                                    </table>

                                    <table className="myTimetable">
                                        <thead className='text-center'>
                                            <tr>
                                                <th>
                                                    Monday
                                                    <span>13/05</span>
                                                </th>
                                                <th>
                                                    Tuesday
                                                    <span>13/05</span>
                                                </th>
                                                <th>
                                                    Wednesday
                                                    <span>13/05</span>
                                                </th>
                                                <th>
                                                    Thursday
                                                    <span>13/05</span>
                                                </th>
                                                <th>
                                                    Friday
                                                    <span>13/05</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody >
                                            <tr>
                                                <td>
                                                    <div className="seanceType fw-bold">WORKSHOP</div>
                                                    <div className="subject">Javascript</div>
                                                    <div className="teacherName fst-italic"></div>
                                                    <div className="room fw-bold">Salle 4</div>
                                                </td>
                                                <td>
                                                    <div className="seanceType fw-bold">PRESENTIEL</div>
                                                    <div className="subject">Javascript</div>
                                                    <div className="teacherName fst-italic">M. Adoh</div>
                                                    <div className="room fw-bold">Salle 4</div>
                                                </td>
                                                <td>
                                                    <div className="seanceType fw-bold">WORKSHOP</div>
                                                    <div className="subject">Javascript</div>
                                                    <div className="teacherName fst-italic"></div>
                                                    <div className="room fw-bold">Salle 4</div>
                                                </td>
                                                <td>
                                                    <div className="seanceType fw-bold">E-LEARNING</div>
                                                    <div className="subject">Javascript</div>
                                                    <div className="teacherName fst-italic"></div>
                                                    <div className="room fw-bold">Salle 4</div>
                                                </td>
                                                <td>
                                                    <div className="seanceType fw-bold">WORKSHOP</div>
                                                    <div className="subject">Javascript</div>
                                                    <div className="teacherName fst-italic"></div>
                                                    <div className="room fw-bold">Salle 4</div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan="6" className="break">Break</td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className="seanceType fw-bold">WORKSHOP</div>
                                                    <div className="subject">Javascript</div>
                                                    <div className="teacherName fst-italic"></div>
                                                    <div className="room fw-bold">Salle 4</div>
                                                </td>
                                                <td>
                                                    <div className="seanceType fw-bold">PRESENTIEL</div>
                                                    <div className="subject">Javascript</div>
                                                    <div className="teacherName fst-italic">M. Adoh</div>
                                                    <div className="room fw-bold">Salle 4</div>
                                                </td>
                                                <td>
                                                    <div className="seanceType fw-bold">WORKSHOP</div>
                                                    <div className="subject">Javascript</div>
                                                    <div className="teacherName fst-italic"></div>
                                                    <div className="room fw-bold">Salle 4</div>
                                                </td>
                                                <td>
                                                    <div className="seanceType fw-bold">E-LEARNING</div>
                                                    <div className="subject">Javascript</div>
                                                    <div className="teacherName fst-italic"></div>
                                                    <div className="room fw-bold">Salle 4</div>
                                                </td>
                                                <td>
                                                    <div className="seanceType fw-bold">WORKSHOP</div>
                                                    <div className="subject">Javascript</div>
                                                    <div className="teacherName fst-italic"></div>
                                                    <div className="room fw-bold">Salle 4</div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan="6" className="lunch">Lunch</td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className="seanceType fw-bold">WORKSHOP</div>
                                                    <div className="subject">Javascript</div>
                                                    <div className="teacherName fst-italic"></div>
                                                    <div className="room fw-bold">Salle 4</div>
                                                </td>
                                                <td>
                                                    <div className="seanceType fw-bold">PRESENTIEL</div>
                                                    <div className="subject">Javascript</div>
                                                    <div className="teacherName fst-italic">M. Adoh</div>
                                                    <div className="room fw-bold">Salle 4</div>
                                                </td>
                                                <td>
                                                    <div className="seanceType fw-bold">WORKSHOP</div>
                                                    <div className="subject">Javascript</div>
                                                    <div className="teacherName fst-italic"></div>
                                                    <div className="room fw-bold">Salle 4</div>
                                                </td>
                                                <td>
                                                    <div className="seanceType fw-bold">E-LEARNING</div>
                                                    <div className="subject">Javascript</div>
                                                    <div className="teacherName fst-italic"></div>
                                                    <div className="room fw-bold">Salle 4</div>
                                                </td>
                                                <td>
                                                    <div className="seanceType fw-bold">WORKSHOP</div>
                                                    <div className="subject">Javascript</div>
                                                    <div className="teacherName fst-italic"></div>
                                                    <div className="room fw-bold">Salle 4</div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan="6" className="break">Break</td>
                                            </tr>

                                            <tr>
                                                <td>
                                                    <div className="seanceType fw-bold">WORKSHOP</div>
                                                    <div className="subject">Javascript</div>
                                                    <div className="teacherName fst-italic"></div>
                                                    <div className="room fw-bold">Salle 4</div>
                                                </td>
                                                <td>
                                                    <div className="seanceType fw-bold">PRESENTIEL</div>
                                                    <div className="subject">Javascript</div>
                                                    <div className="teacherName fst-italic">M. Adoh</div>
                                                    <div className="room fw-bold">Salle 4</div>
                                                </td>
                                                <td>
                                                    <div className="seanceType fw-bold">WORKSHOP</div>
                                                    <div className="subject">Javascript</div>
                                                    <div className="teacherName fst-italic"></div>
                                                    <div className="room fw-bold">Salle 4</div>
                                                </td>
                                                <td>
                                                    <div className="seanceType fw-bold">E-LEARNING</div>
                                                    <div className="subject">Javascript</div>
                                                    <div className="teacherName fst-italic"></div>
                                                    <div className="room fw-bold">Salle 4</div>
                                                </td>
                                                <td>
                                                    <div className="seanceType fw-bold">WORKSHOP</div>
                                                    <div className="subject">Javascript</div>
                                                    <div className="teacherName fst-italic"></div>
                                                    <div className="room fw-bold">Salle 4</div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>


                                <div>
                                    <p className='text-center text-danger fw-bold text-decoration-underline'>NB: VOTRE RENDU EST A FAIRE DANS LE DELAIS. VOUS PRESENTEREZ LE 14 MAI</p>
                                </div>
                            </div> */}




                        </div>
                    </div>

                </section>
            </div>

            <Footer />
        </div>

    )
}

export default TimetableClassPage