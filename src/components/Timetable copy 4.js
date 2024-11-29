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


function Timetable({ TimetableData, border }) {

    console.log('timetable  rerenderr');

    const [borderWidth, setBorderWidth] = useState(() => { return border ? border : 10 });
    const borderStyle = `solid ${borderWidth / 2}px black`

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
    // const step = totalHour;




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
    const rowHeight = 100 / ((dayEndHour - dayStartHour) / step);

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
    const specificTimeScale = [];
    const timetableALLBreaks = TimetableData.pauses



    console.log('pausessss+++++', timetableALLBreaks)


    for (let hoursSteps = dayStartHour; hoursSteps < dayEndHour;) {
        console.log('dayStartHour', hoursSteps)
        const timeTableTr = [];
        const timeTableBreaksTr = []
        let currentSpecificTimeScale = [];
        // let hoursStepsWithoutMinute = hoursSteps -(stepMinuteTohour*hoursStepsCounter);

        if (hoursSteps !== dayStartHour) {
            formatTime = formatTime.add(stepHour, 'hour').add(stepMinute, 'minute');
        } else {
            formatTime = timetableStartDayjs
        }

        let islastLoop = ((hoursSteps + step) >= dayEndHour) ? true : false;


        const hoursStepsEnd = hoursSteps + step

        // let breakStartTotalHour;
        // let breakEndTotalHour;
        // timetableALLBreaks.forEach(function (timeTablebreak, breakIndex) {
        //     const breakStartString = String(timeTablebreak.debut);
        //     const { timeStringHour: breakStartHour, timeStringMinuteTohour: breakStartMinuteHour } = convertTimeStringToHour(breakStartString)
        //     breakStartTotalHour = breakStartHour + breakStartMinuteHour;

        //     if (breakStartTotalHour == hoursSteps || (breakStartTotalHour > hoursSteps && breakStartTotalHour < hoursStepsEnd)) {
        //         matchingBreaksIndexes.push(breakIndex);
        //     }

        // })

        let isBreakRowFull = false;
        const matchingBreaksIndexes = [];
        let baseRowTop = rowHeight * hoursStepsCounter + '%';

        for (let breakIndex = 0; breakIndex < timetableALLBreaks.length;) {
            const timeTablebreak = timetableALLBreaks[breakIndex];
            const breakStartString = String(timeTablebreak.debut);
            const breakEndString = String(timeTablebreak.fin);

            // const { timeStringHour: breakStartHour, timeStringMinuteTohour: breakStartMinuteHour } = convertTimeStringToHour(breakStartString)
            const { totalHour: breakStartTotalHour, timeStringMinute: breakStartMinute, timeStringHour: breakStartHour } = convertTimeStringToHour(breakStartString)


            const { totalHour: breakEndTotalHour, timeStringMinute: breakEndMinute, timeStringHour: breakEndHour } = convertTimeStringToHour(breakEndString)


            console.log('looooking forbreaks', hoursSteps, hoursStepsEnd,)
            if (breakStartTotalHour == hoursSteps || (breakStartTotalHour > hoursSteps && breakStartTotalHour < hoursStepsEnd)) {
                console.log('breakfinded+++++++', breakStartTotalHour, hoursSteps, hoursStepsEnd)
                if (!timeTablebreak.only) {

                    isBreakRowFull = true;
                    const breakKey = 'fullrow' + '_' + hoursStepsCounter + '_' + breakIndex;
                    let breakDuration = timesStringdiffInHour(timeTablebreak.debut, timeTablebreak.fin);
                    let breakHeight = (breakDuration * rowHeight);
                    breakHeight = ((100 * breakHeight) / rowHeight) + '%';



                    console.log('difffff+++++++', breakHeight);
                    console.log('break duration', breakDuration

                    )
                    const timetableBreakTdTop = (breakStartTotalHour - hoursSteps) * 100 + '%';
                    // console.log(timetableBreakTdTop)
                    const breaksTdStyle = {
                        width: "100%",
                        height: breakHeight,
                        top: timetableBreakTdTop,

                    };
                    const breakStartInhourSteps = breakStartTotalHour - dayStartHour;
                    const breakEndInhourSteps = breakEndTotalHour - dayEndHour;

                    if (breakStartInhourSteps != 0 && !Number.isInteger(breakStartInhourSteps / step)) {
                        if (specificTimeScale.length == 0 || specificTimeScale.indexOf((timeScale) => timeScale.totalHour == breakStartTotalHour) == -1) {
                            console.log('******testttt')

                            const specificTime = { totalHour: breakStartTotalHour, minutes: breakStartMinute, hours: breakStartHour };
                            currentSpecificTimeScale.push(specificTime);
                            specificTimeScale.push(specificTime);
                        };
                        // currentSpecificTimeScale
                    }

                    if (breakEndInhourSteps != 0 && !Number.isInteger(breakEndInhourSteps / step)) {
                        if (specificTimeScale.length == 0 || specificTimeScale.indexOf((timeScale) => timeScale.totalHour == breakEndTotalHour) == -1) {
                            const specificTime = { totalHour: breakEndTotalHour, minutes: breakEndMinute, hours: breakEndHour };
                            currentSpecificTimeScale.push(specificTime);
                            specificTimeScale.push(specificTime);

                        };
                        // currentSpecificTimeScale
                    }


                    timeTableBreaksTr.push(<div className='td' key={breakKey} style={breaksTdStyle} ></div>);
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

        let timeTableBreaksCounter = -1;


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
                                timeTableBreaksCounter++
                                timeTableBreaksTr[timeTableBreaksCounter] = <td className='breakempty' style={{ width: BreakTdWidth }} ></td>
                                prevDayBreak.breakIndex = matchingBreaksIndexe;


                            }

                            if (prevDayBreak.breakIndex == matchingBreaksIndexe) {
                                const width = timeTableBreaksTr[timeTableBreaksCounter].props.style;
                                timeTableBreaksTr[timeTableBreaksCounter].props.style.width = parseInt(width) + BreakTdWidth + '%'
                                console.log('styleeee______break', timeTableBreaksTr[timeTableBreaksCounter].style)
                            }


                        }
                    }




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
                console.log('duree____rawwww', findedSeance.duree_raw)

                const rowspan = findedSeance.duree_raw / step;
                console.log('prevesanceende', prevSeancesEnd[dayCount], currentLine)

                const timetableTdStyle = { rowspan };
                console.log('rowspannnnn________', rowspan, findedSeance)
                console.log('seance_heure_debut', findedSeance.heure_debut)
                console.log('seance_end', currentLine + rowspan)
                console.log('trrrrr____',)
                // rowspan * rowHeight /rowHeight
                // rowspan * rowHeight
                const height = (rowspan * rowHeight) * 100 / rowHeight + "%"
                console.log('height*****', height)
                // const borderBottom = null;
                let embedded_empty;



                let emptyTdHeight = (((findedSeance.duree / step) * rowHeight) * 100 / rowHeight) + (100 - parseInt(height)) + "%";
                console.log('emptyTdHeightcccccccccccccccccccc', emptyTdHeight);

                // height: 500px;
                // left: -5px;
                // width: calc(100% + 10px);
                timeTableTr.push(<div className="td" key={key} style={{ height, border: borderStyle, }} >
                    {/* {(prevSeancesEnd[dayCount] == currentLine) && <div className="td empty_td" style={{ border: borderStyle, left: - borderWidth / 2 + "px", width: `calc(100% + ${borderWidth}px)`, height: emptyTdHeight }}>test  </div>} */}

                </div>);

                if ((prevSeancesEnd[dayCount] == currentLine) && rowspan < 1) {
                    console.log('chevauchementtttttt**')
                    timeTableTr.push(<div key={"empty_td" + key} className="td empty_td" style={{ position: 'absolute', width: BreakTdWidth + "%", border: borderStyle, left: BreakTdWidth * dayCount + "%", height: "100%" }}>test  </div>);


                }
                prevSeancesEnd[dayCount] = currentLine + rowspan;

            } else {
                // if ((prevSeancesEnd[dayCount] <= currentLine)) {
                timeTableTr.push(<div className="td empty_td" key={key} style={{ border: borderStyle }}></div>);
                // }

            }

            dayCount++;
        }


        console.log('timetableDatetrrrr_______', specificTimeScale)


        if (currentSpecificTimeScale.length > 0) {
            currentSpecificTimeScale = currentSpecificTimeScale.map((timeScale) => {
                let timeDiff = timeScale.totalHour - hoursSteps;
                let spanTop = (timeDiff * 100) / step;
                // const formatTime = timetableStartDayjs.add(timeScale.hours, 'hour').add(timeScale.minutes, 'minute');
                const formatTime = dayjs()
                    .set('hour', timeScale.hours)
                    .set('minute', timeScale.minutes)
                    .set('second', 0);

                return <span className='specificTimeScaleElemnt' style={{ top: spanTop + '%' }}>  {formatTime.format('HH:mm')} </span>;
            })
            console.log('currentSpecificTimeScaleeeeeeeeeeeeeee', currentSpecificTimeScale)
        }


        timeTableDatesTr.push(< div className='tr' key={hoursSteps}><div td>
            <span className='timeScaleElemnt'>  {formatTime.format('HH:mm')} </span>

            {islastLoop &&
                <span className='timeScaleElemnt timeScaleLastElemnt'>
                    {formatTime.add(stepHour, 'hour').add(stepMinute, 'minute').format('HH:mm')}
                </span>}
            {currentSpecificTimeScale}
        </td></div>);



        timeTableBody.push(<div className='tr' style={{ height: rowHeight + '%' }} key={hoursSteps}>{timeTableTr}</div>);

        if (timeTableBreaksTr.length > 0) {
            // <tr key={'break' + hoursSteps} className='breaks'>
            //     {timeTableBreaksTr}
            // </tr>
            timeTableBody.push(
                <div className='breaks tr' style={{ top: baseRowTop, height: rowHeight + '%', width: `calc(100% - ${borderWidth - 2}px)` }} key={'breaks' + hoursSteps} >
                    <div className='breaksInnerBorder'>
                        {timeTableBreaksTr}

                    </div>

                </div>
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
                {/* <div className='d-flex'> */}

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
                        <thead className='text-center'>
                            <tr><th>Hours</th></tr>
                        </thead>
                    </table>

                    <div className='timetableContainer d-flex'>

                        <div className='timeTableTimeScaleBody'>

                            {timeTableDatesTr}

                        </div>


                        <div className="myTimetable">
                            <table className='timeTableDayScale'>
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
                            </table>

                            <div className='timeTableBorder'>
                                <div className="tbody" style={{ border: borderStyle }} >
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
                                    {/* <div className='tableBorder'> */}


                                    {timeTableBody}
                                    {/* </div> */}


                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div>
                    <p className='text-center text-danger fw-bold text-decoration-underline'>NB: VOTRE RENDU EST A FAIRE DANS LE DELAIS. VOUS PRESENTEREZ LE 14 MAI</p>
                </div>
            </div>

        // </div>
    )
}

export default Timetable