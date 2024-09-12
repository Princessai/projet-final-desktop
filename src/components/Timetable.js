import React from 'react';
import './Timetable.css';

function Timetable() {

    console.log('timetable  rerenderr');

    return (
        <div>
            <div className='header-container px-5'>
                <h1 className='py-3'>Current Timetable</h1>
            </div>
            <div className='mx-5'>
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
                            </tr>
                        </tbody>
                    </table>
                </div>


                <div>
                    <p className='text-center text-danger fw-bold text-decoration-underline'>NB: VOTRE RENDU EST A FAIRE DANS LE DELAIS. VOUS PRESENTEREZ LE 14 MAI</p>
                </div>
            </div>

        </div>
    )
}

export default Timetable