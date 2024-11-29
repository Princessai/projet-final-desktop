import React from 'react'
import Navbar from '../../components/Navbar'
import SidebarCoordinator from '../../components/SidebarCoordinator'
import Footer from '../../components/Footer'
import { Link, useParams } from 'react-router-dom';

function ClasseInfos() {

    const { classe_id, classe_label } = useParams();



    return (
        <div className='div-container d-flex flex-column'>
            <Navbar />
            <div className='body-content-container d-flex'>
                <SidebarCoordinator />
                <section className='content-container'>

                    <div className="row">
                        <div className="text-center mt-5 mb-5">
                            <h3>{classe_label}: </h3>
                        </div>
                        <div className=" d-flex justify-content-between">


                            <div className="card w-25 shadow text-center p-3 m-5 rounded" >
                                <img src="..." className="card-img-top" alt="..." />
                                <Link to={`/coordinator/timetable/class/${classe_id}/${classe_label}`}>
                                    <div className="card-body px-0 py-3">
                                        <p className="card-text fw-bold">Timetables </p>
                                    </div>
                                </Link>
                            </div>


                            <div className="card w-25 shadow text-center p-3 m-5 rounded" >
                                <img src="..." className="card-img-top" alt="..." />
                                <Link to={`/coordinator/userClass/${classe_id}/${classe_label}`}>
                                    <div className="card-body px-0 py-3">
                                        <p className="card-text fw-bold">Students' list </p>
                                    </div>
                                </Link>
                            </div>


                            {/* <div className="card w-25 sh text-centeradow p-3 m-5 rounded" >
                                <img src="..." className="card-img-top" alt="..." />
                                <Link to={`/coordinator/classes/modules/${classe_id}/${classe_label}`}>
                                    <div className="card-body px-0 py-3">
                                        <p className="card-text fw-bold">Modules </p>
                                    </div>
                                </Link>
                            </div> */}


                            <div className="card w-25 shadow text-center p-3 m-5 rounded" >
                                <img src="..." className="card-img-top" alt="..." />
                                <Link to={``}>
                                    <div className="card-body px-0 py-3">
                                        <p className="card-text fw-bold">Graphics </p>
                                    </div>
                                </Link>
                            </div>

                        </div>
                    </div>

                </section>
            </div>

            <Footer />
        </div>
    )
}

export default ClasseInfos