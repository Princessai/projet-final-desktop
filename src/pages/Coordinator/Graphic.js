import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import SidebarCoordinator from '../../components/SidebarCoordinator';
import Footer from '../../components/Footer';
import { Link } from 'react-router-dom';

function Graphic() {

    const [selectedView, setSelectedView] = useState("allClasses");


    return (
        <div className='div-container d-flex flex-column'>
            <Navbar />
            <div className='body-content-container d-flex'>
                <SidebarCoordinator />
                <section className='content-container'>
                    <div className="row">
                        <div className="col-md-12  mb-4 mt-3 ms-5">
                            <h1 className='py-3'>GRAPHICS</h1>
                        </div>
                        <div className="col-md-12 d-flex">
                            <button
                                type="button"
                                className={`btn btn-secondary ms-4 me-4 ${selectedView === 'allClasses' && 'active'}`}
                                onClick={() => setSelectedView("allClasses")}
                            >All Classes
                            </button>

                            <button
                                type="button"
                                className={`btn btn-secondary ${selectedView === 'classes' && 'active'}`}
                                onClick={() => setSelectedView("classes")}
                            >
                                Classes
                            </button>

                            {/* <Link to={'/coordinator/graphic/className'}>
                            </Link> */}
                        </div>
                        <div className="col-md-12">
                            {selectedView === 'classes' &&
                                <div class="col-md-12 d-flex flex-wrap">

                                    <div class="card shadow w-25 m-3" >
                                        <img src="..." class="card-img-top" alt="..." />
                                        <Link to={'/coordinator/graphic/class/details'}>
                                            <div class="card-body">
                                                <p class="card-text"><strong>B3 DEV</strong> </p>
                                            </div>
                                        </Link>
                                    </div>


                                    <div class="card shadow w-25 m-3" >
                                        <img src="..." class="card-img-top" alt="..." />
                                        <Link to={'/coordinator/graphic/class/details'}>
                                            <div class="card-body">
                                                <p class="card-text"><strong>B3 DEV</strong> </p>
                                            </div>
                                        </Link>
                                    </div>


                                </div>

                            }

                            {selectedView === 'allClasses' &&
                                <div>

                                </div>
                            }
                        </div>
                    </div>

                </section>
            </div>

            <Footer />
        </div>

    )
}

export default Graphic