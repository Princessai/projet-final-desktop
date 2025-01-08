import React, { useEffect, useState } from 'react';
import Timetable from '../../components/Timetable';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { useAxios } from '../../Providers/AxiosProvider';
import { useAuth } from '../../Providers/AuthProvider';
import { FallbackContent } from '../../components/FallbackContent';
import dayjs from 'dayjs';


function TimetablePage() {

    // const { classe_id, classe_label } = useParams();
    const { currentYear, isUserAuthenticated, user } = useAuth();
    console.log("🚀 ~ TimetablePage ~ user:", user)

    const [timetables, setTimetables] = useState([]);

    const [loading, setLoading] = useState(true);  // État de chargement
    const { axios } = useAxios();


    const interval = 0;


    useEffect(function () {
        console.log('useffet', isUserAuthenticated)
        let controller;
        controller = new AbortController();

        if (isUserAuthenticated) {
            console.log('fetch timetable');
            axios.get(`/timetable/${user.classe.id}/${currentYear.id}/${interval}`, {
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
                    console.error(error);
                });


        }
        return () => {
            controller.abort()
        }

    }, [isUserAuthenticated])






    if (loading) return <FallbackContent />;
    console.log('timetables(((((', timetables)

    const annee_id = currentYear.id;
    const classe_id = user.classe.id;
    const classe_label = user.classe.label;
    const currentTimetable = timetables[0];


    const weekStart = currentTimetable.date_debut;

    const weekEnd = currentTimetable.date_fin;

    const date_debut = dayjs(weekStart).format('DD MMMM YYYY');

    const date_fin = dayjs(weekEnd).format('DD MMMM YYYY');

    console.log('currentTimetable.pauses',currentTimetable.pauses);
    return (
        <div className='div-container d-flex flex-column'>
            <Navbar />
            <div className='body-content-container d-flex'>
                <Sidebar />
                <section className='content-container'>
                    <div className="">
                        <div className=" mb-4 mt-3 ps-5">
                            <h1 className='py-3'>{classe_label}</h1>
                        </div>
                        <div className="col-md-12 mb-5 d-flex justify-content-around">
                            <div className="col-md-8 d-flex justify-content-between">

                            </div>

                        </div>

                        <div className="col-md-12">

                            <div className='mx-5'>
                                <h5 className='text-center fw-bold text-decoration-underline mb-5'> Timetable from {date_debut} to {date_fin}</h5>

                                <Timetable
                                    seances={currentTimetable.seances}
                                    breaks={currentTimetable.pauses}
                                    timetableStart={currentTimetable.date_debut}
                                    timetableEnd={currentTimetable.date_fin}
                                />


                            </div>

                            <div>
                                <p className='text-center text-danger fw-bold text-decoration-underline'>NB: VOTRE RENDU EST A FAIRE DANS LE DELAIS. VOUS PRESENTEREZ LE 14 MAI</p>
                            </div>




                        </div>
                    </div>

                </section>
            </div>

            <Footer />
        </div>
    )
}

export default TimetablePage