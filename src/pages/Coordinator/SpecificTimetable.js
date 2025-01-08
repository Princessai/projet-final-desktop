import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import SidebarCoordinator from '../../components/SidebarCoordinator'
import Timetable from '../../components/Timetable'
import Footer from '../../components/Footer'
import { useParams } from 'react-router-dom'
import { useAxios } from '../../Providers/AxiosProvider'
import { useAuth } from '../../Providers/AuthProvider'
import { FallbackContent } from '../../components/FallbackContent'
import dayjs from 'dayjs'

function SpecificTimetable() {

    const { timetable_id, classe_label } = useParams();
    
        const [timetable, setTimetable] = useState([]);
    
    
        const [loading, setLoading] = useState(true);  // État de chargement
        const { axios } = useAxios();
    
        const { isUserAuthenticated } = useAuth();
    
    
    
    
        useEffect(function () {
            console.log('useffet', isUserAuthenticated)
            let controller;
            controller = new AbortController();
    
            if (isUserAuthenticated) {
                console.log('fetch timetable');
    
                
                    axios.get(`/timetable/${timetable_id}`, {
                        signal: controller.signal
                    })
                    .then(function (timetableRes) {
    
                        const timetable = timetableRes.data;
    
                        setTimetable(timetable);
                        setLoading(false);
                        console.log(timetable);
    
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
    
    
        const currentTimetable = timetable;
    
    
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
                <div className="col-md-12">

                     <div className='mx-5'>
                        <h5 className='text-center fw-bold text-decoration-underline mb-5'> Timetable from {date_debut} to {date_fin}</h5>
                        {/* <div>
                            <SaveAltOutlined />
                        </div> */}
                        <Timetable seances={currentTimetable.seances}
                            breaks={currentTimetable.pauses} 
                            timetableStart={currentTimetable.date_debut} 
                            timetableEnd={currentTimetable.date_fin} />
                        <div>
                            <p className='text-center text-danger fw-bold text-decoration-underline'></p>
                        </div>

                    </div>

                </div>
            </div>

        </section>
    </div>

    <Footer />
</div>
)
}

export default SpecificTimetable