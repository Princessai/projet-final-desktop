import React, { useEffect, useRef, useState, useMemo, memo } from "react";
// import './Timetable.css';
import classes from "./Timetable.module.css";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

import { useAxios } from "../Providers/AxiosProvider";
import { useAuth } from "../Providers/AuthProvider";
import { FallbackContent } from "./FallbackContent";
import { useParams } from "react-router-dom";
import { throttle, debounce } from "../../utilities/debounce_throttle.js";
import { format } from "date-fns";
import * as yup from "yup";


const timetableMode = {
  read: "read",
  edit: "edit",
};
export const sessiontype = {
  seances: "seances",
  breaks: "breaks"
}
dayjs.extend(isoWeek);
let isWaitingGlobal = true;
let currentTimetableMode;
let globalTimetableErrors;
export function convertTimeStringToHour(timeString) {

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

function getMouseRowPos(mouseY, rowHeight, modifiedTrsObj) {
  let rowIndex = -1;
  let rowOffset = 0;
  let currentRowHeight;
  while (mouseY > 0) {
    rowIndex++


    currentRowHeight = modifiedTrsObj[rowIndex];

    if (currentRowHeight) {
      currentRowHeight += rowHeight;
      mouseY -= currentRowHeight;


    } else {
      currentRowHeight = rowHeight;
      mouseY -= currentRowHeight;
    }



    if (mouseY > 0) {
      rowOffset += currentRowHeight
    }

  }

  if (rowIndex < 0) {


    currentRowHeight = modifiedTrsObj[rowIndex];
    currentRowHeight = (currentRowHeight != null) ? currentRowHeight : rowHeight;

  }


  return { rowIndex, rowOffset, rowHeight: currentRowHeight }

}
function smallestMultiplicativeFactor(step, minStep) {
  console.log('smallestMultiplicativeFactor_func')
  let divisor = 2;
  let multiplicativeFactor = step;
  if (!minStep) {
    return step
  }

  if (Number.isInteger(step / minStep)) {
    return minStep;
  }

  while (true) {
    multiplicativeFactor = (multiplicativeFactor / divisor);
    if (multiplicativeFactor <= minStep) {
      return multiplicativeFactor;
    }


  }

}

export function roundUpToStep(num, step = 0.25) {
  return Math.ceil(num / step) * step;
}

function extractTdData(event, td) {
  const dataset = td.dataset;
  const col = dataset.col;
  const row = dataset.row;

  const index = dataset.index;
  return { index, row, col };
}
function TimetableBreakTd({
  currentBreak,
  style,
  onCreate,
  columnNumber,
  rowNumber,
  explicitRowCount,
  index
}) {
  const props = arguments[0];
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
      data-row={explicitRowCount}
      data-sessiontype={sessiontype.breaks}
      data-pseudorow={rowNumber}
      data-index={index}

    >
      <div className={`${classes.td_break_inner_container}`}>
        {/*(currentTimetableMode == timetableMode.edit) 
           && <svg className='deleteTimetableElement' xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59L7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12L5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4" /></svg>*/}
        <span style={{ margin: "auto 0" }}> {currentBreak.name} </span>
      </div>
    </div>
  );
}
function isMultipleOfStep(speudoStepAcc) {
  const regex = /^(9{2,})|^(0{2,})/g;

  return (speudoStepAcc >=
    0 && Number.isInteger(speudoStepAcc)) || (!Number.isInteger(speudoStepAcc) && (speudoStepAcc).toString().split('.')[1]?.match(regex) != null)
}
function TimetableTd({
  seance,
  style,
  onCreate,
  hoursSteps,
  columnNumber,
  rowNumber,
  tdNumber,
  index,
  explicitRowCount
}) {
  const props = arguments[0];

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
  const type_seance = seance?.type_seance?.label;
  const module = seance.module?.label;
  const teacher = `${seance?.manager?.name} ${seance?.manager?.lastname}`;
  const salle = seance?.salle?.label;
  const seanceStart = dayjs(seance.heure_debut).format('HH:mm')
  const seanceEnd = dayjs(seance.heure_fin).format('HH:mm')
  const isOnErrorState = globalTimetableErrors?.[index] != undefined;

  console.log("🚀 ~ UNE GROSSE CONSOLE", isOnErrorState, globalTimetableErrors)


  


  return (
    <div
      className={`${classes.td} ${classes.timetable_td} class ${isOnErrorState ? classes.invalidTd : ''}`}
      ref={tdRef}
      style={style}
      data-col={columnNumber}
      data-row={explicitRowCount}
      data-index={index}
      data-sessiontype={sessiontype.seances}
      data-pseudorow={rowNumber}
    >
      <div>
        <p className=" m-0">{seanceStart}-{seanceEnd}</p>

        <p className="fw-bold m-0">
          {type_seance} {module}
        </p>
        <p className=" m-0">{teacher}</p>
        <p className="fw-bold fst-italic m-0">{salle}</p>
      </div>
    </div >
  );
}



const timetableSchema = yup.object().shape({
  timetableStart: yup.string().required(),
  timetableEnd: yup.string().required(),
});

let errors;
const validateData = async (data) => {
  console.log("🚀 ~ validateData ~ data:", data)

  try {
    errors = null
    timetableSchema.validateSync(data, { abortEarly: false });

  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const validationErrors = {}
      error.inner.forEach(eacherror => {
        if (eacherror.path) {
          validationErrors[eacherror.path] = eacherror.message;
        }
      });
      console.log("Validation Errors:", validationErrors);


      errors = validationErrors // Array of error messages
    }
  }
};

