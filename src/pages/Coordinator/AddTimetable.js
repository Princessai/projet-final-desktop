import React from 'react'
import Timetable from '../../components/Timetable'
import Navbar from '../../components/Navbar';
import SidebarCoordinator from '../../components/SidebarCoordinator';
import Footer from '../../components/Footer';
import '/src/pages/Presence/presence.css';
import { Link } from 'react-router-dom';


function AddTimetable() {
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

                            <Timetable />

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
                                                <td colspan="6" className="break">Break</td>
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
                                                <td colspan="6" className="lunch">Lunch</td>
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
                                                <td colspan="6" className="break">Break</td>
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

export default AddTimetable