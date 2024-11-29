import React, { useEffect, useState } from 'react';
import './Timetable.css';
import dayjs from 'dayjs';
import { useAxios } from '../Providers/AxiosProvider';
import { useAuth } from '../Providers/AuthProvider';
import { FallbackContent } from './FallbackContent';
import { useParams } from 'react-router-dom';




function convertTimeStringToHour(timeString) {

    const timeStringValues = String(timeString).split(':');

    const timeStringHour = parseInt(timeStringValues[0] ?? 0);
    const timeStringMinute = parseInt(timeStringValues[1] ?? 0);
    const timeStringMinuteTohour = timeStringMinute / 60;
    const totalHour = timeStringMinuteTohour + timeStringHour;
    return {
        timeStringMinute,
        timeStringMinuteTohour,
        timeStringHour,
        totalHour
    }

}

function timesStringdiffInHour(timeString1, timeString2) {
    // const now = dayjs().format('DD/MM/YYYY')
    // timeString1 = now + " " + String(timeString1).trim();
    // timeString2 = now + " " + String(timeString2).trim();
    // console.log('datttttteeestring^^^^^^^^', timeString1, timeString2)

    // dayjs(timeString1).diff(timeString2);
    // return dayjs(timeString1).diff(timeString2);
    timeString1 = convertTimeStringToHour(timeString1).totalHour;
    timeString2 = convertTimeStringToHour(timeString2).totalHour;
    let diff = timeString1 - timeString2;
    return Math.abs(diff);



}


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

    const stepString = '1l';


    const { timeStringHour: stepHour, timeStringMinute: stepMinute, timeStringMinuteTohour } = convertTimeStringToHour(stepString)

    const step = stepHour + timeStringMinuteTohour;




    seances.forEach(function (seance) {

        const heure_debut = dayjs(seance.heure_debut); // Get the current date

        const dayOfWeek = heure_debut.day();

        const dayIndex = dayOfWeek - 1;




        if (seancesByDayArr[dayIndex]) {

            seancesByDayArr[dayIndex].push(seance);
        } else {
            // console.log('rawSpan', seance.duree, seance.duree / step);
            seancesByDayArr[dayIndex] = [seance];
        }

        // console.log(dayIndex);
    })



    const maxDay = 4;

    const dayStartHourString = 9;
    const dayEndHourString = 17;
    const { totalHour: dayStartHour } = convertTimeStringToHour(dayStartHourString)
    const { totalHour: dayEndHour } = convertTimeStringToHour(dayEndHourString)
    const rowHeight = 100 / (dayEndHour - dayStartHour);

    const BreakTdWidth = 100 / 5;
    const weekStart = TimetableData.date_debut;
    console.log('weeeekstart++++', weekStart, TimetableData)
    const timeTableBody = [];
    const timeTableDatesTr = [];
    let hoursStepsCounter = 0;
    const timetableStartDayjs = dayjs(weekStart).add(dayStartHour, 'hour');
    console.log('timetable starttt', timetableStartDayjs.format('YYYY-MM-DD HH:mm:ss'))
    let formatTime;
    const prevSeancesEnd = [];
    const timetableALLBreaks = TimetableData.pauses



    console.log('pausessss+++++', timetableALLBreaks)


    for (let hoursSteps = dayStartHour; hoursSteps < dayEndHour;) {
        console.log('dayStartHour', hoursSteps)
        const timeTableTr = [];
        const timeTableBreaksTr = []
        // let hoursStepsWithoutMinute = hoursSteps -(stepMinuteTohour*hoursStepsCounter);

        if (hoursSteps !== dayStartHour) {
            formatTime = formatTime.add(stepHour, 'hour').add(stepMinute, 'minute');
        } else {
            formatTime = timetableStartDayjs
        }

        let islastLoop = ((hoursSteps + step) >= dayEndHour) ? true : false;

        timeTableDatesTr.push(<tr key={hoursSteps}><td>
            <span className='timeScaleElemnt'>  {formatTime.format('HH:mm')} </span>

            {islastLoop &&
                <span className='timeScaleElemnt timeScaleLastElemnt'>
                    {formatTime.add(stepHour, 'hour').add(stepMinute, 'minute').format('HH:mm')}
                </span>}

        </td></tr>);
        const hoursStepsEnd = hoursSteps + step

        let breakStartInhour;
        // timetableALLBreaks.forEach(function (timeTablebreak, breakIndex) {
        //     const breakStartString = String(timeTablebreak.debut);
        //     const { timeStringHour: breakStartHour, timeStringMinuteTohour: breakStartMinuteHour } = convertTimeStringToHour(breakStartString)
        //     breakStartInhour = breakStartHour + breakStartMinuteHour;

        //     if (breakStartInhour == hoursSteps || (breakStartInhour > hoursSteps && breakStartInhour < hoursStepsEnd)) {
        //         matchingBreaksIndexes.push(breakIndex);
        //     }

        // })

        let isBreakRowFull = false;
        const matchingBreaksIndexes = [];
        let baseRowTop = rowHeight * hoursStepsCounter + '%';

        for (let breakIndex = 0; breakIndex < timetableALLBreaks.length;) {
            const timeTablebreak = timetableALLBreaks[breakIndex];
            const breakStartString = String(timeTablebreak.debut);
            const { timeStringHour: breakStartHour, timeStringMinuteTohour: breakStartMinuteHour } = convertTimeStringToHour(breakStartString)
            breakStartInhour = breakStartHour + breakStartMinuteHour;

            console.log('looooking forbreaks', hoursSteps, hoursStepsEnd,)
            if (breakStartInhour == hoursSteps || (breakStartInhour > hoursSteps && breakStartInhour < hoursStepsEnd)) {
                console.log('breakfinded+++++++', breakStartInhour, hoursSteps, hoursStepsEnd)
                if (!timeTablebreak.only) {

                    isBreakRowFull = true;
                    const breakKey = 'fullrow' + '_' + hoursStepsCounter + '_' + breakIndex;
                    let breakDuration = timesStringdiffInHour(timeTablebreak.debut, timeTablebreak.fin);
                    breakDuration = (breakDuration * rowHeight);
                    let breakHeight = ((100 * breakDuration) / rowHeight) + '%';

                    // convertTimeStringToHour,


                    console.log('difffff+++++++', breakHeight);
                    console.log('break duration', breakDuration

                    )
                    const timetableTdTop = (breakStartInhour - hoursSteps) * 100 + '%';
                    console.log(timetableTdTop)
                    timeTableBreaksTr.push(<td key={breakKey} style={{ width: "100%", height: breakHeight, top: timetableTdTop }} ></td>);
                    break;
                }
                matchingBreaksIndexes.push(breakIndex);
            }

            breakIndex++
        }

        const prevDayBreak = {
            breakIndex: null,
            withOnly: null

        }

        let timeTableBreaksCounter = 0;


        for (let dayCount = 0; dayCount <= maxDay;) {
            const key = `day_${dayCount}_${hoursSteps}`;

            if (isBreakRowFull == false) {
                for (let matchingBreaksIndexe = 0; matchingBreaksIndexe < matchingBreaksIndexes.length;) {
                    const breakKey = key + '_' + matchingBreaksIndexe;
                    const timeTablebreakAtIndex = timetableALLBreaks[matchingBreaksIndexe];
                    if (timeTablebreakAtIndex.only) {
                        if (timeTablebreakAtIndex.only.includes(dayCount)) {
                            if (prevDayBreak.breakIndex == null || prevDayBreak.breakIndex !== matchingBreaksIndexe) {

                                console.log('breakkkk_width')
                                console.log(timeTableBreaksCounter)

                                timeTableBreaksTr[timeTableBreaksCounter] = <td className='breakempty' style={{ width: BreakTdWidth }} ></td>
                                prevDayBreak.breakIndex = matchingBreaksIndexe;
                                timeTableBreaksCounter++

                            }

                            if (prevDayBreak.breakIndex == matchingBreaksIndexe) {
                                const width = timeTableBreaksTr[timeTableBreaksCounter].props.style;
                                timeTableBreaksTr[timeTableBreaksCounter].props.style.width = parseInt(width) + BreakTdWidth + '%'
                                console.log('styleeee______break', timeTableBreaksTr[timeTableBreaksCounter].style)
                            }


                        }
                    }
                    // else {

                    //     // const top = rowHeight * hoursStepsCounter + '%'
                    //     // timeTableBreaksTr[timeTableBreaksCounter] = <td key={breakKey} style={{ width: BreakTdWidth, top }} ></td>
                    //     // timeTableBreaksCounter++
                    //     // // break 2;

                    // }



                    matchingBreaksIndexe++
                }
            }

            // matchingBreaksIndexes.forEach(function (matchingBreaksIndexe) {
            //     const timeTablebreakAtIndex = timetableALLBreaks[matchingBreaksIndexe];
            //     if (timeTablebreakAtIndex.only) {
            //         if (timeTablebreakAtIndex.only.includes(dayCount)) {
            //             if (prevDayBreak.breakIndex==null){

            //                 timeTableBreaksTr[timeTableBreaksCounter]=<td  className='breaks' style={{with:BreakTdWidth}} ></td>
            //                 prevDayBreak.breakIndex=matchingBreaksIndexe;
            //                 timeTableBreaksCounter++

            //             }

            //             if (prevDayBreak.breakIndex==matchingBreaksIndexe){

            //             }


            //         }
            //     }else{
            //         BreakTdWidth='100%';
            //         only
            //         timeTableBreaksTr[timeTableBreaksCounter]=<td  className='breaks' style={{with:BreakTdWidth}} ></td>
            //     }
            // })




            let weekStartDayjs = timetableStartDayjs.add(dayCount, 'day').add(stepHour * hoursStepsCounter, 'hour').add(stepMinute * hoursStepsCounter, 'minute');
            const daySeances = seancesByDayArr[dayCount]
            console.log(weekStartDayjs.format('YYYY-MM-DD HH:mm:ss'));
            const findedSeance = daySeances.find(function (seance) {
                const seance_heure_debut = seance.heure_debut;
                return dayjs(seance_heure_debut).isSame(weekStartDayjs);

            });

            const currentLine = hoursStepsCounter + 1;
            if (findedSeance) {

                const rowspan = findedSeance.duree / step;
                const timetableTdStyle = { rowspan };

                prevSeancesEnd[dayCount] = currentLine + rowspan;
                console.log('seance_heure_debut', findedSeance.heure_debut)
                console.log('seance_end', currentLine + rowspan)


                timeTableTr.push(<td key={key} rowSpan={rowspan} ></td>);
            } else {
                if ((prevSeancesEnd[dayCount] <= currentLine)) {
                    timeTableTr.push(<td key={key}></td>);
                }

            }

            dayCount++;
        }


        timeTableBody.push(<tr key={hoursSteps}>{timeTableTr}</tr>);

        if (timeTableBreaksTr.length > 0) {
            // <tr key={'break' + hoursSteps} className='breaks'>
            //     {timeTableBreaksTr}
            // </tr>
            timeTableBody.push(
                <tr className='breaks' style={{ top: baseRowTop }} key={'breaks' + hoursSteps} >{timeTableBreaksTr}</tr>
            );
        }


        hoursSteps += step;
        hoursStepsCounter++;
    }

    const { user, isUserAuthenticated } = useAuth();

    console.log('user', user);

    const { classe_id } = useParams()

    let classeId = classe_id;


    const [timetableSessions, setTimetableSessions] = useState();
    // const [loading, setLoading] = useState(true);  // État de chargement

    // const { currentYear } = useAuth();

    // const anneeId = currentYear.id;

    // const { axios } = useAxios();

    // function fetchTimetableSessions() {

    //     axios.get(`/timetable/${classeId}/${anneeId}/`)
    //         .then(function (response) {
    //             const timetableSessions = response.data;
    //             setTimetableSessions((oldvalue) => timetableSessions);
    //             setLoading(false);


    //         })
    //         .catch(function (error) {
    //             console.log(error);
    //         });

    // }


    // useEffect(() => {

    //     if (isUserAuthenticated) {

    //         // fetchTimetableSessions();
    //     }

    // }, [isUserAuthenticated]);


    // if (loading) return <FallbackContent />;

    // let sessions = timetableSessions.seances;



    return (

        <div>
            <div className='header-container px-5'>
                <h1 className='py-3'>Current Timetable</h1>
            </div>
            <div className='mx-5'>
                <h5 className='text-center fw-bold text-decoration-underline mb-3'>Emploi du temps B3 Développement Web du 13 mai 17 mai 24</h5>
                <div className='d-flex'>

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

                    <table className='TimeTableTimeScale'>
                        <thead>
                            <tr><th>Hours</th></tr>
                        </thead>


                        <tbody >

                            {timeTableDatesTr}
                            {/* <tr><td> 09:00 </td></tr>
                            <tr><td> 10:00 </td></tr>
                            <tr><td> 11:00 </td></tr>
                            <tr><td> 12:00 </td></tr>
                            <tr><td> 13:00 </td></tr>
                            <tr><td> 14:00 </td></tr>
                            <tr><td> 15:00 </td></tr>
                            <tr><td> 16:00 </td></tr>
                            <tr><td> 17:00 </td></tr> */}
                        </tbody>
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
                            {/* <tr className="breaks">
                            <td >
                                </td><td>
                                    </td><td >
                                        </td>
                                        <td ></td>
                                        <td ></td>
                            </tr>

                            <tr style={{ top: "37.50%" }} className='breaks' ><td >
                            </td>   <td >
                                </td> <td >
                                </td> <td >
                                </td></tr> */}
                            {/*
                            <tr className='breaks' ><td >
                            </td></tr> 
                            <tr className='breaks' style={{top:"77.50%"}} ><td >
                            </td></tr> 
                            <tr className='breaks' ><td >
                            </td></tr>  */}

                            {timeTableBody}
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