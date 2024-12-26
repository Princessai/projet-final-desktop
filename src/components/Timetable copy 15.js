import React, { useEffect, useRef, useState, useMemo } from "react";
// import './Timetable.css';
import classes from "./Timetable.module.css";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

import { useAxios } from "../Providers/AxiosProvider";
import { useAuth } from "../Providers/AuthProvider";
import { FallbackContent } from "./FallbackContent";
import { useParams } from "react-router-dom";
import { throttle, debounce } from "../../utilities/debounce_throttle.js";


const timetableMode = {
  read: "read",
  edit: "edit",
};
dayjs.extend(isoWeek);
let isWaitingGlobal = true;
let currentTimetableMode;

function convertTimeStringToHour(timeString) {

  let timeStringHour
  let timeStringMinute
  let timeStringMinuteTohour
  let totalHour

  if (dayjs.isDayjs(timeString)) {
    timeStringHour = timeString.hour()
    timeStringMinute = timeString.minute()
    timeStringMinuteTohour = timeStringMinute / 60
    totalHour = timeStringHour + (timeStringMinuteTohour)

  } else {
    const timeStringValues = String(timeString).split(":");

    timeStringHour = parseFloat(timeStringValues[0] ?? 0);
    timeStringMinute = parseFloat(timeStringValues[1] ?? 0);
    timeStringMinuteTohour = timeStringMinute / 60;
    totalHour = timeStringMinuteTohour + timeStringHour;
  }

  return {
    timeStringMinute,
    timeStringMinuteTohour,
    timeStringHour,
    totalHour,
  };
}

function timesStringdiffInHour(timeString1, timeString2, abs = true) {
  timeString1 = convertTimeStringToHour(timeString1).totalHour;
  timeString2 = convertTimeStringToHour(timeString2).totalHour;
  const diff = timeString1 - timeString2;
  if (!abs) return diff
  return Math.abs(diff);
}

function smallestMultiplicativeFactor(step, minStep) {
  let divisor = 1;
  let multiplicativeFactor;
  if (!minStep) {
    return step
  }
  while (true) {
    multiplicativeFactor = (step / divisor);
    if (multiplicativeFactor <= minStep) {
      return multiplicativeFactor;
    }

    divisor++
  }

}

function roundUpToStep(num, step = 0.25) {
  return Math.ceil(num / step) * step;
}

function extractTdData(event, td) {
  const dataset = td.dataset;
  const col = dataset.col;
  const row = dataset.row;

  const index = dataset.index;
  return { index, row, col };
}
function TimetableBreakTd(props) {
  const {
    currentBreak,
    style,
    onCreate,
    columnNumber,
    rowNumber,
  } = props
  const tdRef = useRef(null);
  const hasRunOnce = useRef(false);
  useEffect(function () {

    if (onCreate) {
      onCreate(tdRef.current, { ...props, hasRunOnce });
    }
    hasRunOnce.current = true;

  });

  return (
    <div
      className={`${classes.td} td_break`}
      ref={tdRef}
      style={style}
      data-col={columnNumber}
      data-row={rowNumber}
      data-sessiontype="breaks"
    >
      <div className={`${classes.td_break_inner_container}`}>
        {/*(currentTimetableMode == timetableMode.edit) 
           && <svg className='deleteTimetableElement' xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59L7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12L5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4" /></svg>*/}
        <span style={{ margin: "auto 0" }}> {currentBreak.name} </span>
      </div>
    </div>
  );
}

function TimetableTd(props) {
  const {
    seance,
    style,
    onCreate,
    hoursSteps,
    columnNumber,
    rowNumber,
    tdNumber,
    index,
  } = props;
  console.log("td _rerender___");
  const tdRef = useRef(null);

  const hasRunOnce = useRef(false);

  useEffect(function () {
    // console.log("tdNumber", tdNumber, "tdRef.current", tdRef.current);
    onCreate(tdRef.current, {
      ...props,
      hasRunOnce: hasRunOnce.current,

    });
    hasRunOnce.current = true;
  });
  const type_seance = seance.type_seance.label;
  const module = seance.module.label;
  const teacher = `${seance.manager.name} ${seance.manager.lastname}`;
  const salle = seance.salle.label;
  const seanceStart = dayjs(seance.heure_debut).format('HH:mm')
  const seanceEnd = dayjs(seance.heure_fin).format('HH:mm')

  return (
    <div
      className={`${classes.td} ${classes.timetable_td}`}
      ref={tdRef}
      style={style}
      data-col={columnNumber}
      data-row={rowNumber}
      data-index={index}
      data-sessiontype="course"
    >
      <div>
        <p className=" m-0">{seanceStart}-{seanceEnd}</p>

        <p className="fw-bold m-0">
          {type_seance} {module}
        </p>
        <p className=" m-0">{teacher}</p>
        <p className="fw-bold fst-italic m-0">{salle}</p>
      </div>
    </div>
  );
}



