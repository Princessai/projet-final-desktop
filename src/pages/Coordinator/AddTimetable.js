import React, { useEffect, useRef, useState, useCallback } from 'react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Timetable, { convertTimeStringToHour, sessiontype, roundUpToStep } from '../../components/Timetable'
import Navbar from '../../components/Navbar';
import SidebarCoordinator from '../../components/SidebarCoordinator';
import Footer from '../../components/Footer';
import '/src/pages/Presence/presence.css';
import classes from './AddTimetable.module.css';
import { Link, useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { MobileTimePicker, renderTimeViewClock, TimePicker } from '@mui/x-date-pickers';
import { FormControl, InputLabel, ListSubheader, MenuItem, Select } from '@mui/material';
import { useAuth } from '../../Providers/AuthProvider';
import { useAxios } from '../../Providers/AxiosProvider';
import { FallbackContent } from '../../components/FallbackContent';
import Button from '../../components/Button';
import { array } from 'yup';


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

function isValidDate(value) {
    if (isNaN(value.$D) || isNaN(value.$M) || isNaN(value.$y)) {
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

// function getDay(index) {
//     return dayjs().day(index).format('dddd');
// }











function AddTimetable() {

    const { isUserAuthenticated } = useAuth();
    const { axios } = useAxios();

    const [loading, setLoading] = useState(true);  // État de chargement


    const { classe_id, classe_label } = useParams();
    const weekStart = dayjs().startOf('isoWeek').startOf('day');



    const [breaks, setBreaks] = useState([]);
    const [seances, setSeances] = useState([]);
    console.log("🚀 ~ AddTimetable ~ seances:", seances)
    const [timetableStart, setTimetableStart] = useState(null);
    const [timetableEnd, setTimetableEnd] = useState(null);
    const [timetableStep, setTimetableStep] = useState('02:35')
    const stepInHour = convertTimeStringToHour(timetableStep).totalHour;



    if (timetableStart == null && timetableEnd != null) {
        setTimetableStart(dayjs(timetableEnd).startOf('isoWeek').format('YYYY-MM-DD HH:mm:ss'))
    }






    function selectTimetableEnd(value, context) {
        if (isValidDate(value) && context.validationError === null) {
            const date = dayjs(value.$d).format('YYYY-MM-DD HH:mm:ss');
            setTimetableEnd(date);

            console.log('TimetableStart', value, 'date', date);
        }
        console.log(context)

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

    const datacol = useRef([]);

   

    const [currentDate, setCurrentDate] = useState(null);
    const [currentStartHour, setCurrentStartHour] = useState(null);
    const [currentEndHour, setCurrentEndHour] = useState(null);
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
        annee_id: 1
    }

    const [elementType, setElementType] = useState(sessiontype.seances);
    const [selectedElement, setselectedElement] = useState(null);
    console.log("🚀 ~ AddTimetable ~ selectedElement:", selectedElement)

    const hasSelectedElement = selectedElement != null;

    console.log("🚀 ~ AddTimetable ~ hasSelectedElement:", hasSelectedElement)

    const [selectedElementManager, setSelectedElementManager] = useState("");
    const [selectedElementModule, setSelectedElementModule] = useState("");
    const [selectedElementTypeseance, setSelectedElementTypeseance] = useState("");
    const [selectedElementSalle, setSelectedElementSalle] = useState("");
    const [selectedElementDate, setSelectedElementDate] = useState("");
    const [selectedElementStartHour, setSelectedElementStartHour] = useState("");
    const [selectedElementEndHour, setSelectedElementEndHour] = useState(null);


    const selectedTypeseance = typeseances.current.find((typeseance) => {
        return typeseance.id == selectedElementTypeseance;
    })
    console.log("🚀 ~ selectedTypeseance ~ selectedTypeseance:", selectedTypeseance,)
    const isPresentiel = selectedTypeseance?.label == 'presentiel'

    const derivedClasseManager = isPresentiel ? classeTeachers.current : [classeCoordinator.current];
    console.log("🚀 ~ AddTimetable ~ derivedClasseManager:", derivedClasseManager, [classeCoordinator.current])
    function reset() {
        setSelectedElementManager('');
        setSelectedElementModule('');
        setSelectedElementTypeseance('');
        setSelectedElementSalle('');
        // setSelectedElementDate('');
        // setSelectedElementStartHour('');
        setSelectedElementEndHour(null);
    }


    const onTdFocus = useCallback((event, info) => {
        console.log("🚀 ~ onTdFocus ~ info:", info)
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
            console.log("🚀 new~ onTdFocus ~ currentIndex.current:", seances, currentIndex.current)

        } else {

            currentIndex.current = parseFloat(info.index);
            const currentSeance = seances[currentIndex.current];
            setselectedElement(currentSeance);

            setSelectedElementManager(currentSeance.manager.id);
            setSelectedElementModule(currentSeance.module.id);
            setSelectedElementTypeseance(currentSeance.type_seance.id);
            setSelectedElementSalle(currentSeance.salle.id);
            setSelectedElementDate(currentSeance.date);
            setSelectedElementStartHour(currentSeance.heure_debut);

            setSelectedElementEndHour(currentSeance.heure_fin);


            console.log("🚀 ~ onTdFocus ~ currentSeance.manager.id:", currentSeance.manager)
            console.log("🚀 ~ onTdFocus ~ currentSeance.heure_fin:", currentSeance.heure_fin)
        }
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

        setCurrentDate(info.date);



    }, [seances])

    function selectTimetableStart(value, context) {
        if (isValidDate(value) && context.validationError === null) {
            const date = dayjs(value.$d);
            setTimetableStart(date.format('YYYY-MM-DD HH:mm:ss'));
            setTimetableEnd(dayjs(date).day(5).format('YYYY-MM-DD HH:mm:ss'))

            console.log('TimetableStart', value, 'date', date);
        }
        console.log(context)

    }

    function setNewSeanceInitValue(newSeance) {
        const currentStartHourDayjs = dayjs(currentStartHour);
        const heure_debut = currentStartHourDayjs;
        let heure_fin;
        let duree;
        let duree_raw;
        console.log("🚀 ~ setNewSeanceInitValue ~ selectedElementEndHour:", selectedElementEndHour)

        if (selectedElementEndHour == null) {
            heure_fin = currentStartHourDayjs.add(stepInHour, 'hours');

        } else {
            heure_fin = dayjs(selectedElementEndHour);
        }

        duree_raw = heure_fin.diff(heure_debut, 'hours', true);
        duree = roundUpToStep(duree_raw, 1);
        newSeance.heure_debut = heure_debut.format('YYYY-MM-DD HH:mm:ss');
        newSeance.heure_fin = heure_fin.format('YYYY-MM-DD HH:mm:ss');
        newSeance.duree = duree;
        newSeance.duree_raw = duree_raw;

        setSelectedElementEndHour(newSeance.heure_fin);
        console.log("🚀 ~ setNewSeanceInitValue ~ selectedElementEndHour:", selectedElementEndHour, newSeance.heure_fin)

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

    function dateChange(event) {

    }
    function startHourChange(event) {

    }
    function endHourChange(endHour) {
        console.log('endHourChange')
        const initialDayjs = dayjs(currentDate)
        .set('hour', 0)
        .set('minute', 0)
        .set('second', 0)
        .add(endHour.hour(), 'hour')
        .add(endHour.minute(), 'minute');

        datacol.current.find((seance) => {
            const seanceStart = dayjs(seance.heure_debut);
            const seanceEnd = dayjs(seance.heure_fin);
            const currentSeanceStart = dayjs(currentStartHour);
            const currentSeanceEnd = dayjs(endHour);

            const isOverlapsing = isSeanceOverlapse({ start: currentSeanceStart, end: currentSeanceEnd }, { start: seanceStart, end: seanceEnd })

        });
        console.log("🚀 ~ datacol.current.find ~ datacol:", datacol)

        if (!seances[currentIndex.current]) {


            // if(!isOverlapsing){
            // }
            console.log("🚀 ~ endHourChange ~ value:", endHour)
            
            setSeances((oldValues) => {
                const newSeance = initialSeance
                // setNewSeanceInitValue(newSeance);
                const currentStartHourDayjs = dayjs(currentStartHour);
                const heure_debut = currentStartHourDayjs;
                const heure_fin = initialDayjs;
                const duree_raw = heure_fin.diff(heure_debut, 'hours', true);
                const duree = roundUpToStep(duree_raw, 1);

                newSeance.heure_debut = heure_debut.format('YYYY-MM-DD HH:mm:ss');
                newSeance.heure_fin = heure_fin.format('YYYY-MM-DD HH:mm:ss');
                newSeance.duree = duree;
                newSeance.duree_raw = duree_raw;
                
                return [...oldValues, newSeance]
            })

            setSelectedElementEndHour(endHour);


        }

    }

    function moduleChange(event) {
        console.log("event.target.value", event.target.value)
        setSelectedElementModule(event.target.value);
        let findedModule = classeModules.current.find((module) => {
            return module.id == event.target.value;
        })

        if (!findedModule) {
            findedModule = modules.current.find((module) => {
                return module.id == event.target.value;
            })
        }
        console.log("🚀 ~ findedModule=modules.find ~ findedModule:", findedModule)

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
    function teacherChange(event) {
        setSelectedElementManager(event.target.value);
        let findedTeacher;
        if (isPresentiel) {
            findedTeacher = classeTeachers.current.find((teacher) => {
                return teacher.id == event.target.value;
            })

        } else {
            findedTeacher = classeCoordinator.current;
        }


        if (!findedTeacher) {
            findedTeacher = teachers.current.find((teacher) => {
                return teacher.id == event.target.value;
            })
        }
        console.log("🚀 ~ findedteacher=teachers.find ~ findedteacher:", findedTeacher)

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

        console.log("🚀 ~ findedteacher=rooms.find ~ findedteacher:", findedRoom)

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
            console.log('not  presentiel')
            setSelectedElementManager(classeCoordinator.current.id);
        } else {
            setSelectedElementManager("");

        }

        setSelectedElementTypeseance(event.target.value);

        console.log("🚀 ~ findedTypeseance=typeseances.find ~ findedTypeseance:", findedTypeseance)

        if (!seances[currentIndex.current]) {
            // const heure_debut = currentStartHour.format('YYYY-MM-DD HH:mm:ss');
            // let heure_fin;
            // let duree;
            // let duree_raw;
            // if (currentEndHour == null) {
            //     heure_fin = currentStartHour.add(1, 'hours').format('YYYY-MM-DD HH:mm:ss');
            //     duree = 1;
            //     duree_raw = 1;
            // }


            setSeances((oldValues) => {
                const newSeance = initialSeance
                // newSeance.heure_debut = heure_debut;
                // newSeance.heure_fin = heure_fin;
                // newSeance.duree = duree;
                // newSeance.duree_raw = duree_raw;
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
                console.log("🚀 ~ fetchData ~ modules.current:", modules.current)
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


    console.log('add timetable seance', seances)
    console.log('selectedElementManager', selectedElementManager)
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
                        <div className="col-md-12 mb-5 d-flex">

                        </div>
                        <div className="col-md-12">

                            <div className='mx-5'>
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
                                />

                                <div>
                                    <p className='text-center text-danger fw-bold text-decoration-underline'>
                                        NB: VOTRE RENDU EST A FAIRE DANS LE DELAIS. VOUS PRESENTEREZ LE 14 MAI</p>
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
                                <DatePicker
                                    key='to'
                                    label="Date"
                                    onError={(error) => {
                                        console.log('errorrr', error);
                                    }}
                                    value={currentDate === null ? null : dayjs(currentDate)}
                                    minDate={dayjs(timetableStart)}
                                    maxDate={dayjs(timetableEnd)}

                                />
                            </div>

                            <div className='timePicker-container'>
                                <TimePicker
                                    label="Start hour"
                                    viewRenderers={{
                                        hours: renderTimeViewClock,
                                        minutes: renderTimeViewClock,
                                        seconds: renderTimeViewClock,
                                    }}
                                    ampm={false}
                                    value={currentStartHour === null ? null : dayjs(currentStartHour)}

                                />
                            </div>

                            <div className='timePicker-container'>
                                <TimePicker
                                    label="End hour"
                                    viewRenderers={{
                                        hours: renderTimeViewClock,
                                        minutes: renderTimeViewClock,
                                        seconds: renderTimeViewClock,
                                    }}
                                    ampm={false}
                                    value={selectedElementEndHour ? dayjs(selectedElementEndHour) : null}
                                    onChange={endHourChange}
                                />
                            </div>

                            <div>

                                <FormControl sx={{ width: '100%' }} size='small'>
                                    <InputLabel htmlFor="grouped-select">Module</InputLabel>
                                    <Select
                                        id="grouped-select"
                                        label="modules"
                                        onChange={moduleChange}

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

                                <FormControl sx={{ width: '100%' }} size='small'>
                                    <InputLabel htmlFor="grouped-select">Teacher</InputLabel>
                                    <Select
                                        id="grouped-select"
                                        label="teacher"
                                        value={selectedElementManager}

                                        onChange={teacherChange}
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
                                <FormControl sx={{ width: '100%' }} size="small">
                                    <InputLabel id="demo-simple-select-label">Session type</InputLabel>
                                    <Select
                                        id="demo-simple-select"
                                        labelId="demo-simple-select-label"
                                        label="Session type"
                                        value={selectedElementTypeseance}
                                        onChange={typeSeanceChange}
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
                                <FormControl sx={{ width: '100%' }} size="small" >
                                    <InputLabel id="demo-simple-select-label">Room</InputLabel>
                                    <Select
                                        id="demo-simple-select"
                                        labelId="demo-simple-select-label"
                                        label="Room"
                                        value={selectedElementSalle}
                                        onChange={roomChange}
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
                            <button type="button" className="btn btn-success">Add</button>
                        </div>

                    </div>


                </section>
            </div>

            <Footer />
        </div>

    )
}

export default AddTimetable