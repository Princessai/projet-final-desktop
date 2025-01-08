import React, { useEffect, useRef, useState, useCallback } from 'react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Timetable, { convertTimeStringToHour, sessiontype, roundUpToStep } from '../../components/Timetable'
import Navbar from '../../components/Navbar';
import SidebarCoordinator from '../../components/SidebarCoordinator';
import Footer from '../../components/Footer';
import '/src/pages/Presence/presence.css';
import classes from './AddTimetable.module.css';
import { Link, useParams } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { MobileTimePicker, renderTimeViewClock, TimePicker } from '@mui/x-date-pickers';
import { FormControl, InputLabel, ListSubheader, MenuItem, Select, TextField } from '@mui/material';
import { useAuth } from '../../Providers/AuthProvider';
import { useAxios } from '../../Providers/AxiosProvider';
import { FallbackContent } from '../../components/FallbackContent';
import { throttle, debounce } from "/utilities/debounce_throttle";
import { HiReceiptRefund } from 'react-icons/hi';
import { Delete } from '@mui/icons-material';
import * as yup from "yup";
import { Box, Snackbar } from '@mui/material';


const theme = createTheme({
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        fontSize: '15px', // Font size for the input
                        // height: '40px', // Input height
                    },
                    '& .MuiInputLabel-root': {
                        fontSize: '15px', // Label font size

                    },
                },
            },
        },
        MuiPickersDay: {
            styleOverrides: {
                root: {
                    fontSize: '12px', // Font size for day buttons
                },
            },
        },
    },
});

dayjs.extend(isoWeek);


const emptyStringMessage = 'This field cannot be empty'

const objectSchema = yup.object({

    etat: yup.number().required(),
    date: yup.string().required(),
    attendance: yup.number().required(),
    "heure_debut": yup.string().trim().min(2, emptyStringMessage).required(),
    "heure_fin": yup.string().trim().min(2, emptyStringMessage).required(),
    "duree": yup.number().required(),
    "duree_raw": yup.number().required(),
    annee_id: yup.number().required(),

    "salle": yup.object({
        // "id": 11,
        "label": yup.string().trim().min(2, emptyStringMessage).required()
    }),
    "module": yup.object({
        // "id": 2,
        "label": yup.string().trim().min(2, emptyStringMessage).required()
    }),
    "manager": yup.object({
        // "id": 17,
        "name": yup.string().required().trim().min(2, emptyStringMessage),
        "lastname": yup.string().required().trim().min(2, emptyStringMessage)
    }),

    "type_seance": yup.object({
        // "id": 1,
        "label": yup.string().trim().min(2, emptyStringMessage).required()
    })
});



const arraySchema = yup.array()
    .of(objectSchema)
    .min(1, 'At least one seance is required')
    .required('seance is required');


function isValidDate(value) {


    if (value == null || isNaN(value.$D) || isNaN(value.$M) || isNaN(value.$y)) {
        return false;
    }

    return true;
}

function enableOnly(date) {

    return date.day() !== 1

}

function derivedMinDate(timetableStart, weekStart) {
    const date = timetableStart ? timetableStart : weekStart;
    return dayjs(date).day(5)
}
function derivedMaxDate(timetableStart, weekStart) {
    const date = timetableStart ? timetableStart : weekStart;

    return dayjs(date).day(7);
}