function Timetable(props) {
  const {
    TimetableData,
    border = 10,
    height = 600,
    timeScaleWidth = "60px",
    onTdClick,
    timetableStart,
    timetableEnd,
    mode = timetableMode.edit,

  } = props

  let timetableStep = props.timetableStep ? props.timetableStep : '00:45';


  const tdRefsobj = {};
  const modifiedTrsObj = {};
  let prevHeightDiff = 0;
  let prevBreakHeightDiff = 0;
  let prevRowNumber = null;
  let lastRowNumber;
  let tdCount = 0;
  let tdRefsRow = [];
  let breaksRefs = [];
  let breaksRefsRow = [];
  let timeScaleOverflow = [];
  const [reloadContent, setReloadContent] = useState(false);
  currentTimetableMode = mode;
  const minStep = useRef(null);

  function onBreakcreate(breakRef, props) {
    const { columnNumber, rowNumber, currentBreak, style, } = props;


    const breakDuration = timesStringdiffInHour(
      currentBreak.debut,
      currentBreak.fin
    );
    console.log('breakDuration', breakDuration / step, breakDuration)
    const rowspanRounded = roundUpToStep(breakDuration, step) / step;



    breaksRefs.push({
      rowNumber,
      ref: breakRef,
      rowspan: rowspanRounded - 1,
      style,
    });

  }

  console.log("timetable  rerenderr");
  useEffect(() => {
    const onScreenResize = throttle(function onScreenResize() {
      console.log("throttle___");

      isWaitingGlobal = false;
      setReloadContent((oldValue) => !oldValue);
    }, 700);

    const onScreenResizeDebounced = debounce(function () {
      console.log("debounce___");
      isWaitingGlobal = false;
      setReloadContent((oldValue) => !oldValue);
    });

    const onScreenResizeDecorator = () => {
      isWaitingGlobal = true;
      onScreenResize();
      if (isWaitingGlobal) {
        onScreenResizeDebounced();
      }
    };

    window.addEventListener("resize", onScreenResizeDecorator);

    return () => {
      window.removeEventListener("resize", onScreenResizeDecorator);

      currentTimetableMode = null;
    };
  }, []);

  useEffect(function () {
    console.log("full ___timetable  in domm");
    console.log('tdRefsobj', tdRefsobj)
    console.log('modifiedTrsObj', modifiedTrsObj)
    console.log('breaksRefs', breaksRefs)

    Object.keys(tdRefsobj).forEach((key) => {
      const tdsArr = tdRefsobj[key];
      const currentRow = key;
      tdsArr.forEach((tdObj) => {
        let tdRowSpan = currentRow;
        let spanAmount = tdObj.rowspan;
        let heightIncrease = 0;
        console.log('spanAmount', spanAmount)
        while (spanAmount > 0) {
          tdRowSpan++;
          if (modifiedTrsObj[tdRowSpan]) {
            heightIncrease += modifiedTrsObj[tdRowSpan];
          }

          spanAmount--;
        }

        const tdRef = tdObj.ref;
        if (heightIncrease > 0) {
          tdRef.style.height = tdRef.offsetHeight + heightIncrease + "px";
        }
      });
    });

    breaksRefs.forEach((breakobj) => {
      const breakRef = breakobj.ref;
      let rowNumber = breakobj.rowNumber;
      let rowspan = breakobj.rowspan;
      const style = breakobj.style;

      const topIncrease = modifiedTrsObj[rowNumber];

      if (breakRef.style.top != style.top) {
        breakRef.style.top = style.top;
      }

      /*
        repositionner la pose lorsque en cas de redimensinnement de la ligne au dessus
      */

      if (topIncrease) {
        breakRef.style.top = parseFloat(breakRef.style.top) + topIncrease + "px";
      }

      // if (rowspan > 0) {
      //   let heightIncrease = 0;
      //   while (rowspan > 0) {
      //     rowNumber++;
      //     const increaseAmount = modifiedTrsObj[rowNumber];
      //     if (increaseAmount !== undefined) {
      //       heightIncrease += increaseAmount;

      //     }
      //     rowspan--;
      //   }

      //   if (heightIncrease > 0) {
      //     breakRef.style.height = breakRef.offsetHeight + heightIncrease + "px";
      //   }
      // }
    });

    console.log("rerender_end_____");
  });

  const [borderWidth, setBorderWidth] = useState(border);
  const timetableHeight = height;
  const borderStyle = `solid ${borderWidth / 2}px black`;

  const seances = TimetableData.seances;




  const seancesByDayArr = useMemo(() => {
    console.log('seancesByDayArr')


    const seancesByDayArr = [];
    seances.forEach(function (seance, index) {
      const heure_debut = dayjs(seance.heure_debut);
      if (minStep.current == null) {
        minStep.current = seance.duree;
      }// Get the current date
      if (minStep.current > seance.duree) {
        minStep.current = seance.duree;
      }
      const dayOfWeek = heure_debut.day();

      const dayIndex = dayOfWeek - 1;

      const seanceObj = { seance, index };
      if (seancesByDayArr[dayIndex]) {
        seancesByDayArr[dayIndex].push(seanceObj);
      } else {
        seancesByDayArr[dayIndex] = [seanceObj];
      }
    });
    return seancesByDayArr;

  }, [seances]);

  const { totalHour: timetableStepInHours } = convertTimeStringToHour(timetableStep);


  if (minStep.current == !null && timetableStepInHours > minStep.current) {
    timetableStep = minStep.current;
  }
  const {
    timeStringHour: stepHour,
    timeStringMinute: stepMinute,
    timeStringMinuteTohour,
  } = convertTimeStringToHour(timetableStep);
  const step = stepHour + timeStringMinuteTohour;






  const maxDay = (timetableEnd !== null || timetableStart !== null) ? dayjs(timetableEnd).diff(timetableStart, "day") : 4;


  const dayStartHourString = 9;
  const dayEndHourString = 17;
  const { totalHour: dayStartHour } =
    convertTimeStringToHour(dayStartHourString);
  const { totalHour: dayEndHour } = convertTimeStringToHour(dayEndHourString);
  const rowHeight = (timetableHeight - borderWidth) / Math.round(((dayEndHour - dayStartHour) / step));
  let timescaleWidthInPercentage = false;
  let timeScaleWidthUnit;
  timeScaleWidthUnit = timeScaleWidth;

  if (timeScaleWidth.includes("%")) {
    timescaleWidthInPercentage = true;
    timeScaleWidth = parseFloat(timeScaleWidth);
  }

  let availableSpace;
  const tdWidth = 100 / (maxDay + 1);
  const tdWidthUnit = tdWidth + "%";
  if (timescaleWidthInPercentage) {
    availableSpace = 100 - timeScaleWidth + "%";
  } else {
    availableSpace = `calc(100% - ${timeScaleWidth})`;
  }

  const weekStart =
    timetableStart ??
    dayjs().startOf("isoWeek").startOf("day").format("YYYY-MM-DD HH:mm:ss");

  const weekEnd = timetableEnd;
  const timeTableBody = [];
  let hoursStepsCounter = 0;
  let timetableStartDayjs;

  timetableStartDayjs = dayjs(weekStart).add(dayStartHour, "hour");

  let formatTime;
  const prevSeancesEnd = [];
  const specificTimeScale = [];
  const timetableALLBreaks = TimetableData.pauses;

  const date_debut = dayjs(weekStart).format("DD MMMM YYYY");
  const date_fin = dayjs(weekEnd).format("DD MMMM YYYY");

  let timetableDateDebut;

  timetableDateDebut = dayjs(weekStart);

  const timetableDays = [];
  const thWidth = 100 / (maxDay + 1);
  for (let dayCount = 0; dayCount <= maxDay;) {
    const currentTimetableDay = timetableDateDebut.add(dayCount, "day");

    timetableDays.push(
      <div key={dayCount} style={{ flexGrow: 1, minWidth: thWidth + "%" }}>
        {currentTimetableDay.format("dddd")}

        {timetableEnd && timetableStart && (
          <div>{currentTimetableDay.format("DD/MM")}</div>
        )}
      </div>
    );

    dayCount++;
  }

  for (let hoursSteps = dayStartHour; hoursSteps < dayEndHour;) {
    const timeTableTr = [];
    const timeTableBreaksTr = [];
    let currentSpecificTimeScale = [];

    function isSpecificTimeScale(timeString) {

      console.log('totalHour__***', timeString)
      const { totalHour: totalInHour } = convertTimeStringToHour(timeString);

      if (totalInHour == dayStartHour) return;
      if (totalInHour == dayEndHour) return;
      const seanceOffsetInhour = totalInHour - dayStartHour;

      if ((!Number.isInteger(seanceOffsetInhour / timetableStepInHours))
      ) {
        if (
          specificTimeScale.length == 0 || !specificTimeScale.includes(timeString)

        ) {

          currentSpecificTimeScale.push(timeString);
          specificTimeScale.push(timeString);
        }
      }


    }



    if (hoursSteps !== dayStartHour) {
      formatTime = formatTime.add(stepHour, "hour").add(stepMinute, "minute");
    } else {
      formatTime = timetableStartDayjs;
    }

    const islastLoop = hoursSteps + step >= dayEndHour ? true : false;
    if (islastLoop) {
      lastRowNumber = hoursStepsCounter;
    }

    const hoursStepsEnd = hoursSteps + step;

    let isBreakRowFull = false;
    const matchingBreaksIndexes = [];
    let timeTableBreaksCounter = -1;
    for (let breakIndex = 0; breakIndex < timetableALLBreaks.length;) {
      const timeTablebreak = timetableALLBreaks[breakIndex];



      const {
        totalHour: breakStartTotalHour,

      } = convertTimeStringToHour(timeTablebreak.debut);




      if (
        breakStartTotalHour == hoursSteps ||
        (breakStartTotalHour > hoursSteps &&
          breakStartTotalHour < hoursStepsEnd)
      ) {
        console.log(
          "breakfinded+++++++",
          breakStartTotalHour,
          hoursSteps,
          hoursStepsEnd
        );

        const breakKey = "fullrow" + "_" + hoursStepsCounter + "_" + breakIndex;
        const breakDuration = timesStringdiffInHour(
          timeTablebreak.debut,
          timeTablebreak.fin
        );

        const breakHeight = (breakDuration * rowHeight) / step + "px";

        const breakTop = ((breakStartTotalHour - hoursSteps) * rowHeight) / step + "px";


        if (!timeTablebreak.only) {
          // isBreakRowFull = true;

          if (mode == timetableMode.read) {


            timeTableBreaksCounter++

            const breaksTdStyle = {
              width: "100%",
              height: breakHeight,
              top: breakTop,
            };

            timeTableBreaksTr.push(
              <TimetableBreakTd
                key={breakKey}
                currentBreak={timeTablebreak}
                style={breaksTdStyle}
                onCreate={onBreakcreate}
                data-index={breakIndex}
                rowNumber={hoursStepsCounter}
              />
            );
          }
          isSpecificTimeScale(
            timeTablebreak.debut,

          )
          isSpecificTimeScale(
            timeTablebreak.fin,

          )


          if (mode == timetableMode.edit) {
            matchingBreaksIndexes.push({ breakIndex, breakHeight, breakTop, isBreakRowFull: true });
          }

        } else {

          matchingBreaksIndexes.push({ breakIndex, breakHeight, breakTop, isBreakRowFull: false });

        }
      }

      breakIndex++;
    }



    const prevDayBreak = [];
    // console.log('seances+++', dayStepStart.format('YYYY-MM-DD HH:mm:ss'), dayStepEnd.format('YYYY-MM-DD HH:mm:ss'));




    timeScaleOverflow = timeScaleOverflow.filter((timeScale) => {
      const { totalHour: timeScaleInHours } = convertTimeStringToHour(timeScale)

      if ((timeScaleInHours >= hoursSteps && timeScaleInHours <= hoursStepsEnd)) {


        isSpecificTimeScale(timeScale)

        return false;
      }
      return true;
    });

    const rowSeanceStartArr = [];

    for (let dayCount = 0; dayCount <= maxDay;) {
      const key = `day_${dayCount}_${hoursSteps}`;





      const dayStepStart = timetableStartDayjs
        .add(dayCount, "day")
        .add(stepHour * hoursStepsCounter, "hour")
        .add(stepMinute * hoursStepsCounter, "minute");

      const dayStepEnd = dayStepStart
        .add(stepHour, "hour")
        .add(stepMinute, "minute")

      const daySeances = seancesByDayArr[dayCount] ?? [];



      const findedseanceObjArr = daySeances.filter(function (seanceObj) {
        const { seance, index } = seanceObj;
        const seanceStart = dayjs(seance.heure_debut);

        return (seanceStart.isSame(dayStepStart) || (seanceStart.isAfter(dayStepStart) && seanceStart.isBefore(dayStepEnd)));

      });

      for (
        let matchingBreaksIndexe = 0;
        matchingBreaksIndexe < matchingBreaksIndexes.length;

      ) {

        const breakKey = key + "_" + matchingBreaksIndexe;
        const currentMatchingBreaksIndexe =
          matchingBreaksIndexes[matchingBreaksIndexe];
        const breakIndex = currentMatchingBreaksIndexe.breakIndex;
        const timeTablebreakAtIndex = timetableALLBreaks[breakIndex];
        const top = currentMatchingBreaksIndexe.breakTop;
        const height = currentMatchingBreaksIndexe.breakHeight;

        const currentDayBreak = prevDayBreak[matchingBreaksIndexe];

        if (
          mode == timetableMode.read &&
          timeTablebreakAtIndex.only &&
          timeTablebreakAtIndex.only.includes(dayCount)
        ) {
          let prevBreakDayCount = null;

          if (currentDayBreak && currentDayBreak.prevDay) {
            prevBreakDayCount = currentDayBreak.prevDay;
          }


          const prevDaycount = dayCount === 0 ? 0 : dayCount - 1;

          if (
            prevBreakDayCount == null ||
            prevBreakDayCount !== prevDaycount
          ) {

            timeTableBreaksCounter++;

            timeTableBreaksTr[timeTableBreaksCounter] = (
              <TimetableBreakTd
                currentBreak={timeTablebreakAtIndex}
                style={{ width: tdWidthUnit }}
                onCreate={onBreakcreate}
                columnNumber={dayCount}
                rowNumber={hoursStepsCounter}
              />
            );

            prevDayBreak[matchingBreaksIndexe] = { prevDay: dayCount, breakComponentIndex: timeTableBreaksCounter }

          }

          if (prevBreakDayCount == prevDaycount) {

            currentDayBreak.prevDay = dayCount;

            const width =
              timeTableBreaksTr[currentDayBreak.breakComponentIndex].props.style.width;
            timeTableBreaksTr[currentDayBreak.breakComponentIndex].props.style.width =
              parseFloat(width) + tdWidth + "%";
          }
        }



        if (mode == timetableMode.edit) {
          const borderStyle = `solid 0px black`;
          const breakTdStyle = {
            width: tdWidthUnit,
            left: dayCount * tdWidth + "%",
            top,
            height,
            border: borderStyle,
            borderLeftWidth: borderWidth / 2 + "px",
            borderRightWidth: borderWidth / 2 + "px",
          };
          let pushBreak = false;

          if (
            timeTablebreakAtIndex.only &&
            timeTablebreakAtIndex.only.includes(dayCount)
          ) {
            pushBreak = true;
          }

          if (!timeTablebreakAtIndex.only) {

            pushBreak = true;
          }

          if (pushBreak) {
            timeTableBreaksTr.push(
              <TimetableBreakTd
                key={breakKey}
                currentBreak={timeTablebreakAtIndex}
                style={breakTdStyle}
                onCreate={onBreakcreate}
                columnNumber={dayCount}
                rowNumber={hoursStepsCounter}
                mode={mode}
              />
            );
          }
        }

        matchingBreaksIndexe++;
      }




      const currentLine = hoursStepsCounter + 1;
      if (findedseanceObjArr.length > 0) {

        const tdContainer = [];
        findedseanceObjArr.forEach((findedseanceObj, index) => {

          console.log('findedseanceObj++')
          const { seance: findedSeance, index: findedSeanceIndex } =
            findedseanceObj;

          const seanceStart = dayjs(findedSeance.heure_debut);
          const seanceEnd = dayjs(findedSeance.heure_fin);

          rowSeanceStartArr.push(seanceStart.format('HH:mm'))

          let tdTimeOverFlow = dayStepEnd.diff(seanceEnd, 'hours', true) / step;



          const {
            totalHour: seanceStartTotalHour,
          
          } = convertTimeStringToHour(seanceStart);

      

          console.log('findedSeance+++', findedSeance, seanceStart.format("HH:mm"), seanceEnd.format("HH:mm"))
          isSpecificTimeScale(
            seanceStart.format("HH:mm"),

          )

          if (tdTimeOverFlow < 0) {
            const seanceEndTimeString = seanceEnd.format("HH:mm");

            if (!timeScaleOverflow.includes(seanceEndTimeString)) {
              timeScaleOverflow.push(seanceEndTimeString)
            }

          } else {
            isSpecificTimeScale(
              seanceEnd.format("HH:mm"),

            )

          }



          const rowspan = findedSeance.duree_raw / step;
          const rowspanRounded = findedSeance.duree / step;


          const isEndingAtBreak = timetableALLBreaks.findIndex((timetableBreak) => {


            return timetableBreak.debut == seanceEnd.hour() + ':' + seanceEnd.minute()
          }) !== -1;


          let tdHeight;

          tdHeight = rowspan * rowHeight + "px";
          // const seanceStart = dayjs(findedSeance.heure_debut);
          // const seanceStartTotalHour = seanceStart.hour() + (seanceStart.minute() / 60)
          const tdTop = ((seanceStartTotalHour - hoursSteps) * rowHeight) / step + "px";
          // console.log('tdTooooop', tdTop, 'step', step, 'rowHeight', rowHeight, 'seanceStartTotalHour', seanceStartTotalHour, 'hoursStep', hoursSteps);

          const timeTableTdStyle = {
            height: tdHeight,
            border: borderStyle,
            fontSize: "13px",
            maxWidth: (findedseanceObjArr.length > 1) ? null : tdWidthUnit,
            top: tdTop
          };
          const timeTableKey = 'TimetableTd ' + index + key

          function onTdCreate(tdRef, props) {
            const { hoursSteps, columnNumber, rowNumber, tdNumber, hasRunOnce, seance } =
              props;
            console.log("______td created_______");



            if (hasRunOnce) {
              tdRef.style.height = timeTableTdStyle.height;
            }


            if (tdTimeOverFlow < 0 || (tdTimeOverFlow < 0 && isEndingAtBreak)) {
              tdTimeOverFlow = Math.abs(tdTimeOverFlow);


              let spanAmount = Math.floor(tdTimeOverFlow);


              // if (isEndingAtBreak) {
              //   spanAmount = tdTimeOverFlow
              // }
              if (spanAmount > 0) {
                if (!tdRefsobj[rowNumber]) {
                  tdRefsobj[rowNumber] = [];
                }

                tdRefsobj[rowNumber].push({ ref: tdRef, rowspan: spanAmount });
              }
              // const spanAmount = rowspanRounded - 1;



            }


            const isOverflowingY = tdRef.scrollHeight > tdRef.clientHeight;

            if (prevRowNumber != rowNumber) {
              let oldTrRef = null;
              tdRefsRow.forEach((tdRef) => {
                if (oldTrRef === null) {
                  oldTrRef = tdRef.closest(`.${classes.tr}`);
                }
                if (prevHeightDiff != 0) {
                  tdRef.style.height = tdRef.offsetHeight + prevHeightDiff + "px";
                }
              });

              if (oldTrRef !== null && hasRunOnce) {
                oldTrRef.style.height = rowHeight + "px";
              }

              if (oldTrRef !== null && prevHeightDiff != 0) {
                oldTrRef.style.height =
                  oldTrRef.offsetHeight + prevHeightDiff + "px";
                modifiedTrsObj[prevRowNumber] = prevHeightDiff;
              }

              tdRefsRow = [];
              prevHeightDiff = 0;
              prevRowNumber = rowNumber;
            }


            // if(tdRefsRow.length==0){

            //   tdRefsRow.push([{tdRef,seance}]);
            // }else{
            //   tdRefsRow.find(tdRefsRowArr=>{

            //     tdRefsRowArr.find(tdRefObj=>{
            //       const tdRefObjSeance=tdRefObj.seance
            //       dayjs(seance.heure_debut).isBefore()
            //     })
            //   })
            // }
            tdRefsRow.push(tdRef);

            const trRef = tdRef.closest(`.${classes.tr}`);

            if (isOverflowingY) {
              console.log("overflow______");

              const childHeight = tdRef.firstElementChild.offsetHeight;
              const tdRefHeight = tdRef.offsetHeight;

              const heightDiff = childHeight - tdRefHeight;


              if (heightDiff > prevHeightDiff) {
                prevHeightDiff = heightDiff;
              }
            }

            if (tdNumber == tdCount && hasRunOnce) {
              trRef.style.height = rowHeight + "px";
            }

            if (tdNumber == tdCount && prevHeightDiff != 0) {
              tdRefsRow.forEach((tdRef) => {
                tdRef.style.height = tdRef.offsetHeight + prevHeightDiff + "px";
              });


              trRef.style.height = trRef.offsetHeight + prevHeightDiff + "px";
              modifiedTrsObj[rowNumber] = prevHeightDiff;
            }
          }






          tdCount++;
          if (findedseanceObjArr.length == 1) {
            timeTableTr.push(
              <TimetableTd
                key={timeTableKey}
                seance={findedSeance}
                style={timeTableTdStyle}
                onCreate={onTdCreate}
                rowspan={rowspan}
                hoursSteps={hoursSteps}
                columnNumber={dayCount}
                rowNumber={hoursStepsCounter}
                tdNumber={tdCount}
                index={findedSeanceIndex}
              />
            );

          } else {
            tdContainer.push(
              <TimetableTd
                key={timeTableKey}
                seance={findedSeance}
                style={timeTableTdStyle}
                onCreate={onTdCreate}
                rowspan={rowspan}
                hoursSteps={hoursSteps}
                columnNumber={dayCount}
                rowNumber={hoursStepsCounter}
                tdNumber={tdCount}
                index={findedSeanceIndex}
              />
            );

          }


          if (rowspan < 1 && index == 0) {
            const leftTdOffset = tdWidth * dayCount + "%";

            const emptyTdStyle = {
              position: "absolute",
              width: tdWidthUnit,
              border: borderStyle,
              left: leftTdOffset,
              height: "100%",
              maxWidth: tdWidthUnit,
            };

            timeTableTr.push(
              <div
                key={"empty_td" + key}
                className={`${classes.td} ${classes.empty_td}`}
                style={emptyTdStyle}
                data-col={dayCount}
                data-row={hoursStepsCounter}

              >
              </div>
            );
          }

          // prevSeancesEnd[dayCount] = currentLine + rowspan;
        });

        if (tdContainer.length > 0) {
          const tdContainerStyle = { maxWidth: tdWidthUnit, minWidth: tdWidthUnit }
          timeTableTr.push(<div key={'tdcontainer' + key} className={`${classes.td_container} tdcontainer`} style={tdContainerStyle}>
            {tdContainer}
          </div>)
        }


      } else {
        const emptyTdStyle = { border: borderStyle, minWidth: tdWidthUnit };
        timeTableTr.push(
          <div
            className={`${classes.td} ${classes.empty_td}`}
            key={"empty_td" + key}
            style={emptyTdStyle}
            data-col={dayCount}
            data-row={hoursStepsCounter}
          ></div>
        );
      }

      dayCount++;
    }

    if (currentSpecificTimeScale.length > 0) {
      currentSpecificTimeScale = currentSpecificTimeScale.map(
        (timeScale, index) => {
          const { totalHour, timeStringHour: hours, timeStringMinute: minutes } = convertTimeStringToHour(timeScale)

          let timeDiff = totalHour - hoursSteps;
          /*
            spanTop permet de placer l'heure au bon endroit
            sur la ligne et fonction du step
            si la différence entre l'heure a placer l'heure de début de ligne
            correspond au step, cela signifie que que la hauteur entre les deux elements est égale a 100%.
            Cette valeur doit être convertie px.
          */
          let spanTop = (timeDiff * 100) / step;

          const formatTime = dayjs()
            .set("hour", hours)
            .set("minute", minutes)
            .set("second", 0)
            .format("HH:mm");

          if (rowSeanceStartArr.includes(formatTime)) {

            spanTop = (spanTop * rowHeight) / 100;
            spanTop += 'px'

          } else {
            spanTop += "%";
          }
          return (
            <span
              key={`specificTimescale_${index}`}
              className={`${classes.specificTimeScaleElemnt}`}
              style={{ top: spanTop }}
            >

              {formatTime}
            </span>
          );
        }
      );
    }

    if (timeTableBreaksTr.length > 0) {
      timeTableTr.push(
        <div
          className={`${classes.breaks} ${classes.tr}`}
          style={{ height: "100%" }}
          key={"breaks" + hoursSteps}
          data-row={hoursStepsCounter}
        >
          {timeTableBreaksTr}
        </div>
      );
    }


    const stepsMultiple = step * hoursStepsCounter


    const isMultiple = (stepsMultiple >=
      0 && Number.isInteger(stepsMultiple / timetableStepInHours))




    timeTableBody.push(
      <div
        className={`${classes.timetableRow} ${classes.tr}`}
        style={{ height: rowHeight + "px" }}
        key={hoursSteps}
        data-row={hoursStepsCounter}
      >
        <div
          className={`timeScaleElemntContainer position-relative h-100 `}
          key={hoursSteps}
          style={{
            left: `-${borderWidth / 2}px`,
            minWidth: timeScaleWidthUnit,
          }}
        >

          {isMultiple && <span className={`${classes.timeScaleElemnt}`}>

            {formatTime.format("HH:mm")}
          </span>}

          {currentSpecificTimeScale}

          {islastLoop && (
            <span
              className={`${classes.timeScaleElemnt} ${classes.timeScaleLastElemnt}`}
            >
              {formatTime
                .add(stepHour, "hour")
                .add(stepMinute, "minute")
                .format("HH:mm")}
            </span>
          )}
        </div>

        <div
          className={`${classes.timeTableTdContainer} d-flex position-relative w-100`}
          style={{ maxWidth: availableSpace }}
        >
          {timeTableTr}
        </div>
      </div>
    );

    hoursSteps += step;
    hoursStepsCounter++;
  }

  const { user, isUserAuthenticated } = useAuth();

  const { classe_id } = useParams();

  let classeId = classe_id;

  console.log("timetablebody", timeTableBody);
  const [timetableSessions, setTimetableSessions] = useState();

  function onTimetableClick(event) {
    event.stopPropagation();
    const target = event.target;
    const td = target.closest(`.${classes.td}`);
    if (!td) return;

    if (mode == timetableMode.edit) {
      if (onTdClick) {
        const dataset = td.dataset;
        const row = dataset.row;
        const column = dataset.col;

        if (!timetableStart) return;

        const timetableStartDayjs = dayjs(timetableStart)
          .set('hours', 0)
          .set('minutes', 0)
          .add(column, 'day');

        const dayNumber = timetableStartDayjs.date();


        onTdClick(event, td, dayNumber);
      }
    }
  }

  return (
    <div className="w-100">
      <div className={`${classes.timetableHeader} d-flex`}>
        <div
          className={`${classes.TimeTableTimeScale} text-center`}
          style={{ minWidth: timeScaleWidthUnit, maxWidth: timeScaleWidthUnit }}
        >
          Hours
        </div>

        <div className={`${classes.timeTableDayScale} text-center d-flex`}>
          {timetableDays}
        </div>
      </div>

      <div
        className={`${classes.timetableContainer}  d-flex`}
        style={{ minHeight: timetableHeight + "px" }}
      >
        <div className={`${classes.myTimetable}`}>
          <div
            className={`${classes.tbody}`}
            style={{ margin: `${borderWidth / 2}px` }}
            onClick={mode == timetableMode.edit ? onTimetableClick : null}
          >
            <div
              className={`${classes.outerBorderContainer}  position-absolute h-100 pe-none`}
              style={{
                border: borderStyle,
                width: availableSpace,
                right: "0px",
              }}
            >
              <div
                className={`${classes.outerBorder} position-absolute h-100 `}
                style={{
                  border: borderStyle,
                  boxSizing: "content-box",
                  width: "100%",
                  borderWidth: borderWidth + "px",
                }}
              ></div>
            </div>

            <div
              className={`${classes.innerBorder} position-absolute h-100 pe-none `}
              style={{ border: borderStyle, width: availableSpace }}
            ></div>

            {timeTableBody}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Timetable;
