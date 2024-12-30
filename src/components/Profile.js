import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import style from './Profile.module.css'
import { useAxios } from '../Providers/AxiosProvider';
import { FallbackContent } from './FallbackContent';
import dayjs from 'dayjs';
import { useAuth } from '../Providers/AuthProvider';
import BarChart from './BarChart';
import PieOrDoughnutChart from './PieOrDoughnutChart';


function Absences({ absences, message, user }) {
    return (
        <div>

            <div>
                {absences ?
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Date</th>
                                <th scope="col">Hour</th>
                                <th scope="col">Session Type</th>
                                <th scope="col">Module</th>

                            </tr>
                        </thead>
                        <tbody>

                            {absences.map((absence, index) => {
                                let heure_debut = dayjs(absence.seance_heure_debut).format('HH:mm');
                                let heure_fin = dayjs(absence.seance_heure_fin).format('HH:mm');
                                let date = dayjs(absence.seance_heure_fin).format('MMMM D, YYYY');

                                return <tr key={index} className='border-bottom mb-3' >
                                    <td>{date}</td>
                                    <td> {heure_debut} - {heure_fin}</td>
                                    <td> {absence.type_seance}</td>
                                    <td>{absence.module}</td>


                                    {user.role.label == 'coordinator' &&

                                        <button className='btn btn-success mx-3 mb-3'>Justify</button>

                                    }


                                </tr>


                            })
                            }
                        </tbody>

                    </table> :
                    <p className='fw-bold border-0 text-center text-black-50 fst-italic'>{message}</p>

                }

            </div>

        </div>
    )
}