function Timetable({

  border = 10,
  height = 600,
  timeScaleWidth = "60px",
  onTdClick = null,
  timetableStart,
  timetableEnd,
  mode = timetableMode.edit,
  breaks = [],
  seances = [],
  timetableStep = '01:00',
  onError,
  timetableStartHour = '09:00',
  timetableEndHour = '17:00',
  timeTableErrors
}) {
  console.log("🚀 ~ seances:", seances)
  const props = arguments[0];
  const specificTimeScaleByRows = {}
  const RowsintervalsObj = {}


  if (timeTableErrors) {
    globalTimetableErrors = timeTableErrors;
  }

  useEffect(() => {
    validateData({
      timetableStart,
      timetableEnd,
    })

    if (onError) onError(errors);

  }, [timetableStart, timetableEnd])

  const dayStartHourString = timetableStartHour;
  const dayEndHourString = timetableEndHour;
  console.log("🚀 ~ timetableEnd:", timetableEnd)
  console.log("🚀 ~ timetableStart:", timetableStart)
  console.log('errors', errors)
  const myTimetableRef = useRef(null);


  let hasPseudoRows = false;

  const tdRefsobj = {};
  const modifiedTrsObj = {};
  let prevHeightDiff = 0;
  const tdOverflowPadding = 20;
  let prevBreakHeightDiff = 0;
  let prevRowNumber = null;
  let lastRowNumber;
  let tdCount = 0;
  let tdRefsRow = [];
  let prevTdHoursSteps = null;
  let breaksRefs = [];
  let breaksRefsRow = [];
  let timeScaleOverflow = [];
  const [reloadContent, setReloadContent] = useState(false);
  currentTimetableMode = mode;
  const minStep = useRef(null);
  const resizeAmount = 17;
  let explicitRowCount = -1;
  const firstRowRef = useRef(null);
  const innerBorderRef = useRef(null);




  function onBreakcreate(breakRef, props) {
    const { columnNumber, rowNumber, currentBreak, style, isTopLineBreak, hoursStepsEnd } = props;

    // let tdTimeOverFlow = seanceEnd.isAfter(dayStepEnd) ? dayStepEnd.diff(seanceEnd, 'hours', true) / step : 0;

    const breakDuration = timesStringdiffInHour(
      currentBreak.debut,
      currentBreak.fin
    );
    const breakEnd = convertTimeStringToHour(currentBreak.fin).totalHour;
    const tdTimeOverFlow = (breakEnd > hoursStepsEnd) ? (breakEnd - hoursStepsEnd) / step : 0;


    // const rowspanRounded = roundUpToStep(breakDuration, step) / step;
    const rowspan = Math.floor(tdTimeOverFlow);



    breaksRefs.push({
      rowNumber,
      ref: breakRef,
      rowspan: rowspan,
      style,
      isTopLineBreak,
    });

  }

  let initialResize = null;

  console.log("timetable  rerenderr");
  useEffect(() => {
    const onScreenResize = throttle(function onScreenResize() {
      console.log("throttle___");

      isWaitingGlobal = false;
      setReloadContent((oldValue) => !oldValue);
      initialResize = null;
    }, 850);

    const onScreenResizeDebounced = debounce(function () {
      console.log("debounce___");
      isWaitingGlobal = false;
      setReloadContent((oldValue) => !oldValue);
      initialResize = null;
    }, 500);

    const onScreenResizeDecorator = (e) => {




      const viewportWidth = window.innerWidth;
      if (initialResize == null) {
        initialResize = viewportWidth;
      }


      if (Math.abs(viewportWidth - initialResize) < resizeAmount) {
        // initialResize = viewportWidth;
        return
      }
      // const viewportHeight = window.innerHeight;




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
      globalTimetableErrors = null;
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
        while (spanAmount > 0) {
          tdRowSpan++;
          if (modifiedTrsObj[tdRowSpan]) {
            heightIncrease += modifiedTrsObj[tdRowSpan];
          }

          spanAmount--;
        }

        const tdRef = tdObj.ref;
        if (heightIncrease > 0) {
          tdRef.style.height = tdRef.getBoundingClientRect().height + heightIncrease + "px";
        }
      });
    });

    breaksRefs.forEach((breakobj) => {
      const breakRef = breakobj.ref;
      let rowNumber = breakobj.rowNumber;
      let rowspan = breakobj.rowspan;
      const style = breakobj.style;
      const isTopLineBreak = breakobj.isTopLineBreak;

      const topIncrease = modifiedTrsObj[rowNumber];

      if (breakRef.style.top != style.top) {
        breakRef.style.top = style.top;
      }

      /*
        repositionner la pose lorsque en cas de redimensinnement de la ligne au dessus
      */

      if (!isTopLineBreak && topIncrease) {
        breakRef.style.top = parseFloat(breakRef.style.top) + topIncrease + "px";
      }

      if (rowspan > 0) {
        let heightIncrease = 0;
        while (rowspan > 0) {
          rowNumber++;
          const increaseAmount = modifiedTrsObj[rowNumber];
          if (increaseAmount !== undefined) {
            heightIncrease += increaseAmount;

          }
          rowspan--;
        }

        if (heightIncrease > 0) {
          breakRef.style.height = breakRef.offsetHeight + heightIncrease + "px";
        }
      }
    });


    console.log("rerender_end_____");
    Object.keys(specificTimeScaleByRows).forEach((row) => {
      const timescale = specificTimeScaleByRows[row]
      console.log("🚀 ~ Object.keys ~ timescale:", row, timescale)
      const intervals = [];
      const prevTdHoursSteps = dayStartTotalHours + (step * row);
      let prevTimescale = prevTdHoursSteps;
      let prevPos = 0;

      const heightIncrease = modifiedTrsObj[row] ?? 0;


      timescale.forEach((timeObj, index) => {

        const intervalStart = {
          time: prevTimescale,
          pos: prevPos
        };


        let intervalEndPos;
        let timeDiff = timeObj.totalHour - prevTdHoursSteps;

        let spanTop = (timeDiff * 100) / step;


        if (timeObj.istatic) {
          spanTop = (spanTop * rowHeight) / 100;

        }
        else {
          spanTop = (spanTop * rowHeight + heightIncrease) / 100;

        }

        intervalEndPos = spanTop;

        prevPos = intervalEndPos;
        prevTimescale = timeObj.totalHour;

        const intervalEnd = {
          time: timeObj.totalHour,
          pos: intervalEndPos
        };
        intervals.push([intervalStart, intervalEnd])


      })

      if (intervals.length > 0) {
        const intervalStart = {
          time: prevTimescale,
          pos: prevPos
        };
        const intervalEnd = {
          time: prevTdHoursSteps + step,
          pos: rowHeight + heightIncrease
        }
        intervals.push([intervalStart, intervalEnd]);
      }

      if (intervals.length > 0) {
        RowsintervalsObj[row] = intervals;

      }


    })
    console.log("🚀 ~ Object.keys ~ RowsintervalsObj:", RowsintervalsObj)


  });

  const [borderWidth, setBorderWidth] = useState(border);
  const timetableHeight = height;
  const borderStyle = `solid ${borderWidth / 2}px black`;

  // const seances = TimetableData.seances;




  const seancesByDayArr = useMemo(() => {


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



  const { totalHour: timetableStepInHours, timeStringHour: timetableStepHour,
    timeStringMinute: timetableStepMinute } = convertTimeStringToHour(timetableStep);


  if (minStep.current == !null && timetableStepInHours > minStep.current) {

    timetableStep = smallestMultiplicativeFactor(timetableStepInHours, minStep.current);

    hasPseudoRows = true;
  }
  const {
    timeStringHour: stepHour,
    timeStringMinute: stepMinute,
    timeStringMinuteTohour: stepMinuteTohour,
  } = convertTimeStringToHour(timetableStep);
  const step = stepHour + stepMinuteTohour;






  const maxDay = (timetableEnd !== null || timetableStart !== null) ? dayjs(timetableEnd).diff(timetableStart, "day") : 4;



  const { totalHour: dayStartTotalHours, timeStringHour: dayStartHour, timeStringMinute: dayStartMinute } =
    convertTimeStringToHour(dayStartHourString);
  const { totalHour: dayEndHours } = convertTimeStringToHour(dayEndHourString);
  const { timeStringHour: dayEndInHour, timeStringMinute: dayEndInMinute } = convertTimeStringToHour(dayEndHours);


  const dayEndFormat = dayjs()
    .set("hour", dayEndInHour)
    .set("minute", dayEndInMinute)
    .set("second", 0)
    .format("HH:mm");
  console.log("🚀 ~ dayEndHours:", dayEndFormat)


  const rowHeight = (timetableHeight - borderWidth) / Math.round(((dayEndHours - dayStartTotalHours) / step));
  let lastRowHeight;
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

  timetableStartDayjs = dayjs(weekStart).add(dayStartTotalHours, "hour");

  let formatTime;
  const prevSeancesEnd = [];
  const specificTimeScale = [];
  const timetableALLBreaks = breaks;


  const date_debut = dayjs(weekStart).format("DD MMMM YYYY");
  const date_fin = dayjs(weekEnd).format("DD MMMM YYYY");

  let timetableDateDebut;

  timetableDateDebut = dayjs(weekStart);

  const timetableDays = [];
  const thWidth = 100 / (maxDay + 1);

  const breaksNotInTopLine = []

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

  for (let hoursSteps = dayStartTotalHours; hoursSteps < dayEndHours;) {
    const timeTableTr = [];
    let timeTableBreaksTr = [];
    let currentSpecificTimeScale = [];
    const currentSpecificStaticTimeScale = [];
    function isSpecificTimeScale(timeString, isStatic = false) {

      const { totalHour: totalInHour } = convertTimeStringToHour(timeString);

      if (totalInHour == dayStartTotalHours) return;
      if (totalInHour == dayEndHours) return;
      const seanceOffsetInhour = totalInHour - dayStartTotalHours;

      if ((!Number.isInteger(seanceOffsetInhour / timetableStepInHours))
      ) {
        if (
          specificTimeScale.length == 0 || !specificTimeScale.includes(timeString)

        ) {
          if (isStatic) {
            currentSpecificStaticTimeScale.push(timeString);
          }
          currentSpecificTimeScale.push(timeString);
          specificTimeScale.push(timeString);
        }
      }


    }



    if (hoursSteps !== dayStartTotalHours) {
      formatTime = formatTime.add(stepHour, "hour").add(stepMinute, "minute");
    } else {
      formatTime = timetableStartDayjs;
    }

    const islastLoop = hoursSteps + step >= dayEndHours ? true : false;

    if (islastLoop) {
      lastRowNumber = hoursStepsCounter;

    }

    const hoursStepsEnd = hoursSteps + step;


    const stepsStartMultiple = (hoursSteps - dayStartTotalHours) / timetableStepInHours
    const stepsEndMultiple = (hoursStepsEnd - dayStartTotalHours) / timetableStepInHours



    let isStartMultiple = isMultipleOfStep(stepsStartMultiple);

    let isEndMultiple = isMultipleOfStep(stepsEndMultiple);


    if (minStep.current == null || timetableStepInHours < minStep.current) {
      isStartMultiple = true
      isEndMultiple = true
    }

    if (isStartMultiple) {
      explicitRowCount++;
    }

    let isBreakRowFull = false;
    const matchingBreaksIndexes = [];
    let timeTableBreaksCounter = -1;
    for (let breakIndex = 0; breakIndex < timetableALLBreaks.length;) {
      const timeTablebreak = timetableALLBreaks[breakIndex];

      const {
        totalHour: breakStartTotalHour,

      } = convertTimeStringToHour(timeTablebreak.debut);

      const {
        totalHour: breakEndTotalHour,

      } = convertTimeStringToHour(timeTablebreak.fin);



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

            const props = {
              key: breakKey,
              currentBreak: timeTablebreak,
              style: breaksTdStyle,
              onCreate: onBreakcreate,
              index: breakIndex,
              rowNumber: hoursStepsCounter,
              mode: mode,
              hoursStepsEnd,
              explicitRowCount
            }

            timeTableBreaksTr.push(
              props
              // <TimetableBreakTd
              //   key={breakKey}
              //   currentBreak={timeTablebreak}
              //   style={breaksTdStyle}
              //   onCreate={onBreakcreate}
              //   data-index={breakIndex}
              //   rowNumber={hoursStepsCounter}
              // />
            );
          }


          isSpecificTimeScale(
            timeTablebreak.debut,

          )

          if (breakEndTotalHour < hoursStepsEnd) {
            isSpecificTimeScale(
              timeTablebreak.fin,

            )

          }


          if (mode == timetableMode.edit) {
            matchingBreaksIndexes.push({ breakIndex, breakHeight, breakTop, isBreakRowFull: true });
          } else {
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

        const { totalHour: breakEndTotalHour } = convertTimeStringToHour(timeTablebreakAtIndex.fin);

        if (breakEndTotalHour > hoursStepsEnd) {
          if (!timeScaleOverflow.includes(timeTablebreakAtIndex.fin)) {
            timeScaleOverflow.push(timeTablebreakAtIndex.fin)
          }
        }


        const currentDayBreak = prevDayBreak[matchingBreaksIndexe];

        if (mode == timetableMode.read) {

          if (timeTablebreakAtIndex.only &&
            timeTablebreakAtIndex.only.includes(dayCount)) {
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
              const props = {
                key: breakKey,
                currentBreak: timeTablebreakAtIndex,
                style: { width: tdWidthUnit },
                onCreate: onBreakcreate,
                columnNumber: dayCount,
                rowNumber: hoursStepsCounter,
                mode: mode,
                index: breakIndex,
                hoursStepsEnd,
                explicitRowCount
              }
              timeTableBreaksTr[timeTableBreaksCounter] = props;
              // (

              // <TimetableBreakTd
              //   currentBreak={timeTablebreakAtIndex}
              //   style={{ width: tdWidthUnit }}
              //   onCreate={onBreakcreate}
              //   columnNumber={dayCount}
              //   rowNumber={hoursStepsCounter}
              // />
              // );

              prevDayBreak[matchingBreaksIndexe] = { prevDay: dayCount, breakComponentIndex: timeTableBreaksCounter }

            }

            if (prevBreakDayCount == prevDaycount) {

              currentDayBreak.prevDay = dayCount;

              const width =
                timeTableBreaksTr[currentDayBreak.breakComponentIndex].style.width;
              timeTableBreaksTr[currentDayBreak.breakComponentIndex].style.width =
                parseFloat(width) + tdWidth + "%";
            }


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
            const props = {
              key: breakKey,
              currentBreak: timeTablebreakAtIndex,
              style: breakTdStyle,
              onCreate: onBreakcreate,
              columnNumber: dayCount,
              rowNumber: hoursStepsCounter,
              index: breakIndex,
              mode: mode,
              hoursStepsEnd,
              explicitRowCount

            }
            timeTableBreaksTr.push(
              props
              // <TimetableBreakTd {...props} />
            );
          }
        }

        matchingBreaksIndexe++;
      }




      const dayStepStart = timetableStartDayjs
        .add(dayCount, "day")
        .add(stepHour * hoursStepsCounter, "hour")
        .add(stepMinute * hoursStepsCounter, "minute");

      const dayStepEnd = dayStepStart
        .add(stepHour, "hour")
        .add(stepMinute, "minute")

      const daySeances = seancesByDayArr[dayCount] ?? [];




      const findedseanceObj = daySeances.find(function (seanceObj) {
        const { seance, index } = seanceObj;
        const seanceStart = dayjs(seance.heure_debut);

        return (seanceStart.isSame(dayStepStart) || (seanceStart.isAfter(dayStepStart) && seanceStart.isBefore(dayStepEnd)));

      });





      // const currentLine = hoursStepsCounter + 1;
      const emptyTdBorderWidth = (borderWidth / 2) + 'px';
      const borderBottomWidth = isEndMultiple ? emptyTdBorderWidth : '0px'
      const borderTopWidth = isStartMultiple ? emptyTdBorderWidth : '0px'


      if (findedseanceObj) {




        console.log('findedseanceObj++')
        const { seance: findedSeance, index: findedSeanceIndex } =
          findedseanceObj;

        const seanceStart = dayjs(findedSeance.heure_debut);
        const seanceEnd = dayjs(findedSeance.heure_fin);


        rowSeanceStartArr.push(seanceStart.format('HH:mm'))

        let tdTimeOverFlow = seanceEnd.isAfter(dayStepEnd) ? dayStepEnd.diff(seanceEnd, 'hours', true) / step : 0;



        const { totalHour: seanceStartTotalHour } = convertTimeStringToHour(seanceStart);
        const { totalHour: seanceEndTotalHour } = convertTimeStringToHour(seanceEnd);


        matchingBreaksIndexes.forEach((currentMatchingBreaksIndexe) => {

          const breakIndex = currentMatchingBreaksIndexe.breakIndex;
          const currentBreak = timetableALLBreaks[breakIndex];
          const breakStart = currentBreak.debut
          const { totalHour: breakStartInhour } = convertTimeStringToHour(breakStart);

          let isDayBreak = false;
          if (!currentBreak.only || currentBreak.only.includes(dayCount)) {
            isDayBreak = true;
          }
          if (isDayBreak && seanceEndTotalHour <= breakStartInhour) {


            if (breaksNotInTopLine.findIndex((breakObj) => {
              return breakObj.name == currentBreak.name && breakObj.debut == breakStart

            }) == -1) {



              breaksNotInTopLine.push(currentBreak)
            }

          }



        })





        console.log('findedSeance+++', findedSeance, seanceStart.format("HH:mm"), seanceEnd.format("HH:mm"))
        isSpecificTimeScale(
          seanceStart.format("HH:mm"),

        )
        let isEndingAtBreak = false
        let isStartingAtBreak = false
        let EndingAtBreak
        timetableALLBreaks.forEach((timetableBreak, index) => {
          if (timetableBreak.debut == seanceEnd.format("HH:mm")) {
            isEndingAtBreak = true;
            EndingAtBreak = index;
          }

          if (timetableBreak.fin == seanceStart.format("HH:mm")) {
            isStartingAtBreak = true;
          }
        });

        // const isEndingAtBreak = EndingAtBreak !== -1;

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




        let tdHeight;

        tdHeight = rowspan * rowHeight + "px";

        const tdTop = ((seanceStartTotalHour - hoursSteps) * rowHeight) / step + "px";
        let boxShadow = ''
        if (!isStartingAtBreak) {
          boxShadow += ` 0px ${-borderWidth / 2}px black `
        }


        if (!isEndingAtBreak) {
          if (boxShadow != '') {
            boxShadow += ',';
          }
          boxShadow += `0px  ${borderWidth / 2}px black`
        }

        const timeTableTdStyle = {
          height: tdHeight,
          border: borderStyle,
          fontSize: "13px",
          maxWidth: tdWidthUnit,
          top: tdTop,
          boxShadow
        };

        console.log('isEndingAtBreak&&isStartingAtBreak', !isEndingAtBreak && !isStartingAtBreak,)
        console.log('isStartingAtBreak', isStartingAtBreak)
        console.log('isEndingAtBreak', isEndingAtBreak)
        console.log("🚀 ~ timeTableTdStyle:", timeTableTdStyle)

        const timeTableKey = 'TimetableTd ' + key



        function onTdCreate(tdRef, props) {


          const { hoursSteps: tdHoursSteps, columnNumber, rowNumber, tdNumber, hasRunOnce, seance, isEndingAtBreak } =
            props;
          console.log("______td created_______");


          if (hasRunOnce) {
            tdRef.style.height = timeTableTdStyle.height;
          }
          let isNotBreaksInTopLine;
          if (isEndingAtBreak) {
            const currentBreak = timetableALLBreaks[EndingAtBreak]
            console.log("🚀 ~ onTdCreate ~ currentBreak:", currentBreak)

            console.log("🚀 ~ isNotBreaksInTopLine=breaksNotInTopLine.findIndex ~ breaksNotInTopLine:", breaksNotInTopLine)
            isNotBreaksInTopLine = breaksNotInTopLine.findIndex((BreakObj) => {
              console.log('BreakObj', BreakObj, BreakObj?.name, currentBreak?.name)
              return BreakObj.name == currentBreak.name && BreakObj.debut == currentBreak.debut;
            }) !== -1

          }

          if (tdTimeOverFlow < 0 || (tdTimeOverFlow < 0 && isEndingAtBreak)) {
            tdTimeOverFlow = Math.abs(tdTimeOverFlow);


            let spanAmount = Math.floor(tdTimeOverFlow);



            if (isEndingAtBreak && isNotBreaksInTopLine) {
              spanAmount = tdTimeOverFlow
            }
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

            if (prevHeightDiff != 0) {
              prevHeightDiff += tdOverflowPadding;
            }



            tdRefsRow.forEach((tdRef) => {
              if (oldTrRef === null) {
                oldTrRef = tdRef.closest(`.${classes.tr}`);
              }
              if (prevHeightDiff != 0) {
                tdRef.style.height = tdRef.getBoundingClientRect().height + prevHeightDiff + "px";
                console.log("🚀 ~ tdRefsRow.forEach ~ tdRef:", tdRef)
              }
            });


            if (oldTrRef !== null && oldTrRef.style.height != rowHeight + "px") {
              oldTrRef.style.height = rowHeight + "px";
              console.log("🚀 ~ onTdCreate ~ oldTrRef.style.height hasRunOnce:", oldTrRef)

            }




            if (oldTrRef !== null && prevHeightDiff != 0) {
              oldTrRef.style.height =
                oldTrRef.getBoundingClientRect().height + prevHeightDiff + "px";
              console.log("🚀 ~ onTdCreate ~ oldTrRef.style.height:", oldTrRef, oldTrRef.style.height, prevHeightDiff)
              console.log(prevRowNumber)
              modifiedTrsObj[prevRowNumber] = prevHeightDiff;
            }

            tdRefsRow = [];
            prevHeightDiff = 0;
            prevRowNumber = rowNumber;
            prevTdHoursSteps = tdHoursSteps;
          }



          tdRefsRow.push(tdRef);

          const trRef = tdRef.closest(`.${classes.tr}`);

          if (isOverflowingY) {
            console.log("overflow______");

            const childHeight = tdRef.firstElementChild.getBoundingClientRect().height;
            const tdRefHeight = tdRef.getBoundingClientRect().height;

            const heightDiff = childHeight - tdRefHeight;


            if (heightDiff > prevHeightDiff) {
              prevHeightDiff = heightDiff;
            }
          }

          if (tdNumber == tdCount && hasRunOnce) {
            console.log('td create last row height', trRef, lastRowHeight, prevHeightDiff)

            if (rowNumber == lastRowNumber) {

              console.log('last row reinitilize lastRowHeight ', lastRowHeight, rowHeight)
              trRef.style.height = lastRowHeight + "px";
            } else {
              console.log('last row reinitilize')
              trRef.style.height = rowHeight + "px";

            }
          }

          if (tdNumber == tdCount && prevHeightDiff != 0) {

            prevHeightDiff += tdOverflowPadding;


            tdRefsRow.forEach((tdRef) => {
              tdRef.style.height = tdRef.getBoundingClientRect().height + prevHeightDiff + "px";
            });


            trRef.style.height = trRef.getBoundingClientRect().height + prevHeightDiff + "px";
            modifiedTrsObj[rowNumber] = prevHeightDiff;
          }
        }






        tdCount++;

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
            isEndingAtBreak={isEndingAtBreak}
            breaksNotInTopLine={breaksNotInTopLine}
            explicitRowCount={explicitRowCount}

          />
        );






        const leftTdOffset = tdWidth * dayCount + "%";



        const emptyTdStyle = {
          position: "absolute",
          width: tdWidthUnit,
          border: borderStyle,
          left: leftTdOffset,
          height: "100%",
          minWidth: tdWidthUnit,
          width: tdWidthUnit,
          // maxWidth: tdWidthUnit,
          borderBottomWidth,
          borderTopWidth
        };

        timeTableTr.push(
          <div
            key={"empty_td" + key}
            className={`${classes.td} ${classes.empty_td}`}
            style={emptyTdStyle}
            data-col={dayCount}
            data-row={explicitRowCount}
            data-pseudorow={hoursStepsCounter}
          >
          </div>
        );


        // prevSeancesEnd[dayCount] = currentLine + rowspan;







      } else {
        const emptyTdStyle = {
          border: borderStyle,
          minWidth: tdWidthUnit,
          borderBottomWidth,
          borderTopWidth,
          width: tdWidthUnit,
          maxWidth: tdWidthUnit
        };

        timeTableTr.push(
          <div
            className={`${classes.td} ${classes.empty_td}`}
            key={"empty_td" + key}
            style={emptyTdStyle}
            data-col={dayCount}
            data-row={explicitRowCount}
            data-pseudorow={hoursStepsCounter}
          ></div>
        );
      }

      dayCount++;
    }

    let isDayEndStepMultiple
    if (islastLoop) {


      isDayEndStepMultiple = Number.isInteger((dayEndHours - dayStartTotalHours) / step);

      if (hoursStepsEnd > dayEndHours && !isDayEndStepMultiple) {


        if (specificTimeScale.length == 0 || !specificTimeScale.includes(dayEndFormat)) {
          currentSpecificTimeScale.push(dayEndFormat);
          specificTimeScale.push(dayEndFormat);
        }
      }

    }

    const datasetSpecificTimeScale = [];
    // const dataSetSpecificStaticTimeScale = [];
    if (currentSpecificTimeScale.length > 0) {
      currentSpecificTimeScale = currentSpecificTimeScale.map(
        (timeScaleString, index) => {
          const { totalHour, timeStringHour: hours, timeStringMinute: minutes } = convertTimeStringToHour(timeScaleString)

          let timeDiff = totalHour - hoursSteps;

          const isStepMultiple = isMultipleOfStep((totalHour - dayStartTotalHours) / step);
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
          const isTimescaleofToplineBreak = breaksNotInTopLine.findIndex((currentBreak) => {
            return currentBreak.debut == timeScaleString
              || currentBreak.fin == timeScaleString;
          }) == -1 && breaksNotInTopLine.length > 0;


          const isTimeScaleStartOfSeance = rowSeanceStartArr.includes(formatTime);

          if (isTimeScaleStartOfSeance) {
            datasetSpecificTimeScale.push({ time: formatTime, istatic: true, totalHour });
          } else {
            datasetSpecificTimeScale.push({ time: formatTime, istatic: false, totalHour });
          }

          if (isTimeScaleStartOfSeance || currentSpecificStaticTimeScale.includes(formatTime) || (isTimescaleofToplineBreak && !isStepMultiple)) {

            spanTop = (spanTop * rowHeight) / 100;
            spanTop += 'px'

          } else {
            spanTop += "%";
          }


          if (formatTime == dayEndFormat) {
            spanTop = '100%';
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

    if (datasetSpecificTimeScale.length > 0 && mode == timetableMode.edit) {
      datasetSpecificTimeScale.sort(function (a, b) { return a.totalHour - b.totalHour; });
      specificTimeScaleByRows[hoursStepsCounter] = datasetSpecificTimeScale;

    }




    if (timeTableBreaksTr.length > 0) {
      timeTableBreaksTr = timeTableBreaksTr.map((breakProps) => {
        let isTopLineBreak = false;
        const currentBreak = breakProps.currentBreak;

        if (breaksNotInTopLine.findIndex((BreakObj) => {
          return BreakObj.name == currentBreak.name && BreakObj.debut == currentBreak.debut;
        }) == -1) {
          isTopLineBreak = true;
        }

        return <TimetableBreakTd {...breakProps} isTopLineBreak={isTopLineBreak} />
      })
      timeTableTr.push(
        <div
          className={`${classes.breaks} ${classes.tr} breask_tr`}
          style={{ height: "100%" }}
          key={"breaks" + hoursSteps}
          data-row={hoursStepsCounter}
        >
          {timeTableBreaksTr}
        </div>
      );
    }




    let trHeight = rowHeight + "px";

    if (islastLoop) {
      lastRowHeight = (dayEndHours - hoursSteps) * 100 / step;

      lastRowHeight = (lastRowHeight * rowHeight) / 100;

      // lastRowHeight += 'px';

      trHeight = lastRowHeight + 'px';



    }
    const hoursStepsCounterCopy = hoursStepsCounter;

    timeTableBody.push(
      <div
        data-specifictimescale={JSON.stringify(datasetSpecificTimeScale)}
        className={`${classes.timetableRow} ${classes.tr} ${islastLoop ? classes.lastRow : ''}  `}
        style={{ height: trHeight }}
        key={hoursSteps + timeTableBody.length}
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


          {
            isStartMultiple &&
            <span className={`${classes.timeScaleElemnt}`}>

              {formatTime.format("HH:mm")}
            </span>}

          {currentSpecificTimeScale}

          {(islastLoop && isDayEndStepMultiple) && (
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
          className={`${classes.timeTableTdContainer} timeTableTdContainer d-flex position-relative w-100`}
          style={{ maxWidth: availableSpace }}
          ref={(ref) => {

            if (hoursStepsCounterCopy == 0) firstRowRef.current = ref
          }}
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

  const [timetableSessions, setTimetableSessions] = useState();

  function onTimetableClick(event) {
    event.stopPropagation();
    const target = event.target;
    const td = target.closest(`.${classes.td}`);

    const x = event.clientX;
    const y = event.clientY;
    const timetableRec = myTimetableRef.current.getBoundingClientRect();
    const firstRowRec = firstRowRef.current.getBoundingClientRect();

    const colWidth = firstRowRec.width / (maxDay + 1);

    let mousePosYInTimetable = y - (timetableRec.top);

    mousePosYInTimetable = mousePosYInTimetable < 0 ? 0 : mousePosYInTimetable;


    let mousePosXInTimetable = x - (firstRowRec.left);
    mousePosXInTimetable = mousePosXInTimetable < 0 ? 1 : mousePosXInTimetable;

    const mouseCol = Math.ceil(mousePosXInTimetable / colWidth) - 1



    if (mousePosYInTimetable > timetableRec.height - (borderWidth)) {
      mousePosYInTimetable = timetableRec.height - (borderWidth);
    }

    const MouseRowPosObj = getMouseRowPos(mousePosYInTimetable, rowHeight, modifiedTrsObj);

    const mousePseudoRow = MouseRowPosObj.rowIndex;
    const isStartMultiple = isMultipleOfStep((mousePseudoRow * step) / timetableStepInHours);
    const isEndMultiple = isMultipleOfStep((mousePseudoRow * step + step) / timetableStepInHours);
    const mousePseudoRowTop = MouseRowPosObj.rowOffset;
    const mousePseudoRowBottom = (mousePseudoRowTop + MouseRowPosObj.rowHeight);

    if ((mousePseudoRow == 0 || isStartMultiple) && hasPseudoRows) {

      const computedBorderWidth = parseFloat(window.getComputedStyle(innerBorderRef.current).borderWidth);
      mousePosYInTimetable -= computedBorderWidth;



      mousePosYInTimetable = mousePosYInTimetable < 0 ? 0 : mousePosYInTimetable;
      if (mousePosYInTimetable >= mousePseudoRowBottom - (computedBorderWidth * 2)) mousePosYInTimetable = mousePseudoRowBottom;


    }




    const mouseRow = Math.floor((mousePseudoRow * step) / timetableStepInHours);
    let mouseRowPosY = (mousePosYInTimetable - mousePseudoRowTop);
    mouseRowPosY = mouseRowPosY < 0 ? 0 : mouseRowPosY;
    mouseRowPosY = mouseRowPosY;

    mouseRowPosY = Math.floor(mouseRowPosY);
    const mouseLineTotalHoursStart = (mousePseudoRow * step) + dayStartTotalHours;

    const mouseLineTotalHoursEnd = mouseLineTotalHoursStart + step;



    if (mode == timetableMode.edit && timetableStart) {
      if (onTdClick) {

        let row;
        let pseudoRow;
        let col;
        let tdSessiontype;
        let index;
        let data;


        if (!td) {
          row = mouseRow;
          pseudoRow = mousePseudoRow;
          col = mouseCol
          tdSessiontype = null;
          index = null;
          data = null;
        } else {
          const dataset = td.dataset;
          row = dataset.row;
          pseudoRow = parseFloat(dataset.pseudorow);
          col = dataset.col;
          tdSessiontype = dataset.sessiontype ?? null;
          index = dataset.index ?? null;
          data = null;

        }

        if (tdSessiontype == sessiontype.breaks) {
          data = timetableALLBreaks[index]
        }

        if (tdSessiontype == sessiontype.seances) {
          data = seances[index]
        }

        const intervals = RowsintervalsObj[mousePseudoRow] ?? [];
        const findedInterval = intervals.find((interval) => {
          const intervalStart = interval[0]

          const intervalEnd = interval[1]

          return mouseRowPosY >= intervalStart.pos && mouseRowPosY <= intervalEnd.pos;

        })
        let mousePosInHour;
        if (findedInterval) {
          const intervalStart = findedInterval[0];
          const intervalEnd = findedInterval[1];
          // console.log(intervalEnd.time - intervalStart.time, intervalEnd.pos - intervalStart.pos)
          const a = (intervalEnd.time - intervalStart.time) / (intervalEnd.pos - intervalStart.pos)
          let b;

          if (intervalStart.pos == 0) {
            b = intervalStart.time

          } else {
            b = intervalStart.time - (intervalStart.pos * a)
          }
          const y = (a * mouseRowPosY) + b;
          mousePosInHour = y;

        } else {

          mousePosInHour = ((Math.floor(mouseRowPosY) * step) / Math.floor(MouseRowPosObj.rowHeight)) + (dayStartTotalHours + (mousePseudoRow * step));

        }

        const datacol = seancesByDayArr[mouseCol] ?? [];
        let prevUpperSeance = null;
        let prevUpperSeanceEndHours = null;
        let upperSeanceType = null;

        // console.log("🚀 ~ datacol.forEach ~ datacol:", datacol)

        datacol.forEach((seanceObj) => {
          const seance = seanceObj.seance;
          const seanceEnd = convertTimeStringToHour(dayjs(seance.heure_fin)).totalHour;
          let lineStart;



          if (hasPseudoRows) {
            lineStart = (dayStartTotalHours + (row * timetableStepInHours));
          } else {
            lineStart = (dayStartTotalHours + (mousePseudoRow * step));
          }
          if (seanceEnd < mousePosInHour && seanceEnd > lineStart) {
            if (prevUpperSeance == null || prevUpperSeanceEndHours < seanceEnd) {
              prevUpperSeanceEndHours = seanceEnd;
              prevUpperSeance = seance;
              upperSeanceType = sessiontype.seances;
            }
          }

        })







        timetableALLBreaks.forEach((currentBreak) => {
          const breakEnd = convertTimeStringToHour(currentBreak.fin).totalHour;
          let lineStart;

          if (hasPseudoRows) {
            lineStart = (dayStartTotalHours + (row * timetableStepInHours));
          } else {
            lineStart = (dayStartTotalHours + (mousePseudoRow * step));
          }
          if (breakEnd < mousePosInHour && breakEnd > lineStart) {
            if (prevUpperSeance == null || prevUpperSeanceEndHours < breakEnd) {
              prevUpperSeanceEndHours = breakEnd;
              prevUpperSeance = currentBreak;
              upperSeanceType = sessiontype.breaks;
            }
          }


        })

        const upperSeance = prevUpperSeance != null ? {
          seance: prevUpperSeance,
          type: upperSeanceType
        } : null;
        console.log("🚀 ~ onTimetableClick ~ prevUpperSeance:", prevUpperSeance)



        mousePosInHour = dayjs()
          .set('hour', 0)
          .set('minute', 0)
          .add(mousePosInHour, 'hour')
          .format('HH:mm');



        const date = dayjs(timetableStart)
          .set('hours', 0)
          .set('minutes', 0)
          .add(col, 'day')
          .format("YYYY-MM-DD HH:mm:ss");


        /**
         * heure de début et de fin des pseudo lignes
         */
        const pseudoLineHourStart = dayjs(timetableStart)
          .set('hours', 0)
          .set('minutes', 0)
          .add(dayStartHour, 'hours')
          .add(dayStartMinute, 'minutes')
          .add(stepHour * pseudoRow, 'hours')
          .add(stepMinute * pseudoRow, 'minutes')

        const pseudoLineHourEnd = pseudoLineHourStart
          .add(stepHour, 'hours')
          .add(stepMinute, 'minutes');



        const pseudoStep = dayjs(timetableStart)
          .set('hours', 0)
          .set('minutes', 0)
          .add(stepHour, 'hours')
          .add(stepMinute, 'minutes')
          .format('HH:mm');



        const explicitStep = dayjs(timetableStart)
          .set('hours', 0)
          .set('minutes', 0)
          .add(timetableStepHour, 'hours')
          .add(timetableStepMinute, 'minutes')
          .format('HH:mm');

        /**
         * heure de début et de fin des lignes explicites
         */

        const LineHourStart = dayjs(timetableStart)
          .add(dayStartHour, 'hours')
          .add(dayStartMinute, 'minutes')
          .add(timetableStepHour * row, 'hours')
          .add(timetableStepMinute * row, 'minutes');

        const LineHourEnd = LineHourStart
          .add(timetableStepHour, 'hours')
          .add(timetableStepMinute, 'minutes');

        // datacol.forEach((seanceObj) => {
        //   const seance = seanceObj.seance;
        //   const seanceStart = convertTimeStringToHour(seance.heure_debut).totalHour;
        //   const seanceEnd = convertTimeStringToHour(seance.heure_fin).totalHour;
        //   // const 
        //   // if(){

        //   // }


        // })

        const info = {
          row,
          pseudoRow,
          step: explicitStep,
          pseudoStep,
          col,
          data,
          datacol,
          date,
          ElementPseudoLineHourStart: pseudoLineHourStart.format('HH:mm'),
          ElementPseudoLineHourEnd: pseudoLineHourEnd.format('HH:mm'),
          ElementLineHourStart: LineHourStart.format('HH:mm'),
          ElementLineHourEnd: LineHourEnd.format('HH:mm'),
          timetableStart,
          type: tdSessiontype,
          ref: td,
          index: index,
          mousePosXInTimetable,
          mousePosYInTimetable,
          mouseCol,
          mousePseudoRow,
          mouseRow,
          mousePseudoRowTop,
          mousePosInHour,
          upperSeance,
          hasPseudoRows

        }






        onTdClick(event, info);
      }
    }

    if (mode == timetableMode.edit && !timetableStart) {

      onTdClick(event, null);


    }
  }

  console.log("🚀 ~ RowsintervalsObj:", RowsintervalsObj, specificTimeScaleByRows)



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
        className={`${classes.timetableContainer} timetableContainer  d-flex`}
        style={{ minHeight: timetableHeight + "px", padding: borderWidth + 'px' }}
      >
        <div className={`${classes.myTimetable} myTimetable`} ref={myTimetableRef} onClick={mode == timetableMode.edit ? onTimetableClick : null}>
          <div
            className={`${classes.tbody} tbody`}

          >
            <div
              className={`${classes.outerBorderContainer}  outerBorderContainer position-absolute h-100 pe-none`}
              style={{
                border: borderStyle,
                width: availableSpace,
                right: "0px",
              }}
            >
              <div
                className={`${classes.outerBorder} outerBorder  position-absolute h-100 `}
                style={{
                  border: borderStyle,
                  boxSizing: "content-box",
                  width: "100%",
                  borderWidth: borderWidth + "px",
                }}
              ></div>
            </div>

            <div
              className={`${classes.innerBorder}  innerBorder position-absolute h-100 pe-none `}
              style={{ border: borderStyle, width: availableSpace }}
              ref={innerBorderRef}
            ></div>

            {timeTableBody}
          </div>
        </div>
      </div>
    </div>
  );
}
export default memo(
  Timetable);



