import React from 'react';
import Navbar from '../../components/Navbar';
import SidebarCoordinator from '../../components/SidebarCoordinator';
import Footer from '../../components/Footer';
import '/src/pages/Presence/presence.css';
import { Link } from 'react-router-dom';

function PastTimetable() {
    return (
        <div className='div-container d-flex flex-column'>
            <Navbar />
            <div className='body-content-container d-flex'>
                <SidebarCoordinator />
                <section className='content-container'>

                    <div class="row">
                        <div class="col-md-12 mb-4 mt-3 ms-5">
                            <h1 class='py-3'>Timetable B3 Dev</h1>
                        </div>
                        <div class="col-md-12 mb-5 d-flex">
                            <div class="col-md-6 d-flex justify-content-evenly">
                                <Link to={'/coordinator/timetable/class'}>
                                    <button type="button" class="btn btn-danger">Current Timetable</button>
                                </Link>
                                <Link to={'/coordinator/timetable/class/pastimetable'}>
                                    <button type="button" class="btn btn-danger">past Timetable</button>
                                </Link >
                                <Link to={'/coordinator/timetable/class/Upcomingimetable'}>
                                    <button type="button" class="btn btn-danger">Upcoming Timetable</button>
                                </Link>
                            </div>
                            <div class="col-md-6 d-flex justify-content-center">
                                <Link to={'/coordinator/add-timetable'}>
                                    <button type="button" class="btn btn-success">Add Timetable</button>
                                </Link>

                            </div>

                        </div>
                        <div class="col-md-12">
                            <div className='bloc-presence shadow d-flex justify-content-between align-items-center ms-5 text-center mt-5 mb-4' >
                                <div></div>
                                <h5>MARDI 9h-12h</h5>
                                <div>
                                    <Link to={'/teacher/session/call'}>
                                        <button type="button" class="btn btn-warning text-light me-2">EDIT</button>
                                    </Link>
                                    <Link to={'/teacher/session/call'}>
                                        <button type="button" class="btn btn-success">SEE</button>
                                    </Link>
                                </div>
                            </div>

                            <div className='bloc-presence shadow d-flex justify-content-between align-items-center ms-5 text-center mt-5 mb-4' >
                                <div></div>
                                <h5>MARDI 9h-12h</h5>
                                <div>
                                    <Link to={'/teacher/session/call'}>
                                        <button type="button" class="btn btn-warning text-light me-2">EDIT</button>
                                    </Link>
                                    <Link to={'/teacher/session/call'}>
                                        <button type="button" class="btn btn-success">SEE</button>
                                    </Link>
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

export default PastTimetable