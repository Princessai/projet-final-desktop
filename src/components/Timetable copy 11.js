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
  const timeStringValues = String(timeString).split(":");

  const timeStringHour = parseInt(timeStringValues[0] ?? 0);
  const timeStringMinute = parseInt(timeStringValues[1] ?? 0);
  const timeStringMinuteTohour = timeStringMinute / 60;
  const totalHour = timeStringMinuteTohour + timeStringHour;
  return {
    timeStringMinute,
    timeStringMinuteTohour,
    timeStringHour,
    totalHour,
  };
}

function timesStringdiffInHour(timeString1, timeString2) {
  timeString1 = convertTimeStringToHour(timeString1).totalHour;
  timeString2 = convertTimeStringToHour(timeString2).totalHour;
  let diff = timeString1 - timeString2;
  return Math.abs(diff);
}

function orderSeances(seances) {
  const seancesByDayArr = [];
  seances.forEach(function (seance, index) {
    const heure_debut = dayjs(seance.heure_debut); // Get the current date

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
function TimetableBreakTd({
  currentBreak,
  style,
  onCreate,
  columnNumber,
  rowNumber,
}) {
  const tdRef = useRef(null);
  useEffect(function () {
    if (onCreate) {
      onCreate(tdRef.current, { columnNumber, rowNumber, currentBreak, style });
    }
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

function TimetableTd({
  seance,
  style,
  onCreate,
  hoursSteps,
  columnNumber,
  rowNumber,
  tdNumber,
  index,
}) {
  console.log("td _rerender___");
  console.log(seance);
  const tdRef = useRef(null);

  const hasRunOnce = useRef(false);

  useEffect(function () {
    // console.log("tdNumber", tdNumber, "tdRef.current", tdRef.current);
    onCreate(tdRef.current, {
      hoursSteps,
      columnNumber,
      rowNumber,
      tdNumber: tdNumber,
      hasRunOnce: hasRunOnce.current,
      style,
    });
    hasRunOnce.current = true;
  });
  const type_seance = seance.type_seance.label;
  const module = seance.module.label;
  const teacher = `${seance.manager.name} ${seance.manager.lastname}`;
  const salle = seance.salle.label;

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
        <p className="fw-bold m-0">
          {type_seance} {module}
        </p>
        <p className=" m-0">{teacher}</p>
        <p className="fw-bold fst-italic m-0">{salle}</p>
      </div>
    </div>
  );
}

function timetableElementClicked(event, td) { }

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
    timetableStep = 3,
  } = props


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
  const [reloadContent, setReloadContent] = useState(false);
  currentTimetableMode = mode;
  function onBreakcreate(breakRef, props) {
    const { columnNumber, rowNumber, currentBreak, style } = props;

    const breakDuration = timesStringdiffInHour(
      currentBreak.debut,
      currentBreak.fin
    );

    const rowspanRounded = roundUpToStep(breakDuration, step) / step;

    // const breakOffsetHeight = breakRef.offsetHeight;
    // const breakScrollHeight = breakRef.scrollHeight;
    // if (prevRowNumber != rowNumber) {
    //     console.log('row change  due to  breaks element __ ', rowNumber)

    // breaksRefsRow.forEach((breakRef, index) => {
    //     if (index == 0 && prevBreakHeightDiff!=0) {
    //         console.log(prevBreakHeightDiff)
    //         const tr = breakRef.closest('.timetableRow.tr');
    //         // tr.style.height = tr.offsetHeight + prevBreakHeightDiff + 'px'
    //         console.log('index__', index)
    //         console.log(breaksRefsRow)

    //     }
    // if(prevBreakHeightDiff!=0){
    //         //     breakRef.style.height = breakRef.offsetHeight + prevBreakHeightDiff + 'px';

    //         // }
    //     });
    //     console.log('break___*', breakRef, rowNumber)
    //     breaksRefsRow = [];
    //     prevBreakHeightDiff = 0;
    //     prevRowNumber = rowNumber;
    // }

    // breaksRefsRow.push(breakRef);
    // console.log("breakRef", breakRef);

    breaksRefs.push({
      rowNumber,
      ref: breakRef,
      rowspan: rowspanRounded - 1,
      style,
    });
    // let heightDiff = 0

    // if (breakOffsetHeight < breakScrollHeight) {

    //     heightDiff = breakScrollHeight - breakOffsetHeight;
    //     console.log('breakCreate', breakRef, breakOffsetHeight, breakScrollHeight, heightDiff)

    // }
    // if (heightDiff > prevBreakHeightDiff) {
    //     prevBreakHeightDiff = heightDiff;
    // }
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

      currentTimetableMode = undefined;
    };
  }, []);

  useEffect(function () {
    console.log("full ___timetable  in domm");
    // console.log('tdRefsobj', tdRefsobj)
    // console.log('modifiedTrsObj', modifiedTrsObj)
    // console.log('breaksRefs', breaksRefs)

    Object.keys(tdRefsobj).forEach((key) => {
      const tdsArr = tdRefsobj[key];
      const currentRow = key;
      tdsArr.forEach((tdObj) => {
        let tdRowSpan = currentRow;
        let spanAmount = tdObj.rowspan;
        let heightIncrease = 0;
        while (spanAmount >= 1) {
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

      if (topIncrease) {
        breakRef.style.top = parseInt(breakRef.style.top) + topIncrease + "px";
      }

      if (rowspan > 0) {
        let heightIncrease = 0;
        while (rowspan > 0) {
          rowNumber++;
          const increaseAmount = modifiedTrsObj[rowNumber];
          if (increaseAmount === undefined) break;
          heightIncrease += increaseAmount;
          rowspan--;
        }

        if (heightIncrease > 0) {
          breakRef.style.height = breakRef.offsetHeight + heightIncrease + "px";
        }
      }
    });

    console.log("rerender_end_____");
  });

  const [borderWidth, setBorderWidth] = useState(border);
  const timetableHeight = height;
  const borderStyle = `solid ${borderWidth / 2}px black`;

  const seances = TimetableData.seances;

  // const weekDays = [
  //     'monday',
  //     'tuesday',
  //     'wednesday',
  //     'thursday',
  //     'friday',
  //     'saturday',
  //     'sunday'
  // ];

  const {
    timeStringHour: stepHour,
    timeStringMinute: stepMinute,
    timeStringMinuteTohour,
  } = convertTimeStringToHour(timetableStep);

  const step = stepHour + timeStringMinuteTohour;

  const seancesByDayArr = useMemo(() => {
    return orderSeances(seances);
  }, [seances]);
  //    console.log('____maxDay____',dayjs(timetableEnd),'timetableEnd',timetableEnd
  // //    .diff(timetableStart)
  // )

  let maxDay = 4;

  if (timetableEnd !== null || timetableStart !== null) {
    maxDay = dayjs(timetableEnd).diff(timetableStart, "day");
  }

  const dayStartHourString = 9;
  const dayEndHourString = 17;
  const { totalHour: dayStartHour } =
    convertTimeStringToHour(dayStartHourString);
  const { totalHour: dayEndHour } = convertTimeStringToHour(dayEndHourString);
  const rowHeight =
    (timetableHeight - borderWidth) / ((dayEndHour - dayStartHour) / step);
    console.log('rowheight',rowHeight,(dayEndHour - dayStartHour))
  let timescaleWidthInPercentage = false;
  let timeScaleWidthUnit;
  timeScaleWidthUnit = timeScaleWidth;

  if (timeScaleWidth.includes("%")) {
    timescaleWidthInPercentage = true;
    timeScaleWidth = parseInt(timeScaleWidth);
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
  // console.log('weeeekstart++++', weekStart, TimetableData)
  const timeTableBody = [];
  const timeTableDatesTr = [];
  let hoursStepsCounter = 0;
  let timetableStartDayjs;

  timetableStartDayjs = dayjs(weekStart).add(dayStartHour, "hour");

  // console.log('timetable starttt', timetableStartDayjs.format('YYYY-MM-DD HH:mm:ss'))
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
    // console.log('dayStartHour', hoursSteps)
    const timeTableTr = [];
    const timeTableBreaksTr = [];
    let currentSpecificTimeScale = [];

    function isSpecificTimeScale(seanceObject) {
      const seanceStartInhourSteps = seanceObject.startTotalHour - dayStartHour;
      const seanceEndInhourSteps = seanceObject.endTotalHour - dayEndHour;

      if (
        seanceStartInhourSteps != 0 &&
        !Number.isInteger(seanceStartInhourSteps / step)
      ) {
        if (
          specificTimeScale.length == 0 ||
          specificTimeScale.indexOf(
            (timeScale) => timeScale.totalHour == seanceObject.startTotalHour
          ) == -1
        ) {
          const specificTime = {
            totalHour: seanceObject.startTotalHour,
            minutes: seanceObject.startMinute,
            hours: seanceObject.startHour,
          };
          currentSpecificTimeScale.push(specificTime);
          specificTimeScale.push(specificTime);
        }
      }

      if (
        seanceEndInhourSteps != 0 &&
        !Number.isInteger(seanceEndInhourSteps / step)
      ) {
        if (
          specificTimeScale.length == 0 ||
          specificTimeScale.indexOf(
            (timeScale) => timeScale.totalHour == seanceObject.endTotalHour
          ) == -1
        ) {
          const specificTime = {
            totalHour: seanceObject.endTotalHour,
            minutes: seanceObject.endMinute,
            hours: seanceObject.endHour,
          };
          currentSpecificTimeScale.push(specificTime);
          specificTimeScale.push(specificTime);
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

    for (let breakIndex = 0; breakIndex < timetableALLBreaks.length;) {
      const timeTablebreak = timetableALLBreaks[breakIndex];
      const breakStartString = String(timeTablebreak.debut);
      const breakEndString = String(timeTablebreak.fin);

      const {
        totalHour: breakStartTotalHour,
        timeStringMinute: breakStartMinute,
        timeStringHour: breakStartHour,
      } = convertTimeStringToHour(breakStartString);

      const {
        totalHour: breakEndTotalHour,
        timeStringMinute: breakEndMinute,
        timeStringHour: breakEndHour,
      } = convertTimeStringToHour(breakEndString);

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

        const breakTop = (breakStartTotalHour - hoursSteps) * rowHeight + "px";

        if (!timeTablebreak.only) {
          isBreakRowFull = true;

          if (mode == timetableMode.read) {
            const breaksTdStyle = {
              width: "100%",
              height: breakHeight,
              top: breakTop,
            };
            console.log(timeTablebreak);
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

          isSpecificTimeScale({
            startTotalHour: breakStartTotalHour,
            endTotalHour: breakEndTotalHour,
            startMinute: breakStartMinute,
            endMinute: breakEndMinute,
            startHour: breakStartHour,
            endHour: breakEndHour,
          });

          if (mode == timetableMode.edit) {
            matchingBreaksIndexes.push({ breakIndex, breakHeight, breakTop });
          }

          break;
        }
        matchingBreaksIndexes.push({ breakIndex, breakHeight, breakTop });
      }

      breakIndex++;
    }

    const prevDayBreak = {
      breakIndex: null,
      withOnly: null,
    };

    let timeTableBreaksCounter = -1;

    for (let dayCount = 0; dayCount <= maxDay;) {
      const key = `day_${dayCount}_${hoursSteps}`;

      if (
        (isBreakRowFull == false &&
          (mode == timetableMode.read || mode == timetableMode.edit)) ||
        (isBreakRowFull == true && mode == timetableMode.edit)
      ) {
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

          // const breakStartString = String(timeTablebreakAtIndex.debut);
          // const breakEndString = String(timeTablebreakAtIndex.fin);

          // const { totalHour: breakStartTotalHour, timeStringMinute: breakStartMinute, timeStringHour: breakStartHour } = convertTimeStringToHour(breakStartString)

          // const { totalHour: breakEndTotalHour, timeStringMinute: breakEndMinute, timeStringHour: breakEndHour } = convertTimeStringToHour(breakEndString)

          if (
            mode == timetableMode.read &&
            timeTablebreakAtIndex.only &&
            timeTablebreakAtIndex.only.includes(dayCount)
          ) {
            if (
              prevDayBreak.breakIndex == null ||
              prevDayBreak.breakIndex !== matchingBreaksIndexe
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
              prevDayBreak.breakIndex = matchingBreaksIndexe;
            }

            if (prevDayBreak.breakIndex == matchingBreaksIndexe) {
              const width =
                timeTableBreaksTr[timeTableBreaksCounter].props.style.width;
              timeTableBreaksTr[timeTableBreaksCounter].props.style.width =
                parseInt(width) + tdWidth + "%";
            }
          }

          if (mode == timetableMode.edit) {
            console.log("borderWidth", borderWidth);
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
              isBreakRowFull == false &&
              timeTablebreakAtIndex.only &&
              timeTablebreakAtIndex.only.includes(dayCount)
            ) {
              pushBreak = true;
            }

            if (isBreakRowFull == true) {
              console.log("edit row fulll");
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
      }

      let weekStartDayjs = timetableStartDayjs
        .add(dayCount, "day")
        .add(stepHour * hoursStepsCounter, "hour")
        .add(stepMinute * hoursStepsCounter, "minute");
      const daySeances = seancesByDayArr[dayCount] ?? [];
      // console.log(weekStartDayjs.format('YYYY-MM-DD HH:mm:ss'));
      const findedseanceObj = daySeances.find(function (seanceObj) {
        const { seance, index } = seanceObj;
        const seance_heure_debut = seance.heure_debut;
        return dayjs(seance_heure_debut).isSame(weekStartDayjs);
      });

      const currentLine = hoursStepsCounter + 1;
      if (findedseanceObj) {
        const { seance: findedSeance, index: findedSeanceIndex } =
          findedseanceObj;

        const rowspan = findedSeance.duree_raw / step;
        const rowspanRounded = findedSeance.duree / step;

        // console.log('rowspannnnn________', rowspan, findedSeance)
        // console.log('seance_heure_debut', findedSeance.heure_debut)
        // console.log('seance_end', currentLine + rowspan)
        let tdHeight;

        tdHeight = rowspan * rowHeight + "px";

        const timeTableTdStyle = {
          height: tdHeight,
          border: borderStyle,
          fontSize: "13px",
          maxWidth: tdWidthUnit,
        };

        function onTdCreate(tdRef, props) {
          const { hoursSteps, columnNumber, rowNumber, tdNumber, hasRunOnce } =
            props;
          console.log("______td created_______");

        

          if (hasRunOnce) {
            tdRef.style.height = timeTableTdStyle.height;
          }

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
        timeTableTr.push(
          <TimetableTd
            key={key}
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
        if (prevSeancesEnd[dayCount] == currentLine && rowspan < 1) {
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
              {" "}
            </div>
          );
        }
        prevSeancesEnd[dayCount] = currentLine + rowspan;
      } else {
        const emptyTdStyle = { border: borderStyle, minWidth: tdWidthUnit };
        timeTableTr.push(
          <div
            className={`${classes.td} ${classes.empty_td}`}
            key={key}
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
          let timeDiff = timeScale.totalHour - hoursSteps;
          let spanTop = (timeDiff * 100) / step;
          const formatTime = dayjs()
            .set("hour", timeScale.hours)
            .set("minute", timeScale.minutes)
            .set("second", 0);

          return (
            <span
              key={`specificTimescale_${index}`}
              className={`${classes.specificTimeScaleElemnt}`}
              style={{ top: spanTop + "%" }}
            >
              {" "}
              {formatTime.format("HH:mm")}{" "}
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
          <span className={`${classes.timeScaleElemnt}`}>
            {" "}
            {formatTime.format("HH:mm")}{" "}
          </span>
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
