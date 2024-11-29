import React, { useState } from 'react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Timetable from '../../components/Timetable'
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


const theme = createTheme({
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        fontSize: '12px', // Font size for the input
                        height: '30px', // Input height
                    },
                    '& .MuiInputLabel-root': {
                        fontSize: '12px', // Label font size
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

function onTdFocus() {
    
}















function AddTimetable() {

    const { classe_label } = useParams();
    const weekStart = dayjs().startOf('isoWeek').startOf('day');


    const [timetableStart, setTimetableStart] = useState(null);
    const [timetableEnd, setTimetableEnd] = useState(null);



    function selectTimetableStart(value, context) {
        if (isValidDate(value) && context.validationError === null) {
            const date = dayjs(value.$d);
            setTimetableStart(date.format('YYYY-MM-DD HH:mm:ss'));
            setTimetableEnd(dayjs(date).day(5).format('YYYY-MM-DD HH:mm:ss'))

            console.log('TimetableStart', value, 'date', date);
        }
        console.log(context)

    }

    function selectTimetableEnd(value, context) {
        if (isValidDate(value) && context.validationError === null) {
            const date = dayjs(value.$d).format('YYYY-MM-DD HH:mm:ss');
            setTimetableEnd(date);

            console.log('TimetableStart', value, 'date', date);
        }
        console.log(context)

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
                                                value={timetableEnd===null?null:dayjs(timetableEnd)}

                                            />
                                        </div>

                                    </ThemeProvider>
                                </div>
                                <Timetable
                                    TimetableData={{ seances: [], pauses: [] }}
                                    timetableStart={timetableStart}
                                    timetableEnd={timetableEnd}
                                    onTdClick={onTdFocus}
                                />

                                <div>
                                    <p className='text-center text-danger fw-bold text-decoration-underline'>
                                        NB: VOTRE RENDU EST A FAIRE DANS LE DELAIS. VOUS PRESENTEREZ LE 14 MAI</p>
                                </div>
                            </div>



                        </div>
                    </div>
                    <div className={`${classes.addSidebar} h-100 bg-danger`}>

                    </div>


                </section>
            </div>

            <Footer />
        </div>

    )
    console.log("🚀 ~ AddTimetable ~ weekStart:", weekStart)
}

export default AddTimetable