function Profile({ student }) {


    const { user, currentYear, isUserAuthenticated } = useAuth();
    const annee_id = currentYear.id;

    const [selectedView, setSelectedView] = useState("absences");

    const [selectedChart, setSelectedChart] = useState("weeks");



    // const [absences, setAbsences] = useState();

    // const [attendancesByWeeks, setAttendancesByWeeks] = useState();
    // const [attendanceRate, setAttendanceRate] = useState();


    /* Cette syntaxe me permet d'initialiser plusieurs en une fois */
    const [studentData, setStudentData] = useState({
        absences: null,
        attendancesByWeeks: null,
        attendanceRate: null,
        attendancesByModules: null,
    });


    const { axios } = useAxios();


    const [loading, setLoading] = useState(true);  // État de chargement

    // function fetchStudentsAbsences() {


    //     axios.get(`/list/absences/student/${student.id}`)
    //         .then(function (response) {

    //             const absences = response.data;

    //             console.log("student's absences", absences);
    //             setAbsences((oldvalue) => [absences]);
    //             setLoading(false);

    //         })
    //         .catch(function (error) {
    //             // handle error
    //             console.log(error);
    //         });

    // }

    // function fetchStudentsAttendancesByWeeks() {

    //     axios.get(`/presence/student/weeks/${student.id}/${annee_id}`)
    //         .then(function (response) {

    //             const attendancesByWeeks = response.data;

    //             console.log("student's attendancesByWeeks", attendancesByWeeks);
    //             setAttendancesByWeeks((oldvalue) => [...attendancesByWeeks]);
    //             setLoading(false);

    //         })
    //         .catch(function (error) {
    //             // handle error
    //             console.log(error);
    //         });

    // }

    // function fetchStudentsAttendanceRate() {

    //     axios.get(`/presence/student/${student.id}`)
    //         .then(function (response) {

    //             const attendanceRate = response.data;

    //             console.log("student's attendanceRate", attendanceRate);
    //             setAttendanceRate((oldvalue) => [attendanceRate]);
    //             setLoading(false);

    //         })
    //         .catch(function (error) {
    //             // handle error
    //             console.log(error);
    //         });

    // }


    function fetchData() {
        /*
         la méthode "Promise.all()" permet (en gros) de lancer plusieurs requêtes a la fois.
         Elle prend en un élément itérable comme entrée 
         et renvoie une seule instance de promesse.
        */
        Promise.all([
            axios.get(`/list/absences/student/${student.id}`),
            axios.get(`/presence/student/weeks/${student.id}/${annee_id}`),
            axios.get(`/presence/student/${student.id}`),
            axios.get(`/presence/student/modules/${student.id}/${annee_id}`),
        ])
            .then(([absencesRes, attendancesByWeeksRes, attendanceRateRes, attendancesByModulesRes]) => {
                setStudentData({
                    absences: absencesRes.data,
                    attendancesByWeeks: attendancesByWeeksRes.data,
                    attendanceRate: attendanceRateRes.data,
                    attendancesByModules: attendancesByModulesRes.data,
                });
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    }

    useEffect(function () {

        // fetchStudentsAbsences();
        // fetchStudentsAttendancesByWeeks();
        // fetchStudentsAttendanceRate()

        if (isUserAuthenticated) {
            fetchData();
        }


    }, [isUserAuthenticated]);

    let absences = studentData.absences;
    let attendancesByWeeks = studentData.attendancesByWeeks;
    let attendancesByModules = studentData.attendancesByModules;
    let attendanceRate = studentData.attendanceRate;


    console.log("student's attendanceRate after useeffect", attendanceRate);
    console.log("🚀 ~ Profile ~ absences:", absences)
    console.log("🚀 ~ attendancesByWeeks:", attendancesByWeeks)
    console.log("🚀 ~ Profile ~ attendancesByModules:", attendancesByModules)


    /*
    La syntaxe "?" vérifie si l'élément existe dans le cas contraire renvoie "undefind".
    Dans mon cas il renvoie un tableau vide
    */

    const datasetsDataByWeeks = attendancesByWeeks?.map(attendance => attendance.attendanceRate) || [];

    const dataLabelByWeeks = attendancesByWeeks?.map(attendance => {
        const start = dayjs(attendance.date_debut).format("DD/MM/YYYY");
        const end = dayjs(attendance.date_fin).format("DD/MM/YYYY");
        return `${start}-${end}`;
    }) || [];


    let datasetsDataByModules = [];
    let dataLabelByModules = [];

    attendancesByModules?.map(attendance => {
        datasetsDataByModules.push(attendance.attendanceRate);
        dataLabelByModules.push(attendance.label);
    });

   const datasetsBgColor = datasetsDataByModules.map((value) => {
        if (value >= 70) return '#00B050';
        if (value >= 50.1) return '#92D050';
        if (value >= 30.1) return '#FFC000';
        return '#E30F41';
    });


    let datasetsDataAttendance = [];
    const dataLabelAttendance = ['Attendance rate', 'Absence rate'];

    if (attendanceRate && attendanceRate.length !== 0) {

        let absenceRate = 100 - attendanceRate.attendanceRate;

        datasetsDataAttendance.push(attendanceRate.attendanceRate);
        datasetsDataAttendance.push(absenceRate);

    }

   let chartTitle = selectedChart == "weeks" ? 'Attendance rate per weeks (%)' : 'Year-to-date attendance rate per modules (%)';


    if (loading || !attendanceRate || !attendancesByWeeks) {
        return <FallbackContent />;
    }
    return (
        <>
            <div className='d-flex justify-content-between align-items-center'>
                <div className={`header-container ${style['header-container']} d-flex mb-5 mt-3 ms-3`}>
                    <div className={`picture-container ${style['picture-container']} me-3`}>
                        <img src={student.picture} className={`picture ${style.picture}`} alt="..." />
                    </div>
                    <div>
                        <h2>
                            {student.name} {student.lastname}
                        </h2>
                        <p><span className='fw-bold'>Email: </span>{student.email}</p>
                        <p><span className='fw-bold'>Phone: </span>{student.phone_number}</p>
                        <p><span className='fw-bold'>Class: </span>{student.classe[0].label}</p>

                    </div>
                </div>

                <div className='chart-container w-100 d-flex justify-content-center align-items-center'>
                    <PieOrDoughnutChart
                    data={attendanceRate}
                        dataLabel={dataLabelAttendance}
                        datasetsData={datasetsDataAttendance}
                        chartTitle='Overall attendance rate (%)'
                        legendPosition='bottom'

                    />

                </div>

            </div>

            {/* buttons selected view */}
            <div className="col-md-12 d-flex ps-5">
                <button
                    type="button"
                    className={`btn btn-secondary me-5 ${selectedView === "absences" && "active"}`}
                    onClick={() => setSelectedView("absences")}>
                    Absences
                </button>
                <button
                    type="button"
                    className={`btn btn-secondary ${selectedView === "attendance" && "active"}`}
                    onClick={() => setSelectedView("attendance")}>
                    Attendance rate
                </button>

            </div>


            <div className="col-md-12">

                {selectedView === 'absences' &&
                    <div className="accordion mt-5 mb-5" id="accordionPanelsStayOpenExample ">
                        <div className="accordion-item w-75 m-auto">
                            <h2 className="accordion-header">
                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                                    <strong className="m-auto ">Justified absences</strong>
                                </button>
                            </h2>
                            <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse show">
                                <div className="accordion-body">

                                    <Absences absences={absences.justified} message="No justified absences." user={user} />



                                </div>
                            </div>
                        </div>
                        <div className="accordion-item w-75 m-auto">
                            <h2 className="accordion-header ">
                                <button className="accordion-button collapsed " type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">
                                    <strong className="m-auto"> Unjustified absences</strong>
                                </button>
                            </h2>
                            <div id="panelsStayOpen-collapseTwo" className="accordion-collapse collapse">
                                <div className="accordion-body">

                                    <Absences absences={absences.notjustified} message="No absences." user={user} />

                                </div>
                            </div>
                        </div>

                    </div>}

                {selectedView === 'attendance' &&

                    <div className='my-5 mx-5'>
                        <div className='mb-3' style={{
                            width: '30%',
                        }}>
                            <select
                                className="form-select"
                                aria-label="Default select example"
                                value={selectedChart}
                                onChange={(e) => setSelectedChart(e.target.value)}
                            >
                                <option value="weeks">Per weeks</option>
                                <option value="modules">Per modules</option>
                            </select>
                        </div>

                        <div className='chart-container d-flex justify-content-center align-items-center'>

                            <BarChart
                                dataLabel={selectedChart == "weeks" ? dataLabelByWeeks : dataLabelByModules}
                                datasetsLabel='Attendance rate'
                                datasetsBgColor={datasetsBgColor}
                                datasetsData={selectedChart == "weeks" ? datasetsDataByWeeks : datasetsDataByModules}
                                chartTitle={chartTitle}
                                legendPosition='bottom'
                                isAttendance={true}
                            />

                        </div>

                    </div>
                }

            </div>

        </>
    )
}

export default Profile