function AddTimetable() {
    console.log('AddTimetable')
    const { isUserAuthenticated, currentYear } = useAuth();
    const { axios } = useAxios();

    const [loading, setLoading] = useState(true);  // État de chargement


    const { classe_id, classe_label } = useParams();
    const weekStart = dayjs().startOf('isoWeek').startOf('day');



    const [breaks, setBreaks] = useState([]);
    const [seances, setSeances] = useState([]);
    const [responseMessage, setResponseMessage] = useState([]);
    const [timetableStart, setTimetableStart] = useState(null);
    const [timetableEnd, setTimetableEnd] = useState(null);
    const [timetableStep, setTimetableStep] = useState('01:00')
    const stepInHour = convertTimeStringToHour(timetableStep).totalHour;
    const [timetableEndHour, setTimetableEndHour] = useState('17:00');
    const [timetableStartHour, setTimetableStartHour] = useState('09:00');
    const timetableEndHourTimeObj = convertTimeStringToHour(timetableEndHour);
    const timetableStartHourTimeObj = convertTimeStringToHour(timetableStartHour);
    const timetableEndHourInhour = timetableEndHourTimeObj.totalHour;
    const timetableStartHourInhour = timetableStartHourTimeObj.totalHour;



    












  

// function useTimetable(seances){
//     const [timetableSeances, setTimetableSeances] = useState(seances)
//     const timetableMounted = useRef(false);
//     function setTimetableMounted(){
//         timetableMounted.current = true;
//     }

   
//     const useSeancesByDayArrRef = useRef();


//     function orderSeancesByDay(seances){
//         const seancesByDayArr = [];
//         seances.forEach(function (seance, index) {
//             const heure_debut = dayjs(seance.heure_debut);
    
//             const dayOfWeek = heure_debut.day();
      
//             const dayIndex = dayOfWeek - 1;
      
//             const seanceObj = { seance, index };
//             if (seancesByDayArr[dayIndex]) {
//               seancesByDayArr[dayIndex].push(seanceObj);
//             } else {
//               seancesByDayArr[dayIndex] = [seanceObj];
//             }
//           });
//           useSeancesByDayArrRef.current = seancesByDayArr;
//           return seancesByDayArr
      
//     }

//     const timetableSettings = {
//         setTimetableMounted,
//         orderSeancesByDay
//     };

//     function addSeance(){

//     }

//     function setSeances(seances){
//         orderSeancesByDay(seances)
//     }


// }























    const [snackBar, setSnackBar] = useState({
        open: false ,
        vertical: 'top',
        horizontal: 'center',
    });

    const { vertical, horizontal, open } = snackBar

    const handleClose = () => {
        setSnackBar({ ...snackBar, open: false });
    };





    if (timetableStart == null && timetableEnd != null) {
        setTimetableStart(dayjs(timetableEnd).startOf('isoWeek').format('YYYY-MM-DD HH:mm:ss'))
    }



    function addSeance(newSeance) {
        setSeances((oldValues) => {


            return [...oldValues, newSeance]
        });
    }

    function changeSeanceProp(seanceIndex, prop) {
        setSeances((oldValues) => {
            const seances = oldValues.map((seance, index) => {
                if (index == seanceIndex) {
                    if (Array.isArray(prop)) {
                        prop.forEach((currentProp) => {
                            if (seance.hasOwnProperty(currentProp.name)) {
                                seance[currentProp.name] = currentProp.value;

                            }
                        })
                    } else {
                        seance[prop.name] = prop.value;

                    }
                }
                return seance
            })

            return seances
        })
    }

    function selectTimetableEnd(value, context) {
        if (isValidDate(value) && context.validationError === null) {
            const date = dayjs(value.$d).format('YYYY-MM-DD HH:mm:ss');
            setTimetableEnd(date);

        }

    }

    const controller = new AbortController();
    const { signal } = controller;


    const classeTeachers = useRef([]);
    const teachers = useRef([]);
    const classeModules = useRef([]);
    const modules = useRef([]);
    const classeCoordinator = useRef(null);
    const currentIndex = useRef(null);
    const coordinators = useRef([]);
    const typeseances = useRef([]);
    const rooms = useRef([]);
    const commentsRef = useRef(null);

    const [hasFocus, setHasFocus] = useState(false);

    const datacol = useRef([]);



    const [currentDate, setCurrentDate] = useState(null);
    const [currentStartHour, setCurrentStartHour] = useState(null);
    const [currentEndHour, setCurrentEndHour] = useState(null);

    const [elementType, setElementType] = useState(sessiontype.seances);
    const [selectedElement, setselectedElement] = useState(null);

    const [selectedElementManager, setSelectedElementManager] = useState("");
    const [selectedElementModule, setSelectedElementModule] = useState("");
    const [selectedElementTypeseance, setSelectedElementTypeseance] = useState("");
    const [selectedElementSalle, setSelectedElementSalle] = useState("");
    const [selectedElementDate, setSelectedElementDate] = useState("");

    const [selectedElementEndHour, setSelectedElementEndHour] = useState(null);

    const [timetableErrors, setTimetableErrors] = useState(null);
    const [seanceErrors, setSeanceErrors] = useState(null)

    const hasSelectedElement = selectedElement != null;

    const endHourRef = useRef(null);



    const initialSeance = {
        date: currentDate,
        heure_debut: null,
        heure_fin: null,
        etat: 3,
        attendance: 0,
        module: {
            id: '',
            label: " "
        },
        duree_raw: null,
        duree: null,
        type_seance: {
            id: '',
            label: ''
        },
        salle: {
            id: '',
            label: ''
        },
        manager: {
            id: '',
            name: '',
            lastname: ''
        },
        annee_id: currentYear.id
    }



    const isAllInputsDisabled = currentDate == null || timetableStart == null || timetableEnd == null
    const isDayDisabled = currentDate == null;
    const isEndHourDisabled = currentStartHour == null
    let startHourMax = null;
    let startHourMin = null;
    let endHourMax = null;
    let endHourMin = null;
    const isInvalid = seanceErrors?.[currentIndex.current] != undefined;
    let currentseanceErrors = seanceErrors?.[currentIndex.current];

    let moduleError = null;
    let managerError = null;
    let typeSeanceError = null;
    let roomError = null;

    if (isInvalid) {
        moduleError = currentseanceErrors?.module?.errors?.label?.[0];
        managerError = currentseanceErrors?.manager?.errors?.name?.[0];
        typeSeanceError = currentseanceErrors?.type_seance?.errors?.label?.[0];
        roomError = currentseanceErrors?.salle?.errors?.label?.[0];

    }

    console.log("🚀 ~ AddTimetable ~ currentseanceErrors:", currentseanceErrors)

    console.log("🚀 ~ AddTimetable ~ moduleError:", moduleError)

    console.log("🚀 ~ AddTimetable ~ managerError:", managerError)

    console.log("🚀 ~ AddTimetable ~ typeSeanceError:", typeSeanceError)

    console.log("🚀 ~ AddTimetable ~ roomError:", roomError)


    if (currentStartHour) {
        endHourMin = dayjs(currentStartHour);

    }
    if (timetableEndHour) {
        endHourMax = dayjs()
            .set('hour', timetableEndHourTimeObj.timeStringHour)
            .set('minute', timetableEndHourTimeObj.timeStringMinute)
            .set('second', 0);

    }

    if (timetableStartHour) {
        startHourMin = dayjs()
            .set('hour', timetableStartHourTimeObj.timeStringHour)
            .set('minute', timetableStartHourTimeObj.timeStringMinute)
            .set('second', 0)
    }






    if (selectedElementEndHour) {
        startHourMax = dayjs(selectedElementEndHour);
    } else if (timetableEndHour) {
        startHourMax = dayjs()
            .set('hour', timetableEndHourTimeObj.timeStringHour)
            .set('minute', timetableEndHourTimeObj.timeStringMinute)
            .set('second', 0);
    }

    function removeTimePickerError() {
        if (timetableErrors?.startHour || timetableErrors?.endHour) {
            setTimetableErrors((oldErrors) => {


                const newErrors = { ...oldErrors }
                delete newErrors['startHour'];
                delete newErrors['endHour'];

                return newErrors;
            })
        }

    }

    const selectedTypeseance = typeseances.current.find((typeseance) => {
        return typeseance.id == selectedElementTypeseance;
    })
    let isPresentiel = selectedTypeseance?.label == 'presentiel'

    let derivedClasseManager;

    if (isPresentiel) {
        derivedClasseManager = classeTeachers.current
        // teacherChange(derivedClasseManager.id)
    } else {
        derivedClasseManager = [classeCoordinator.current];
    }

    function insertTimetable(data){
        axios.post('/timetable', data)
        .then((response)=>{
            console.log(response.message);
            setSeances([]);
            commentsRef.current.value = '';
            reset();
            setResponseMessage(response.message)
           
                setSnackBar({ ...snackBar, open: true });

                let timer = setTimeout(() => {

                    handleClose();
                    clearTimeout(timer);       
        
                }, 5000);               
            
        })
        .catch((error)=>{
            console.error(error);
        })
    }


    function OnTimetableSave(data) {
        let errors

        try {
            errors = null
            errors = arraySchema.validateSync(data, { abortEarly: false });

            let request = {};
            let commentaire = commentsRef.current.value.trim();


            if (commentaire == '') commentaire = null;


            const timetable = {
                "date_debut": timetableStart,
                "date_fin": timetableEnd,
                "classe_id": classe_id,
                "annee_id": currentYear.id,
                "commentaire": commentaire
            }


            console.log('seancesss', seances);

            const requestSeances = seances.map((seance) => {
                return {
                    date: currentDate,
                    heure_debut: seance.heure_debut,
                    heure_fin: seance.heure_fin,
                    salle_id: seance.salle.id,
                    module_id: seance.module.id,
                    user_id: seance.manager.id,
                    type_seance_id: seance.type_seance.id,
                    annee_id: currentYear.id
                }
            })

            console.log('requestSeances',requestSeances);

            const requestObj = {
                timetable: timetable,
                seances: requestSeances
            
            }

            insertTimetable(requestObj);


        } catch (error) {
            console.log('try', error)
            if (error instanceof yup.ValidationError) {
                const validationErrors = {}
                console.error(error, error.inner)
                error.inner.forEach(eacherror => {

                    if (eacherror.path) {
                        console.log('________eacherror.path_____', eacherror.path)
                        const splitValues = eacherror.path.split('.');
                        console.log(splitValues)
                        const indexString = splitValues[0];
                        const regex = /(?<=\[)\d+(?=])/
                        const index = indexString.match(regex)[0];
                        console.log(indexString, index);

                        if (!validationErrors[index]) {
                            validationErrors[index] = { errors: {} }
                        }
                        let nextObj = validationErrors[index];
                        const currentProps = [];



                        if (splitValues.length >= 3) {


                            splitValues.forEach((key, splitIndex) => {
                                if (splitIndex == 0) return;
                                currentProps.push(key);


                                if (splitIndex <= splitValues.length - 2) {

                                    console.log("🚀 ~ splitValues.forEach ~ key:", key)


                                    if (!nextObj[key]) {
                                        nextObj[key] = { errors: {} }
                                        nextObj = nextObj[key];

                                    } else {
                                        nextObj = nextObj[key]
                                    }
                                }

                                if (splitIndex == splitValues.length - 2) {
                                    if (!nextObj.errors[splitValues[splitValues.length - 1]]) {
                                        nextObj.errors[splitValues[splitValues.length - 1]] = [];
                                    }


                                    nextObj.errors[splitValues[splitValues.length - 1]].push(eacherror.message)

                                }

                            })
                        }

                    }
                });

                errors = validationErrors // Array of error messages

                setSeanceErrors(validationErrors);
            }
        }
        console.log('OnTimetableSave', errors)
    }

    function deleteSeance(){
        setSeances((oldSeances)=>{
           return oldSeances.filter((oldSeance, index)=>{
            console.log('setSeancessss',oldSeance, currentIndex.current, oldSeance.id != currentIndex.current)
                return index != currentIndex.current;
            })
        })
        reset();
    }


    function reset() {
        setSelectedElementManager('');
        setSelectedElementModule('');
        setSelectedElementTypeseance('');
        setSelectedElementSalle('');
        // setSelectedElementDate('');

        setSelectedElementEndHour(null);
        currentIndex.current = null;
    }


    const onTdFocus = useCallback((event, info) => {
        if (!hasFocus) {
            setHasFocus(true);
        }

        if (info == null) {
            return
        }

        const upperSeance = info.upperSeance
        const hasPseudoRows = info.hasPseudoRows;


        datacol.current = info.datacol;

        if (info.type != null) {
            if (info.type != elementType) {
                setElementType(info.type);

            }
        }

        if (!info.index) {
            setselectedElement(null);
            currentIndex.current = seances.length;
            reset();
            const initialDayjs = dayjs(info.date).set('hour', 0).set('minute', 0).set('second', 0);

            if (!upperSeance) {
                let timeStringValues;

                timeStringValues = info.ElementLineHourStart.split(':');


                const hour = timeStringValues[0];
                const minute = timeStringValues[1];
                const currentStartHour = initialDayjs.add(hour, 'hour').add(minute, 'minute');
                setCurrentStartHour(currentStartHour.format('YYYY-MM-DD HH:mm:ss'));


            } else {
                if (upperSeance.type == sessiontype.seances) {
                    const upperseanceEnd = dayjs(upperSeance.seance.heure_fin)
                    const currentStartHour = initialDayjs.add(upperseanceEnd.hour(), 'hour').add(upperseanceEnd.minute(), 'minute');
                    setCurrentStartHour(currentStartHour.format('YYYY-MM-DD HH:mm:ss'));

                }
                if (upperSeance.type == sessiontype.breaks) {

                }
            }


        } else {

            currentIndex.current = parseFloat(info.index);
            const currentSeance = seances[currentIndex.current];

            setselectedElement(currentSeance);
            setSelectedElementManager(currentSeance.manager.id);
            setSelectedElementModule(currentSeance.module.id);
            setSelectedElementTypeseance(currentSeance.type_seance.id);
            setSelectedElementSalle(currentSeance.salle.id);
            setSelectedElementDate(currentSeance.date);
            setCurrentStartHour(currentSeance.heure_debut);
            setSelectedElementEndHour(currentSeance.heure_fin);




        }


        setCurrentDate(() => info.date);




    }, [seances])

    const onError = useCallback((errors) => {

        setTimetableErrors(errors)



    }, [])
    function selectTimetableStart(value, context) {
        if (isValidDate(value) && context.validationError === null) {
            const date = dayjs(value.$d);
            setTimetableStart(date.format('YYYY-MM-DD HH:mm:ss'));
            setTimetableEnd(dayjs(date).day(5).format('YYYY-MM-DD HH:mm:ss'))


        }

    }

    function setNewSeanceInitValue(newSeance, defaultValue) {
        const currentStartHourDayjs = dayjs(currentStartHour);
        const heure_debut = currentStartHourDayjs;
        let heure_fin;
        let duree;
        let duree_raw;

        if (selectedElementEndHour == null) {
            heure_fin = currentStartHourDayjs.add(stepInHour, 'hours');
            const heure_fin_Inhour = convertTimeStringToHour(heure_fin).totalHour

            if (heure_fin_Inhour > timetableEndHourInhour) {

                heure_fin = dayjs(currentDate).add(timetableEndHourInhour, 'hour');

            }


        } else {
            heure_fin = dayjs(selectedElementEndHour);
        }

        duree_raw = heure_fin.diff(heure_debut, 'hours', true);
        duree = roundUpToStep(duree_raw, 1);

        newSeance.heure_debut = heure_debut.format('YYYY-MM-DD HH:mm:ss');
        newSeance.heure_fin = heure_fin.format('YYYY-MM-DD HH:mm:ss');
        newSeance.duree = duree;
        newSeance.duree_raw = duree_raw;

        if (Array.isArray(defaultValue)) {
            defaultValue.forEach((currentProp) => {
                newSeance[currentProp.name] = currentProp.value;
            })
        } else if (defaultValue) {
            newSeance[defaultValue.name] = defaultValue.value;

        }
        setSelectedElementEndHour(newSeance.heure_fin);


        return newSeance;
    }

    function isSeanceOverlapse(seance1, seance2) {
        if (((seance1.start).isBefore(seance2.start) || (seance1.start).isSame(seance2.start)) && (seance1.end).isAfter(seance2.start)) {
            return true;
        }
        if (((seance1.start).isAfter(seance2.start) || (seance1.start).isSame(seance2.start)) && (seance1.start).isBefore(seance2.end)) {
            return true;
        }

        return false;
    }


    function dateChange(date, context) {
        if (context.validationError == 'invalidDate') {

            console.log('_invalidDate', currentDate)
        }
        if (context.validationError || !isValidDate(date)) {

            return;
        }
        console.log('date_changed')



        setCurrentDate(date.format('YYYY-MM-DD HH:mm:ss'))
        let derivedCurrentStartHour;
        let derivedCurrentEndHour;

        if (currentStartHour) {
            const currentStartHourDayjs = dayjs(currentStartHour);
            derivedCurrentStartHour = dayjs(date)
                .set('hours', currentStartHourDayjs.hour())
                .set('minutes', currentStartHourDayjs.minute())
                .format('YYYY-MM-DD HH:mm:ss')
            setCurrentStartHour(derivedCurrentStartHour)

        }

        if (selectedElementEndHour) {
            const currentEndHourDayjs = dayjs(selectedElementEndHour);
            derivedCurrentEndHour = dayjs(date)
                .set('hours', currentEndHourDayjs.hour())
                .set('minutes', currentEndHourDayjs.minute())
                .format('YYYY-MM-DD HH:mm:ss')
            setSelectedElementEndHour(derivedCurrentEndHour);
        }

        if (seances[currentIndex.current]) {
            const props = [
                { name: 'date', value: date.format('YYYY-MM-DD HH:mm:ss') },


            ]
            if (derivedCurrentStartHour) {
                props.push({ name: 'heure_debut', value: derivedCurrentStartHour })

            }
            if (derivedCurrentEndHour) {
                props.push({ name: 'heure_fin', value: derivedCurrentEndHour })

            }

            changeSeanceProp(currentIndex.current, props)

            
        }




    }
    function timePickerErrorSetter(context, inputName) {
        if (context.validationError) {
            setTimetableErrors((oldErrors) => {
                let newErrors
                const messages = {
                    'minTime': 'invalid minimum time',
                    maxTime: 'invalid maximum time',
                    // 'invalidDate': 'invalid time format'
                }
                const message = messages?.[context.validationError] || context.validationError;

                if (oldErrors) {

                    newErrors = { ...oldErrors, [inputName]: message }
                } else {
                    newErrors = { [inputName]: message }
                }
                return newErrors;
            })

        } else {
            if (timetableErrors?.[inputName]) {
                setTimetableErrors((oldErrors) => {


                    const newErrors = { ...oldErrors }
                    delete newErrors[inputName];

                    return newErrors;
                })
            }
        }



    }

    function startHourChange(startHour, context) {



        const derivedStartHour = dayjs(currentDate)
            .set('hour', startHour.hour())
            .set('minute', startHour.minute())
            .set('second', 0)

            

        const startHourFormat = derivedStartHour.format('YYYY-MM-DD HH:mm:ss');

        setCurrentStartHour(startHourFormat);

        timePickerErrorSetter(context, 'startHour');
        if (context.validationError) return;


        if (seances[currentIndex.current]) {

            setSeances((oldValues) => {
                const seances = oldValues.map((seance, index) => {
                    if (index == currentIndex.current) {
                        seance.heure_debut = startHourFormat;
                        seance.duree_raw = dayjs(seance.heure_fin).diff(derivedStartHour, 'hours', true);
                        seance.duree = roundUpToStep(seance.duree_raw, 1);
                    }



                    return seance
                })

                return seances
            });

        }

    }
    function endHourChange(endHour, context) {


        const derivedEndhour = dayjs(currentDate)
            .set('hour', 0)
            .set('minute', 0)
            .set('second', 0)
            .add(endHour.hour(), 'hour')
            .add(endHour.minute(), 'minute');

        const endHourFormat = derivedEndhour.format('YYYY-MM-DD HH:mm:ss');

        setSelectedElementEndHour(endHourFormat)
        timePickerErrorSetter(context, 'endHour');
        if (currentStartHour) {

            if (dayjs(currentStartHour).isAfter(derivedEndhour)) {
                setTimetableErrors((oldErrors) => {
                    const message = 'invalid minimum time';
                    if (oldErrors) {
                        setTimetableErrors({ ...oldErrors, startHour: message });
                    } else {
                        setTimetableErrors({ startHour: message })
                    }
                })
            } else {

                if (timetableErrors?.startHour) {
                    setTimetableErrors((oldErrors) => {
                        const newErrors = { ...oldErrors }
                        delete newErrors['startHour'];
                        return newErrors;
                    })

                }
            }
        }
        if (context.validationError) return;




        datacol.current.find((seance) => {
            const seanceStart = dayjs(seance.heure_debut);
            const seanceEnd = dayjs(seance.heure_fin);
            const currentSeanceStart = dayjs(currentStartHour);
            const currentSeanceEnd = dayjs(endHour);

            const isOverlapsing = isSeanceOverlapse({ start: currentSeanceStart, end: currentSeanceEnd }, { start: seanceStart, end: seanceEnd })

        });


        if (!seances[currentIndex.current]) {


            // if(!isOverlapsing){
            // }setSeance
            setSeances((oldValues) => {
                const newSeance = initialSeance
                // setNewSeanceInitValue(newSeance);

                const heure_debut = dayjs(currentStartHour);
                const heure_fin = derivedEndhour;
                const duree_raw = heure_fin.diff(heure_debut, 'hours', true);
                const duree = roundUpToStep(duree_raw, 1);

                newSeance.heure_debut = heure_debut.format('YYYY-MM-DD HH:mm:ss');
                newSeance.heure_fin = heure_fin.format('YYYY-MM-DD HH:mm:ss');
                newSeance.duree = duree;
                newSeance.duree_raw = duree_raw;

                return [...oldValues, newSeance]
            })

            setSelectedElementEndHour(endHour);


        } else {
            setSeances((oldValues) => {
                const seances = oldValues.map((seance, index) => {

                    if (index == currentIndex.current) {
                        const duree_raw = derivedEndhour.diff(dayjs(currentStartHour), 'hours', true);
                        const duree = roundUpToStep(duree_raw, 1);
                        seance.duree_raw = duree_raw;
                        seance.duree = duree;
                        seance.heure_fin = endHourFormat;
                    }
                    return seance
                })

                return seances
            })
        }

    }
    function moduleChange(event) {
        setSelectedElementModule(event.target.value);
        let findedModule = classeModules.current.find((module) => {
            return module.id == event.target.value;
        })

        if (!findedModule) {
            findedModule = modules.current.find((module) => {
                return module.id == event.target.value;
            })
        }

        if (!seances[currentIndex.current]) {



            setSeances((oldValues) => {
                const newSeance = initialSeance

                setNewSeanceInitValue(newSeance);
                newSeance.module = findedModule;

                return [...oldValues, newSeance]
            })

        } else {
            setSeances((oldValues) => {
                const seances = oldValues.map((seance, index) => {
                    if (index == currentIndex.current) {
                        seance.module = findedModule;
                    }
                    return seance
                })

                return seances
            })
        }
    }
    function teacherChange(id) {
        setSelectedElementManager(id);
        console.log('teacher________change', isPresentiel);
        let findedTeacher;
        if (isPresentiel) {
            findedTeacher = classeTeachers.current.find((teacher) => {
                return teacher.id == id;
            })

        } else {
            findedTeacher = classeCoordinator.current;
            console.log("🚀 ~ teacherChange ~ classeCoordinator.current:", classeCoordinator.current)
        }



        if (isPresentiel && !findedTeacher) {
            findedTeacher = teachers.current.find((teacher) => {
                return teacher.id == id;
            })
        }

        console.log('findedteacheeerr', findedTeacher)

        if (!seances[currentIndex.current]) {

            setSeances((oldValues) => {

                const newSeance = initialSeance

                setNewSeanceInitValue(newSeance);
                newSeance.manager = findedTeacher

                return [...oldValues, newSeance]
            })

        } else {
            setSeances((oldValues) => {
                const seances = oldValues.map((seance, index) => {
                    if (index == currentIndex.current) {
                        seance.manager = findedTeacher;
                    }
                    return seance
                })

                return seances
            })
        }
    }



    function roomChange(event) {

        setSelectedElementSalle(event.target.value);

        const findedRoom = rooms.current.find((room) => {
            return room.id == event.target.value;
        })
        if (!seances[currentIndex.current]) {



            setSeances((oldValues) => {
                const newSeance = initialSeance

                setNewSeanceInitValue(newSeance);
                newSeance.salle = findedRoom;

                return [...oldValues, newSeance]
            });

        } else {
            setSeances((oldValues) => {
                const seances = oldValues.map((seance, index) => {
                    if (index == currentIndex.current) {
                        seance.salle = findedRoom;
                    }
                    return seance
                })

                return seances
            });
        }
    }


    function typeSeanceChange(event) {


        const findedTypeseance = typeseances.current.find((room) => {
            return room.id == event.target.value;
        })
        if (findedTypeseance?.label != 'presentiel') {
            // setSelectedElementManager(classeCoordinator.current.id);
            isPresentiel = false;
            console.log('ispresentiel', isPresentiel)

            teacherChange(classeCoordinator.current.id)
        } else {
            setSelectedElementManager("");

        }

        setSelectedElementTypeseance(event.target.value);


        if (!seances[currentIndex.current]) {



            setSeances((oldValues) => {
                const newSeance = initialSeance

                setNewSeanceInitValue(newSeance);
                newSeance.type_seance = findedTypeseance;

                return [...oldValues, newSeance]
            });

        } else {
            setSeances((oldValues) => {
                const seances = oldValues.map((seance, index) => {
                    if (index == currentIndex.current) {
                        seance.type_seance = findedTypeseance;
                    }
                    return seance
                })

                return seances
            });
        }
    }

    function fetchData() {
        Promise.all([
            axios.get(`/list/teachers/${classe_id}?withOthers=true`, { signal }),

            axios.get(`/list/modules/classe/${classe_id}?withOthers=true`, { signal }),

            axios.get(`/list/coordinators/${classe_id}`, { signal }),
            axios.get(`/list/coordinators`, { signal }),
            axios.get(`/list/typeseances`, { signal }),
            axios.get(`/list/salles`, { signal }),
        ])
            .then(([classeTeachersRes,

                classeModulesRes,

                classeCoordinatorRes,
                coordinatorsRes,
                typeseancesRes,
                sallesRes]) => {


                classeTeachers.current = classeTeachersRes.data.classeTeachers;
                teachers.current = classeTeachersRes.data.otherTeachers;
                classeModules.current = classeModulesRes.data.classeModules;
                modules.current = classeModulesRes.data.otherModules;
                classeCoordinator.current = classeCoordinatorRes.data;
                coordinators.current = coordinatorsRes.data;
                typeseances.current = typeseancesRes.data;
                rooms.current = sallesRes.data;
                setLoading(false);

            })
            .catch(error => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });

    }

    useEffect(() => {
        if (isUserAuthenticated) {

            fetchData()
        }

    }, [isUserAuthenticated])



    if (loading) {
        return <FallbackContent />
    }


    return (
        <div className='div-container d-flex flex-column'>
            <Navbar />
            <div className='body-content-container d-flex'>
                <SidebarCoordinator />
                <section className={`content-container ${classes['container-addtimetable']} position-relative d-flex`}>
                    <div className={`${classes.row}`}>
                        <div className="col-md-12 mb-4 mt-3 ps-5">
                            <h1 className='py-3'>New timetable for {classe_label}</h1>
                        </div>
                        <Box sx={{ width: 500 }}>
                        <Snackbar
                            sx={{
                                '& .MuiSnackbarContent-root': {
                                    backgroundColor: '#4caf50', // Set your background color
                                    color: '#000',          // Set text color
                                },
                            }}
                            anchorOrigin={{ vertical, horizontal }}
                            open={open}
                            message={responseMessage}
                            key={vertical + horizontal}
                        />
                    </Box>

                        <div className="col-md-12">

                            <div className='d-flex justify-content-end pe-3'>
                                 <button type="button" className="btn btn-success" onClick={() => {
                                OnTimetableSave(seances)
                            }}>Save</button>
                            </div>
                           

                            <div className='mx-5'>
                                {
                                    (hasFocus && timetableErrors?.timetableStart) && <div className="alert alert-danger d-flex align-items-center" role="alert">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
                                            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                                        </svg>
                                        <div>
                                            {timetableErrors.timetableStart}
                                        </div>
                                    </div>
                                }
                                <div className='d-flex justify-content-center align-items-center text-center fs-5 fw-bold mb-5'>
                                    <span>Timetable from</span>

                                    <ThemeProvider theme={theme}>
                                        <div className='dataPickerContainer mx-3'>
                                            <DatePicker
                                                key='from'
                                                onError={(error) => {
                                                    console.log('errorrr', error);
                                                }}
                                                shouldDisableDate={enableOnly}
                                                onChange={selectTimetableStart}
                                                minDate={weekStart}
                                                value={timetableStart === null ? null : dayjs(timetableStart)}
                                            />
                                        </div>

                                    </ThemeProvider>

                                    <span>to</span>
                                    <ThemeProvider theme={theme}>
                                        <div className='dataPickerContainer mx-3'>
                                            <DatePicker
                                                key='to'
                                                onError={(error) => {
                                                    console.log('errorrr', error);
                                                }}
                                                minDate={derivedMinDate(timetableStart, weekStart)}
                                                maxDate={derivedMaxDate(timetableStart, weekStart)}
                                                onChange={selectTimetableEnd}
                                                value={timetableEnd === null ? null : dayjs(timetableEnd)}

                                            />
                                        </div>

                                    </ThemeProvider>
                                </div>



                                <Timetable
                                    seances={seances}
                                    breaks={breaks}
                                    timetableStart={timetableStart}
                                    timetableEnd={timetableEnd}
                                    onTdClick={onTdFocus}
                                    timetableStep={timetableStep}
                                    onError={onError}
                                    timetableStartHour={timetableStartHour}
                                    timetableEndHour={timetableEndHour}
                                    timeTableErrors={seanceErrors}
                                />

                                <div className='my-3'>
                                    <TextField
                                        inputRef={commentsRef}
                                        name='comments'
                                        fullWidth
                                        label="Comments..."
                                        variant="outlined"
                                        margin="normal"
                                        multiline
                                        rows={2} // Specify the number of visible rows
                                        defaultValue={''}

                                    />

                                </div>
                            </div>



                        </div>
                    </div>
                    <div className={`${classes.addSidebar} addSidebar d-flex flex-column justify-content-around h-100 bg-light shadow pt-3 px-3`}>
                        <div>
                            <h4>Sessions parameters</h4>
                        </div>
                        <ThemeProvider theme={theme}>

                            <div className='dataPickerContainer w-100'>
                                <div></div>
                                <DatePicker
                                    key='day'
                                    label="Day"
                                    onError={(error) => {
                                        console.log('errorrr', error);
                                    }}
                                    value={currentDate === null ? null : dayjs(currentDate)}
                                    minDate={dayjs(timetableStart)}
                                    maxDate={dayjs(timetableEnd)}
                                    onChange={dateChange}
                                    disabled={isAllInputsDisabled && isDayDisabled}

                                />
                            </div>

                            <div className='timePicker-container'>
                                {
                                    (timetableErrors?.startHour) && <div className='text-danger'>
                                        {timetableErrors.startHour}
                                    </div>
                                }

                                <TimePicker
                                    label="Start hour"
                                    viewRenderers={{
                                        hours: renderTimeViewClock,
                                        minutes: renderTimeViewClock,
                                        seconds: renderTimeViewClock,
                                    }}
                                    ampm={false}
                                    value={currentStartHour === null ? null : dayjs(currentStartHour)}
                                    onChange={debounce(startHourChange)}
                                   
                                    minTime={startHourMin}

                                    maxTime={startHourMax}
                                    disabled={isAllInputsDisabled}
                                    onError={(error) => {
                                        console.log('errorStartHour')
                                        
                                    }}
                                    onAccept={() => {
                                        removeTimePickerError()
                                    }}

                                    slotProps={{
                                        textField: {
                                            onBlur: (event) => {
                                                console.log('endhour event.target.value', event.target.value)



                                                if (timetableErrors?.startHour) {
                                                    const derivedStartHourMax = dayjs(currentDate)
                                                        .set('hour', startHourMax.hour())
                                                        .set('minute', startHourMax.minute())
                                                        .set('second', 0);
                                                    let value

                                                    if (dayjs(currentStartHour).isAfter(derivedStartHourMax)) {
                                                        value = startHourMax
                                                    }

                                                    const derivedStartHourMin = dayjs(currentDate)
                                                        .set('hour', startHourMin.hour())
                                                        .set('minute', startHourMin.minute())
                                                        .set('second', 0);


                                                    if (dayjs(currentStartHour).isBefore(derivedStartHourMin)) {
                                                        console.log('startHourMin__', startHourMin, derivedStartHourMin.format('YYYY-MM-DD HH:mm:ss'), dayjs(currentStartHour).format('YYYY-MM-DD HH:mm:ss'))

                                                        value = derivedStartHourMin

                                                    }

                                                    if (value) {
                                                        selectedElementEndHour
                                                        const duree_raw = value.diff(dayjs(currentStartHour), 'hours', true);
                                                        const duree = roundUpToStep(duree_raw, 1);
                                                        const defaultValue = [
                                                            { name: 'heure_debut', value: value.format('YYYY-MM-DD HH:mm:ss') },
                                                            { name: 'duree_raw', value: duree_raw },
                                                            { name: 'duree', value: duree }];

                                                        changeSeanceProp(currentIndex.current, { name: 'heure_debut', value });
                                                        setCurrentStartHour(value);
                                                    }

                                                    removeTimePickerError()

                                                }
                                            },
                                        },
                                    }}
                                />
                            </div>

                            <div className='timePicker-container'>

                                {
                                    (timetableErrors?.endHour) && <div className='text-danger'>
                                        {timetableErrors.endHour}
                                    </div>
                                }
                                <TimePicker
                                    label="End hour"
                                    viewRenderers={{
                                        hours: renderTimeViewClock,
                                        minutes: renderTimeViewClock,
                                        seconds: renderTimeViewClock,
                                    }}
                                    ampm={false}
                                    value={selectedElementEndHour ? dayjs(selectedElementEndHour) : null}
                                    // minTime={currentStartHour == null ? null : dayjs(currentStartHour)}
                                    // maxTime={timetableEndHour == null ? null : dayjs()
                                    //     .set('hour', timetableEndHourTimeObj.timeStringHour)
                                    //     .set('minute', timetableEndHourTimeObj.timeStringMinute)
                                    //     .set('second', 0)}

                                    minTime={endHourMin}
                                    maxTime={endHourMax}




                                    onChange={debounce(endHourChange)}
                                    disabled={isAllInputsDisabled || isEndHourDisabled}
                                    inputRef={endHourRef}
                                    onError={(error) => {
                                        console.log('errorEndtHour')
                                        // timePickerErrorSetter({validationError:error},'startHour')
                                    }}
                                    // onBlur={()=>{
                                    //     console.log('onbluuurr')
                                    // }}
                                    onAccept={() => {
                                        removeTimePickerError()
                                    }}

                                    slotProps={{
                                        textField: {
                                            onBlur: (event) => {
                                                console.log('endhour event.target.value', event.target.value)



                                                if (timetableErrors?.endHour) {
                                                    const derivedEndHourMax = dayjs(currentDate)
                                                        .set('hour', endHourMax.hour())
                                                        .set('minute', endHourMax.minute())
                                                        .set('second', 0);
                                                    let value

                                                    if (dayjs(selectedElementEndHour).isAfter(derivedEndHourMax)) {
                                                        value = derivedEndHourMax
                                                    }

                                                    const derivedEndHourMin = dayjs(currentDate)
                                                        .set('hour', endHourMin.hour())
                                                        .set('minute', endHourMin.minute())
                                                        .set('second', 0);


                                                    if (dayjs(selectedElementEndHour).isBefore(derivedEndHourMin)) {

                                                        console.log('endHourMin__', endHourMin, derivedEndHourMin.format('YYYY-MM-DD HH:mm:ss'), dayjs(selectedElementEndHour).format('YYYY-MM-DD HH:mm:ss'))

                                                        value = derivedEndHourMin

                                                    }


                                                    if (value) {
                                                        const duree_raw = value.diff(dayjs(currentStartHour), 'hours', true);
                                                        const duree = roundUpToStep(duree_raw, 1);
                                                        const defaultValue = [
                                                            { name: 'heure_fin', value: value.format('YYYY-MM-DD HH:mm:ss') },
                                                            { name: 'duree_raw', value: duree_raw },
                                                            { name: 'duree', value: duree }];
                                                        if (seances[currentIndex.current]) {
                                                            changeSeanceProp(currentIndex.current, defaultValue);

                                                        } else {
                                                            setNewSeanceInitValue(initialSeance, defaultValue)
                                                            addSeance(initialSeance)
                                                        }



                                                        setSelectedElementEndHour(value);

                                                    }

                                                    removeTimePickerError()

                                                }
                                            },
                                        },
                                    }}
                                />
                            </div>
                            <div>
                                {typeSeanceError &&
                                    <div className={`text-danger fontSize ${classes.fontSize} `}>{typeSeanceError}</div>
                                }
                                <FormControl sx={{ width: '100%' }} size="small">


                                    <InputLabel id="demo-simple-select-label">Session type</InputLabel>
                                    <Select
                                        id="demo-simple-select"
                                        labelId="demo-simple-select-label"
                                        label="Session type"
                                        value={selectedElementTypeseance}
                                        onChange={typeSeanceChange}
                                        disabled={isAllInputsDisabled}
                                    >
                                        {typeseances.current.map((typeseance) => (
                                            <MenuItem
                                                key={typeseance.id}
                                                value={typeseance.id}
                                            >
                                                {typeseance.label}
                                            </MenuItem>
                                        ))}

                                    </Select>
                                </FormControl>
                            </div>


                            <div>
                                {moduleError &&
                                    <div className={`text-danger fontSize ${classes.fontSize} `}>{moduleError}</div>
                                }
                                <FormControl sx={{ width: '100%' }} size='small'>

                                    <InputLabel htmlFor="grouped-select">Module</InputLabel>
                                    <Select
                                        id="grouped-select"
                                        label="modules"
                                        onChange={moduleChange}
                                        disabled={isAllInputsDisabled}

                                        value={selectedElementModule}


                                    >

                                        <ListSubheader>Class' modules</ListSubheader>

                                        {classeModules.current.map((module) => (
                                            <MenuItem
                                                key={module.id}
                                                value={module.id}
                                            >
                                                {module.label}
                                            </MenuItem>
                                        ))}
                                        <ListSubheader>Others</ListSubheader>
                                        {modules.current.map((module) => (
                                            <MenuItem
                                                key={module.id}
                                                value={module.id}
                                            >
                                                {module.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                            <div>
                                {managerError &&
                                    <div className={`text-danger fontSize ${classes.fontSize} `}>{managerError}</div>
                                }
                                <FormControl sx={{ width: '100%' }} size='small'>

                                    <InputLabel htmlFor="grouped-select">Teacher</InputLabel>
                                    <Select
                                        id="grouped-select"
                                        label="teacher"
                                        value={selectedElementManager}
                                        disabled={isAllInputsDisabled}
                                        onChange={(e) => {
                                            teacherChange(e.target.value)
                                        }}

                                    >

                                        <ListSubheader>Class' teachers</ListSubheader>

                                        {derivedClasseManager.map((teacher) => (
                                            <MenuItem
                                                key={teacher.id}
                                                value={teacher.id}
                                            >
                                                {teacher.name} {teacher.lastname}
                                            </MenuItem>
                                        ))}
                                        {isPresentiel && <ListSubheader>Others</ListSubheader>}
                                        {
                                            isPresentiel &&
                                            teachers.current.map((teacher) => (
                                                <MenuItem
                                                    key={teacher.id}
                                                    value={teacher.id}
                                                >
                                                    {teacher.name} {teacher.lastname}
                                                </MenuItem>
                                            ))

                                        }
                                    </Select>
                                </FormControl>

                            </div>
                            <div>
                                {roomError &&
                                    <div className={`text-danger fontSize ${classes.fontSize} `}>{roomError}</div>
                                }
                                <FormControl sx={{ width: '100%' }} size="small" >
                                    <InputLabel id="demo-simple-select-label">Room</InputLabel>
                                    <Select
                                        id="demo-simple-select"
                                        labelId="demo-simple-select-label"
                                        label="Room"
                                        value={selectedElementSalle}
                                        onChange={roomChange}
                                        disabled={isAllInputsDisabled}
                                    >
                                        {rooms.current.map((salle) => (
                                            <MenuItem
                                                key={salle.id}
                                                value={salle.id}
                                            >
                                                {salle.label}
                                            </MenuItem>
                                        ))}

                                    </Select>
                                </FormControl>
                            </div>

                        </ThemeProvider>

                        <div className="d-flex justify-content-end" >
                            <Delete
                            onClick={deleteSeance}
                             />

                        </div>

                    </div>


                </section>
            </div >

            <Footer />
        </div >

    )
}

export default AddTimetable