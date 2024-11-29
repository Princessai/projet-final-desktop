import React, { useEffect, useRef, useState } from 'react';
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

function roundUpToStep(num, step = 0.25) {
    return Math.ceil(num / step) * step;
}


let tdRefCount = 0;



function TimetableBreakTd({ breaK, style, onCreate, columnNumber, rowNumber }) {

    const tdRef = useRef(null);




    useEffect(function () {
        if (onCreate) {
            onCreate(tdRef.current, { columnNumber, rowNumber })

        }

    }, [])

    return <div className='td td_break' ref={tdRef} style={style} > {breaK.name} </div>

}








function TimetableTd({ seance, style, onCreate, hoursSteps, columnNumber, rowNumber, tdNumber, }) {

    const tdRef = useRef(null);

    const hasRunOnce = useRef(false);

    const tdNumberRef = useRef(0);

    if (hasRunOnce.current == false) {
        tdRefCount++;
        hasRunOnce.current = true;
        tdNumberRef.current = tdRefCount;

    }


    useEffect(function () {

        onCreate(tdRef.current, hoursSteps, columnNumber, rowNumber, tdNumberRef.current)

    })
    const type_seance = seance.type_seance.label;
    const module = seance.module.label;
    const teacher = `${seance.manager.name} ${seance.manager.lastname}`;
    const salle = seance.salle.label;

    return <div className="td " ref={tdRef} style={style} >
        <div className=''>
            <p className='fw-bold m-0'>{type_seance} {module}</p>
            <p className=' m-0'>{teacher}</p>
            <p className='fw-bold fst-italic m-0'>{salle}</p>

        </div>

    </div>
}







