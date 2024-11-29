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

function TimetableTd({ seance, style }) {

    
    
 useEffect(function(){
    // console.log('timetable tddd in domm')

 })
    const type_seance = seance.type_seance.label;
    const module = seance.module.label;
    const teacher = `${seance.manager.name} ${seance.manager.lastname}`;
    const salle = seance.salle.label;

    return <div className="td " style={style} >
        <div className=''>
            <p className='fw-bold m-0'>{type_seance} {module}</p>
            <p className=' m-0'>{teacher}</p>
            <p className='fw-bold fst-italic m-0'>{salle}</p>

        </div>

    </div>
}

function Timetable({ TimetableData, border ,height=600}) {

    console.log('timetable  rerenderr');
    const  timetableHeight=height;

    useEffect(function(){
        console.log('full ___timetable  in domm')
     })

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
    const weekEnd = TimetableData.date_fin;
    console.log('weeeekstart++++', weekStart, TimetableData)
    const timeTableBody = [];
    const timeTableDatesTr = [];
    let hoursStepsCounter = 0;
    const timetableStartDayjs = dayjs(weekStart).add(dayStartHour, 'hour');
    console.log('timetable starttt', timetableStartDayjs.format('YYYY-MM-DD HH:mm:ss'))
    let formatTime;
    const prevSeancesEnd = [];
    const specificTimeScale = [];
    const timetableALLBreaks = TimetableData.pauses;


    const date_debut = dayjs(weekStart).format('DD MMMM YYYY');
    const date_fin = dayjs(weekEnd).format('DD MMMM YYYY');

    const timetableDateDebut = dayjs(weekStart);
    const timetableDays = [];

    for (let dayCount = 0; dayCount <= maxDay;) {
        const currentTimetableDay = timetableDateDebut.add(dayCount, 'day')
        timetableDays.push(
            <th key={dayCount}>
                {currentTimetableDay.format('dddd')}
                <div>{currentTimetableDay.format('DD/MM')}</div>
            </th>
        );

        dayCount++
    }



    console.log('pausessss+++++', timetableALLBreaks)


    for (let hoursSteps = dayStartHour; hoursSteps < dayEndHour;) {
        console.log('dayStartHour', hoursSteps)
        const timeTableTr = [];
        const timeTableBreaksTr = []
        let currentSpecificTimeScale = [];

        function isSpecificTimeScale(seanceObject) {

            const seanceStartInhourSteps = seanceObject.startTotalHour - dayStartHour;
            const seanceEndInhourSteps = seanceObject.endTotalHour - dayEndHour;

            if (seanceStartInhourSteps != 0 && !Number.isInteger(seanceStartInhourSteps / step)) {
                if (specificTimeScale.length == 0 || specificTimeScale.indexOf((timeScale) => timeScale.totalHour == seanceObject.startTotalHour) == -1) {
                    console.log('******testttt')

                    const specificTime = { totalHour: seanceObject.startTotalHour, minutes: seanceObject.startMinute, hours: seanceObject.startHour };
                    currentSpecificTimeScale.push(specificTime);
                    specificTimeScale.push(specificTime);
                };

            }

            if (seanceEndInhourSteps != 0 && !Number.isInteger(seanceEndInhourSteps / step)) {
                if (specificTimeScale.length == 0 || specificTimeScale.indexOf((timeScale) => timeScale.totalHour == seanceObject.endTotalHour) == -1) {
                    const specificTime = { totalHour: seanceObject.endTotalHour, minutes: seanceObject.endMinute, hours: seanceObject.endHour };
                    currentSpecificTimeScale.push(specificTime);
                    specificTimeScale.push(specificTime);

                };

            }


        }

        if (hoursSteps !== dayStartHour) {
            formatTime = formatTime.add(stepHour, 'hour').add(stepMinute, 'minute');
        } else {
            formatTime = timetableStartDayjs
        }

        let islastLoop = ((hoursSteps + step) >= dayEndHour) ? true : false;


        const hoursStepsEnd = hoursSteps + step



        let isBreakRowFull = false;
        const matchingBreaksIndexes = [];
        let baseRowTop = rowHeight * hoursStepsCounter + '%';

        for (let breakIndex = 0; breakIndex < timetableALLBreaks.length;) {
            const timeTablebreak = timetableALLBreaks[breakIndex];
            const breakStartString = String(timeTablebreak.debut);
            const breakEndString = String(timeTablebreak.fin);

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
                    const breaksTdStyle = {
                        width: "100%",
                        height: breakHeight,
                        top: timetableBreakTdTop,

                    };

                    // const breakStartInhourSteps = breakStartTotalHour - dayStartHour;
                    // const breakEndInhourSteps = breakEndTotalHour - dayEndHour;

                    // if (breakStartInhourSteps != 0 && !Number.isInteger(breakStartInhourSteps / step)) {
                    //     if (specificTimeScale.length == 0 || specificTimeScale.indexOf((timeScale) => timeScale.totalHour == breakStartTotalHour) == -1) {
                    //         console.log('******testttt')

                    //         const specificTime = { totalHour: breakStartTotalHour, minutes: breakStartMinute, hours: breakStartHour };
                    //         currentSpecificTimeScale.push(specificTime);
                    //         specificTimeScale.push(specificTime);
                    //     };
                    //     // currentSpecificTimeScale
                    // }

                    // if (breakEndInhourSteps != 0 && !Number.isInteger(breakEndInhourSteps / step)) {
                    //     if (specificTimeScale.length == 0 || specificTimeScale.indexOf((timeScale) => timeScale.totalHour == breakEndTotalHour) == -1) {
                    //         const specificTime = { totalHour: breakEndTotalHour, minutes: breakEndMinute, hours: breakEndHour };
                    //         currentSpecificTimeScale.push(specificTime);
                    //         specificTimeScale.push(specificTime);

                    //     };
                    //     // currentSpecificTimeScale
                    // }

                    isSpecificTimeScale({
                        startTotalHour: breakStartTotalHour,
                        endTotalHour: breakEndTotalHour,
                        startMinute: breakStartMinute,
                        endMinute: breakEndMinute,
                        startHour: breakStartHour,
                        endHour: breakEndHour,
                    });


                    timeTableBreaksTr.push(<div className='td' key={breakKey} style={breaksTdStyle} > {timeTablebreak.name} </div>);
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

                    const breakStartString = String(timeTablebreakAtIndex.debut);
                    const breakEndString = String(timeTablebreakAtIndex.fin);


                    const { totalHour: breakStartTotalHour, timeStringMinute: breakStartMinute, timeStringHour: breakStartHour } = convertTimeStringToHour(breakStartString)


                    const { totalHour: breakEndTotalHour, timeStringMinute: breakEndMinute, timeStringHour: breakEndHour } = convertTimeStringToHour(breakEndString)

                    isSpecificTimeScale({
                        startTotalHour: breakStartTotalHour,
                        endTotalHour: breakEndTotalHour,
                        startMinute: breakStartMinute,
                        endMinute: breakEndMinute,
                        startHour: breakStartHour,
                        endHour: breakEndHour,
                    });

                    if (timeTablebreakAtIndex.only && timeTablebreakAtIndex.only.includes(dayCount)) {

                        if (prevDayBreak.breakIndex == null || prevDayBreak.breakIndex !== matchingBreaksIndexe) {

                            console.log('breakkkk_width')
                            console.log(timeTableBreaksCounter)
                            timeTableBreaksCounter++
                            timeTableBreaksTr[timeTableBreaksCounter] = <td className='breakempty' style={{ width: BreakTdWidth }} > {timeTablebreakAtIndex.name} </td>
                            prevDayBreak.breakIndex = matchingBreaksIndexe;


                        }

                        if (prevDayBreak.breakIndex == matchingBreaksIndexe) {
                            const width = timeTableBreaksTr[timeTableBreaksCounter].props.style;
                            timeTableBreaksTr[timeTableBreaksCounter].props.style.width = parseInt(width) + BreakTdWidth + '%'
                            console.log('styleeee______break', timeTableBreaksTr[timeTableBreaksCounter].style)
                        }


                    }





                    matchingBreaksIndexe++
                }
            }





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

                const height = (rowspan * rowHeight) * 100 / rowHeight + "%"
                console.log('height*****', height)

                let embedded_empty;

                // const type_seance = findedSeance.type_seance.label;
                // const module = findedSeance.module.label;
                // const teacher = `${findedSeance.manager.name} ${findedSeance.manager.lastname}`;
                // const salle = findedSeance.salle.label;


                let emptyTdHeight = (((findedSeance.duree / step) * rowHeight) * 100 / rowHeight) + (100 - parseInt(height)) + "%";

                // timeTableTr.push(<div className="td " key={key} style={{ height, border: borderStyle, fontSize: '13px' }} >
                //     <div className=''>
                //         <p className='fw-bold m-0'>{type_seance} {module}</p>
                //         <p className=' m-0'>{teacher}</p>
                //         <p className='fw-bold fst-italic m-0'>{salle}</p>

                //     </div>

                // </div>);
                timeTableTr.push(<TimetableTd key={key} seance={findedSeance} style={{ height, border: borderStyle, fontSize: '13px' }} />);

                if ((prevSeancesEnd[dayCount] == currentLine) && rowspan < 1) {
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
            currentSpecificTimeScale = currentSpecificTimeScale.map((timeScale, index) => {
                let timeDiff = timeScale.totalHour - hoursSteps;
                let spanTop = (timeDiff * 100) / step;
                const formatTime = dayjs()
                    .set('hour', timeScale.hours)
                    .set('minute', timeScale.minutes)
                    .set('second', 0);

                return <span key={`specificTimescale_${index}`} className='specificTimeScaleElemnt' style={{ top: spanTop + '%' }}>  {formatTime.format('HH:mm')} </span>;
            })
            console.log('currentSpecificTimeScaleeeeeeeeeeeeeee', currentSpecificTimeScale)
        }


        timeTableDatesTr.push(< div className='tr' style={{ height: rowHeight + '%' }} key={hoursSteps}><div className='td' >
            <span className='timeScaleElemnt'>  {formatTime.format('HH:mm')} </span>

            {islastLoop &&
                <span className='timeScaleElemnt timeScaleLastElemnt'>
                    {formatTime.add(stepHour, 'hour').add(stepMinute, 'minute').format('HH:mm')}
                </span>}
            {currentSpecificTimeScale}
        </div></div>);



        timeTableBody.push(<div className='tr' style={{ height: rowHeight + '%' }} key={hoursSteps}>{timeTableTr}</div>);

        if (timeTableBreaksTr.length > 0) {

            timeTableBody.push(
                <div className='breaks tr' style={{ top: baseRowTop, height: rowHeight + '%' }} key={'breaks' + hoursSteps} >
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


    return (

        <div>


            <div className='timetableHeader d-flex' >
                <table className='TimeTableTimeScale'>
                    <thead className='text-center'>
                        <tr><th>Hours</th></tr>
                    </thead>
                </table>

                <table className='timeTableDayScale'>
                    <thead className='text-center'>
                        <tr>

                            {timetableDays}

                            {/* <th>
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
                                </th> */}
                        </tr>


                    </thead>
                </table>
            </div>


            <div className='timetableContainer  d-flex' style={{height:timetableHeight+'px'}}>

                <div className='timeTableTimeScaleBody'>

                    {timeTableDatesTr}

                </div>



                <div className="myTimetable">



                    <div className="tbody" style={{ border: borderStyle }} >
                        <div className='innerBorder position-absolute h-100 w-100' style={{ border: borderStyle }}>

                        </div>

                        {timeTableBody}
                    </div>

                </div>
            </div>


        </div>


    )
}

export default Timetable