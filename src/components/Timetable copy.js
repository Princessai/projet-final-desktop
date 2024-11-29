import React, { useEffect, useState } from 'react';
import './Timetable.css';
import dayjs from 'dayjs';
import { useAxios } from '../Providers/AxiosProvider';
import { useAuth } from '../Providers/AuthProvider';
import { FallbackContent } from './FallbackContent';
import { useParams } from 'react-router-dom';
function Timetable({ TimetableData }) {

    console.log('timetable  rerenderr');

    const seances = TimetableData.seances;

    const weekDays = [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday'
    ];
    const seancesByDayArr = [];

    const maxHeurFin = 0;

    seances.forEach(function (seance) {

        const heure_debut = dayjs(seance.heure_debut); // Get the current date

        const dayOfWeek = heure_debut.day();

        const dayIndex = dayOfWeek - 1;


        const step = 1;

        if (seancesByDayArr[dayIndex]) {

            seancesByDayArr[dayIndex].push(seance);
        } else {
            // console.log('rawSpan', seance.duree, seance.duree / step);
            seancesByDayArr[dayIndex] = [seance];
        }

        // console.log(dayIndex);
    })


    const maxDay = 4;
    const trHead = <tr></tr>;
    let dayStartHour = 9;
    let dayEndHour = 17;
    let weekStart = TimetableData.data_debut;
    const timeTableBody = [];
    for (let hours = dayStartHour; hours < dayEndHour;) {
        // let  dayCounter=0;
        const timeTableTr = [];
        for (let dayCount = 0; dayCount < maxDay;) {
            const weekStartDayjs = dayjs(weekStart).add(dayCount, 'day').add(hours, 'hour');
            const daySeances = seancesByDayArr[dayCount]

            const findedSeance = daySeances.find(function (seance) {
                const seance_heure_debut = seance.heure_debut;
                dayjs(seance_heure_debut).isSame(weekStartDayjs);

            });

            if (findedSeance) {
                timeTableTr.push(<td>{findedSeance.id}</td>);
            } else {
                timeTableTr.push(<td></td>);
            }

            dayCount++;
        }

        timeTableBody.push(<tr>{timeTableTr}</tr>);

        hours += step;
    }

    

    const { user, isUserAuthenticated } = useAuth();

    console.log('user', user);

    const { classe_id } = useParams()

    let classeId = classe_id;

    console.log('userrr', user);

    const [timetableSessions, setTimetableSessions] = useState();
    const [loading, setLoading] = useState(true);  // État de chargement

    const { currentYear } = useAuth();

    const anneeId = currentYear.id;

    const { axios } = useAxios();

    // function fetchTimetableSessions() {
    //     console.log('fetch sessions');

    //     axios.get(`/timetable/${classeId}/${anneeId}/`)
    //         .then(function (response) {
    //             const timetableSessions = response.data;
    //             setTimetableSessions((oldvalue) => timetableSessions);
    //             setLoading(false);

    //             console.log('fetch user session', timetableSessions);

    //         })
    //         .catch(function (error) {
    //             console.log(error);
    //         });

    // }


    useEffect(() => {

        if (isUserAuthenticated) {

            fetchTimetableSessions();
        }

    }, [isUserAuthenticated]);

    console.log(timetableSessions);

    if (loading) return <FallbackContent />;

    let sessions = timetableSessions.seances;



    return (

        <div>
            <div className='header-container px-5'>
                <h1 className='py-3'>Current Timetable</h1>
            </div>
            <div className='mx-5'>
                <h5 className='text-center fw-bold text-decoration-underline mb-3'>Emploi du temps B3 Développement Web du 13 mai 17 mai 24</h5>
                <div className='d-flex flex-wrap'>

                    {/* {
                        sessions.map(function (session, index) {
                            let sessionDate = dayjs(session.date).format('YYYY-MM-DD');
                            let sessionStart = dayjs(session.heure_debut);
                            let sessionEnd = dayjs(session.heure_fin);
                            let sessionDayName = dayjs(session.date).format('dddd');




                            return <div key={index} className='bloc-presence shadow text-center w-25 mx-3 mt-5 mb-4'>
                             
                                <div className="teacherName fst-italic"> {sessionDayName} {sessionDate} </div>
                                <div className="seanceType fw-bold">{session.type_seance.label} </div>
                                <div className="subject">{session.module.label}</div>
                                <div className="teacherName fst-italic">{sessionStart.format('HH:mm')}-{sessionEnd.format('HH:mm')} </div>
                                <div className="room fw-bold"> {session.salle.label}</div>
                            </div>



                        })
                    } */}

                    {/* <table className=''>
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
                    </table>*/}

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
                    {/*
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
                            */}
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