function Timetable({ TimetableData, border = 10, height = 600, timeScaleWidth = '10%' }) {
    const tdRefsobj = {};
    const modifiedTrsObj = {};
    let prevHeightDiff = 0;
    let prevRowNumber = null;
    let lastRowNumber;
    let tdRefsRow = [];
    let breaksRefs = [];

    console.log('timetable  rerenderr');


    useEffect(function () {
        console.log('full ___timetable  in domm')
        console.log('tdRefsobj', tdRefsobj)
        console.log('modifiedTrsObj', modifiedTrsObj)
        console.log('breaksRefs', breaksRefs)

        Object.keys(tdRefsobj).forEach((key) => {
            const tdsArr = tdRefsobj[key]
            const currentRow = key;
            tdsArr.forEach((tdObj) => {
                let tdRowSpan = currentRow
                let spanAmount = tdObj.rowspan
                let heightIncrease = 0;
                while (spanAmount >= 1) {
                    tdRowSpan++
                    console.log(tdRowSpan,)
                    heightIncrease += modifiedTrsObj[tdRowSpan]
                    console.log(modifiedTrsObj[tdRowSpan])
                    console.log(heightIncrease)

                    spanAmount--;

                }

                console.log(tdObj.ref)
                const tdRef = tdObj.ref;
                tdRef.style.height = tdRef.offsetHeight + heightIncrease + 'px';

                // currentRow

                console.log(tdObj)
                console.log(spanAmount)
            })

        })

        breaksRefs.forEach((breakobj) => {
            const breakRef = breakobj.ref;
            let rowNumber = breakobj.rowNumber;
            let rowspan = breakobj.rowspan;
            const topIncrease = modifiedTrsObj[rowNumber];
            if (topIncrease) {
                breakRef.style.top = parseInt(breakRef.style.top) + topIncrease + 'px';
            }
            if (rowspan > 0) {
                let heightIncrease = 0;
                while (rowspan > 0) {

                    rowNumber++
                    const increaseAmount = modifiedTrsObj[rowNumber];
                    if (increaseAmount === undefined) break;
                    heightIncrease += increaseAmount;
                    rowspan--
                }

                if (heightIncrease > 0) {
                    breakRef.style.height = breakRef.offsetHeight + heightIncrease + 'px';
                }

            }


            console.log('break_loop', breakobj, breakRef, rowNumber, rowspan);
        });


        return () => {
            tdRefCount = 0

        }
    })

    const [borderWidth, setBorderWidth] = useState(border);
    const timetableHeight = height;
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
            seancesByDayArr[dayIndex] = [seance];
        }

    })



    const maxDay = 4;

    const dayStartHourString = 9;
    const dayEndHourString = 17;
    const { totalHour: dayStartHour } = convertTimeStringToHour(dayStartHourString)
    const { totalHour: dayEndHour } = convertTimeStringToHour(dayEndHourString)
    const rowHeight = (timetableHeight - borderWidth) / ((dayEndHour - dayStartHour) / step);
    let timescaleWidthInPercentage = false;

    if (timeScaleWidth.includes('%')) {
        console.log('include%')
        timescaleWidthInPercentage = true
        timeScaleWidth = parseInt(timeScaleWidth)
        // const availableSpacepercentage = 100 - timeScaleWidth;
        // console.log('available_space_____', availableSpacepercentage)
    } else {
        // const availableSpacepercentage = `calc(${})`
    }
    let tdWidth;
    let tdWidthUnit
    let  availableSpace
    if (timescaleWidthInPercentage) {
        console.log('tdWidth declared')
         tdWidth = (100 - timeScaleWidth ) / (maxDay + 1);
         tdWidthUnit=tdWidth+'%';
         availableSpace = 100 - timeScaleWidth+'%';
    }

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

        const islastLoop = ((hoursSteps + step) >= dayEndHour) ? true : false;
        if (islastLoop) {
            lastRowNumber = hoursStepsCounter
        }


        const hoursStepsEnd = hoursSteps + step



        let isBreakRowFull = false;
        const matchingBreaksIndexes = [];
        // let baseRowTop = rowHeight * hoursStepsCounter + 'px';

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
                    const breakDuration = timesStringdiffInHour(timeTablebreak.debut, timeTablebreak.fin);
                    // let breakHeight = (breakDuration * 100) + '%';
                    const breakHeight = (breakDuration * rowHeight) / step
                    // breakHeight = ((100 * breakHeight) / rowHeight) + '%';



                    console.log('difffff+++++++', breakHeight);
                    console.log('break duration', breakDuration

                    )
                    const timetableBreakTdTop = (breakStartTotalHour - hoursSteps) * rowHeight + 'px';

                    const breaksTdStyle = {
                        width: "100%",
                        height: breakHeight,
                        top: timetableBreakTdTop,

                    };

                    // const breakStartInhourSteps = breakStartTotalHour - dayStartHour;
                    // const breakEndInhourSteps = breakEndTotalHour - dayEndHour;

                    // if (breakStartInhourSteps != 0 && !Number.isInteger(breakStartInhourSteps / step)) {
                    //     if (specificTimeScale.length == 0 || specificTimeScale.indexOf((timeScale) => timeScale.totalHour == breakStartTotalHour) == -1) {

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

                    function onBreakcreate(breakRef, props) {
                        const { columnNumber, rowNumber } = props;

                        // const rowspan = breakDuration / step;
                        const rowspanRounded = roundUpToStep(breakDuration, step) / step;
                        console.log('break___ref----', rowNumber)
                        // console.log('rowspan',rowspan)
                        // console.log('rowspanRounded',rowspanRounded)
                        // console.log(breakRef)

                        console.log('break duration', breakDuration)
                        console.log('modified tr', JSON.stringify(modifiedTrsObj))
                        breaksRefs.push({ rowNumber, ref: breakRef, rowspan: rowspanRounded - 1 })



                    }

                    // timeTableBreaksTr.push(<div className='td td_break'  style={breaksTdStyle} > {timeTablebreak.name} </div>);
                    timeTableBreaksTr.push(<TimetableBreakTd key={breakKey} breaK={timeTablebreak} style={breaksTdStyle} onCreate={onBreakcreate} rowNumber={hoursStepsCounter} />);
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
                            timeTableBreaksTr[timeTableBreaksCounter] = <td className='breakempty' style={{ width: tdWidth }} > {timeTablebreakAtIndex.name} </td>
                            prevDayBreak.breakIndex = matchingBreaksIndexe;


                        }

                        if (prevDayBreak.breakIndex == matchingBreaksIndexe) {
                            const width = timeTableBreaksTr[timeTableBreaksCounter].props.style;
                            timeTableBreaksTr[timeTableBreaksCounter].props.style.width = parseInt(width) + tdWidth + '%'
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

                const rowspan = findedSeance.duree_raw / step;
                const rowspanRounded = findedSeance.duree / step;


                const timetableTdStyle = { rowspan };
                console.log('rowspannnnn________', rowspan, findedSeance)
                console.log('seance_heure_debut', findedSeance.heure_debut)
                console.log('seance_end', currentLine + rowspan)
                let tdHeight;
                if (rowspan <= 1) {
                    const rowHeightPercent = 100 / ((dayEndHour - dayStartHour) / step);
                    tdHeight = (rowspan * rowHeightPercent) * 100 / rowHeightPercent + "%"
                } else {
                    tdHeight = (rowspan * rowHeight) + 'px'

                }

                console.log('height*****', height)

                let embedded_empty;

                // const type_seance = findedSeance.type_seance.label;
                // const module = findedSeance.module.label;
                // const teacher = `${findedSeance.manager.name} ${findedSeance.manager.lastname}`;
                // const salle = findedSeance.salle.label;



                // timeTableTr.push(<div className="td " key={key} style={{ height, border: borderStyle, fontSize: '13px' }} >
                //     <div className=''>
                //         <p className='fw-bold m-0'>{type_seance} {module}</p>
                //         <p className=' m-0'>{teacher}</p>
                //         <p className='fw-bold fst-italic m-0'>{salle}</p>

                //     </div>

                // </div>);
                function onTdCreate(tdRef, hoursSteps, columnNumber, rowNumber, tdNumber) {

                    console.log('______td created_______')

                    console.log('rownumber_', rowNumber)
                    console.log('column number__', columnNumber);
                    console.log('last row number___', lastRowNumber);
                    console.log('tdRefCount_____', tdRefCount);
                    if (rowspan > 1) {
                        const spanAmount = rowspanRounded - 1;
                        if (!tdRefsobj[rowNumber]) {
                            tdRefsobj[rowNumber] = [];
                        }

                        tdRefsobj[rowNumber].push({ ref: tdRef, rowspan: spanAmount });
                    }

                    const isOverflowingY = tdRef.scrollHeight > tdRef.clientHeight;

                    if (prevRowNumber != rowNumber) {

                        let oldTrRef = null;
                        tdRefsRow.forEach(tdRef => {
                            if (oldTrRef === null) {
                                oldTrRef = tdRef.parentElement;
                            }
                            tdRef.style.height = tdRef.offsetHeight + prevHeightDiff + 'px'
                        });
                        if (oldTrRef !== null && prevHeightDiff != 0) {

                            oldTrRef.style.height = oldTrRef.offsetHeight + prevHeightDiff + 'px';
                            modifiedTrsObj[prevRowNumber] = prevHeightDiff;

                        }

                        tdRefsRow = [];
                        prevHeightDiff = 0;
                        prevRowNumber = rowNumber;

                    }

                    tdRefsRow.push(tdRef);

                    const trRef = tdRef.parentElement;
                    if (isOverflowingY) {
                        console.log('overflow______')




                        console.log(tdRef, 'scrollHeight', tdRef.scrollHeight, 'tdRef.offsetHeight', tdRef.offsetHeight)
                        const childHeight = tdRef.firstElementChild.offsetHeight;
                        const tdRefHeight = tdRef.offsetHeight

                        const trRefHeight = trRef.offsetHeight;
                        let heightDiff = 0;
                        heightDiff = childHeight - tdRefHeight;



                        if (heightDiff > prevHeightDiff) {
                            prevHeightDiff = heightDiff;
                        }

                        console.log('heightdiff', heightDiff, 'childHeight:', childHeight, 'tdRefHeight:', tdRefHeight);



                        // if (columnNumber == maxDay) {
                        //     tdRefsRow.forEach(tdRef => {

                        //         tdRef.style.height = tdRef.offsetHeight + prevHeightDiff + 'px'
                        //         // console.log('clientHeight:', tdRef.offsetHeight, 'tdrefff:', tdRef);
                        //     });
                        //     trRef.style.height = trRef.offsetHeight + prevHeightDiff + 'px';


                        // }



                        console.log('___tr final height___', tdRef.parentElement.offsetHeight)
                        // tdRef.parentElement.style.height=tdRef.parentElement.clientHeight+heightDiff+'px'
                        const overflowYAmount = isOverflowingY ? tdRef.scrollHeight - tdRef.clientHeight : 0;
                        console.log('overflow amount ', overflowYAmount,)



                    }



                    if (rowNumber == lastRowNumber && tdNumber == tdRefCount && prevHeightDiff != 0) {
                        tdRefsRow.forEach(tdRef => {

                            tdRef.style.height = tdRef.offsetHeight + prevHeightDiff + 'px'
                        });
                        trRef.style.height = trRef.offsetHeight + prevHeightDiff + 'px';
                        modifiedTrsObj[rowNumber] = prevHeightDiff;

                    }


                }
                const timeTableTdStyle = { height: tdHeight, border: borderStyle, fontSize: '13px', maxWidth: tdWidth + '%' }


                timeTableTr.push(<TimetableTd key={key} seance={findedSeance} style={timeTableTdStyle} onCreate={onTdCreate} rowspan={rowspan} hoursSteps={hoursSteps} columnNumber={dayCount} rowNumber={hoursStepsCounter} tdNumber={tdRefCount} />);
                if ((prevSeancesEnd[dayCount] == currentLine) && rowspan < 1) {

                    const emptyTdStyle = { position: 'absolute', width: tdWidth + "%", border: borderStyle, left: tdWidth * dayCount + "%", height: "100%", maxWidth: tdWidth + '%' };

                    timeTableTr.push(<div key={"empty_td" + key} className="td empty_td" style={emptyTdStyle}>test  </div>);


                }
                prevSeancesEnd[dayCount] = currentLine + rowspan;

            } else {
                // if ((prevSeancesEnd[dayCount] <= currentLine)) {
                const emptyTdStyle = { border: borderStyle, maxWidth: tdWidth + '%' };
                timeTableTr.push(<div className="td empty_td" key={key} style={emptyTdStyle}></div>);
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


        timeTableDatesTr.push(< div className='tr' style={{ height: rowHeight + 'px' }} key={hoursSteps}><div className='td' >
            <span className='timeScaleElemnt'>  {formatTime.format('HH:mm')} </span>
            {currentSpecificTimeScale}

            {islastLoop &&
                <span className='timeScaleElemnt timeScaleLastElemnt'>
                    {formatTime.add(stepHour, 'hour').add(stepMinute, 'minute').format('HH:mm')}
                </span>}


        </div></div>);

        if (timeTableBreaksTr.length > 0) {

            timeTableTr.push(
                <div className='breaks tr' style={{ height: "100%" }} key={'breaks' + hoursSteps} >

                    {timeTableBreaksTr}



                </div>
            );
        }

        timeTableBody.push(<div className='tr' style={{ height: rowHeight + 'px' }} key={hoursSteps}>{timeTableTr}</div>);

        // if (timeTableBreaksTr.length > 0) {

        //     timeTableBody.push(
        //         <div className='breaks tr' style={{ top: baseRowTop, height: rowHeight + 'px' }} key={'breaks' + hoursSteps} >
        //             <div className='breaksInnerBorder'>
        //                 {timeTableBreaksTr}

        //             </div>

        //         </div>
        //     );
        // }


        hoursSteps += step;
        hoursStepsCounter++;
    }


    const { user, isUserAuthenticated } = useAuth();


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


            <div className='timetableContainer  d-flex' style={{ height: timetableHeight + 'px' }}>

                <div className='timeTableTimeScaleBody'>

                    {timeTableDatesTr}

                </div>



                <div className="myTimetable">



                    <div className="tbody" style={{ border: borderStyle }} >

                        <div className='outerBorder  position-absolute h-100 w-100' style={{
                            border: borderStyle, top: `-${borderWidth / 2}px`,
                            left: `-${borderWidth / 2}px`,
                            boxSizing: "content-box",
                        }}>
                        </div>

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