import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import SidebarCoordinator from '../../components/SidebarCoordinator';
import Footer from '../../components/Footer';
import { Link, useParams } from 'react-router-dom';
import BarChart from '../../components/BarChart';
import { useEffect } from 'react';
import { useAuth } from '../../Providers/AuthProvider';
import { useAxios } from '../../Providers/AxiosProvider';
import { FallbackContent } from '../../components/FallbackContent';

function GraphicClassDetails() {

    const { classe_id, classe_label } = useParams();

    const { isUserAuthenticated } = useAuth();

    const { axios } = useAxios();

    const [loading, setLoading] = useState(true);  // État de chargement

    const [classeModules, setClasseModules] = useState([]);
    const [studentsAttendances, setStudentsAttendances] = useState([]);
    const [studentsModulesAttendances, setStudentsModulesAttendances] = useState([]);

    const [selectedModule, setSelectedModule] = useState(1);


    function fetchData() {
        /*
         la méthode "Promise.all()" permet (en gros) de lancer plusieurs requêtes a la fois.
         Elle prend en un élément itérable comme entrée 
         et renvoie une seule instance de promesse.
        */
        Promise.all([
            axios.get(`/presence/students/classe/${classe_id}`),
            axios.get(`/list/modules/classe/${classe_id}`),

        ])
            .then(([studentsAttendancesRes, classeModulesRes]) => {

                setClasseModules(classeModulesRes.data);
                setStudentsAttendances(studentsAttendancesRes.data);
                fetchStudentsModulesAttendances(classeModulesRes.data[0].id)
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    }


    function fetchStudentsModulesAttendances(moduleId) {

        /*
         la méthode "Promise.all()" permet (en gros) de lancer plusieurs requêtes a la fois.
         Elle prend en un élément itérable comme entrée 
         et renvoie une seule instance de promesse.
        */

        axios.get(`/presence/students/classe/module/${classe_id}/${moduleId}/`)

            .then((response) => {

                setStudentsModulesAttendances(response.data);
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


    console.log("🚀 ~ GraphicClassDetails ~ classeModules:", classeModules);
    console.log("🚀 ~ GraphicClassDetails ~ studentsAttendances:", studentsAttendances);
    console.log("🚀 ~ GraphicClassDetails ~ studentsModulesAttendances:", studentsModulesAttendances)



    if (loading
        // || !attendanceRate || !attendancesByWeeks
    ) {
        return <FallbackContent />;
    }



    const studentsAttendancesTab = studentsAttendances.studentAttendanceRate;
    const studentsAttendancesModuleTab = studentsModulesAttendances.studentAttendanceRate;

    let dataTab = []
    let dataLabelTab = []

    studentsAttendancesTab.forEach(student => {
        let name = student.lastname + " " + student.name;
        dataLabelTab.push(name);
        dataTab.push(student.attendanceRate);

    });


    let dataModuleTab = []
    let dataLabelModuleTab = []

    studentsAttendancesModuleTab.forEach(student => {
        let name = student.lastname + " " + student.name;
        dataLabelModuleTab.push(name);
        dataModuleTab.push(student.attendanceRate);

    });

    console.log("🚀 ~ GraphicClassDetails ~ dataTab:", dataTab)

    console.log("🚀 ~ GraphicClassDetails ~ dataLabelTab:", dataLabelTab)

    const datasetsBgColor = dataTab.map((value) => {
        if (value >= 70) return '#00B050';
        if (value >= 50.1) return '#92D050';
        if (value >= 30.1) return '#FFC000';
        return '#E30F41';
    });


    return (
        <div className='div-container d-flex flex-column'>
            <Navbar />
            <div className='body-content-container d-flex'>
                <SidebarCoordinator />
                <section className='content-container'>
                    <div className="row">
                        <div className="col-md-12  mb-4 mt-3 ms-5">
                            <h1 className='py-3'>{classe_label}'s graphics</h1>
                        </div>


                        <div className='my-5 mx-5'>
                            <div className='me-3 chart-container d-flex flex-column justify-content-center align-items-center'>
                            <h4 className='text-center'>{classe_label}'s students attendance rate</h4>
                                <BarChart
                                    dataLabel={dataLabelTab}
                                    datasetsLabel='Attendance Rate'
                                    datasetsData={dataTab}
                                    datasetsBgColor={datasetsBgColor}
                                    chartTitle={`${classe_label}'s students attendance rate`}
                                    legendPosition='bottom'
                                    canvaHeigth={500}
                                    canvaWidth={90}
                                />

                            </div>

                            <div className='mt-5'>
                            <h4 className='text-center'>{classe_label}'s students attendance rate per module</h4>

                                <div className='mb-3' style={{
                                    width: '30%',
                                }}>
                                    <select
                                        className="form-select"
                                        aria-label="Default select example"
                                        value={selectedModule}
                                        onChange={(e) => {
                                            setSelectedModule(e.target.value);
                                            fetchStudentsModulesAttendances(e.target.value);
                                        }
                                        }
                                    >
                                        {
                                            classeModules.map((module, index) => {
                                                return <option key={index} value={module.id}>{module.label}</option>
                                            })
                                        }


                                    </select>



                                </div>
                                <div className='chart-container d-flex flex-column justify-content-center align-items-center'>
                                    <BarChart
                                        dataLabel={dataLabelModuleTab}
                                        datasetsLabel='Attendance rate'
                                        datasetsBgColor={datasetsBgColor}
                                        datasetsData={dataModuleTab}
                                        chartTitle={`${classe_label}'s students attendance rate per module`}
                                        legendPosition='bottom'
                                        canvaHeigth={500}
                                        canvaWidth={90}

                                    />

                                </div>

                            </div>

                            <div className='chart-container d-flex justify-content-center align-items-center'>

                                {/* // <BarChart
                                // dataLabel={selectedChart == "weeks" ? dataLabelByWeeks : dataLabelByModules}
                                // datasetsLabel='Attendance rate'
                                // datasetsBgColor={datasetsBgColor}
                                // datasetsData={selectedChart == "weeks" ? datasetsDataByWeeks : datasetsDataByModules}
                                // chartTitle={chartTitle}
                                // legendPosition='bottom'
                                // isAttendance={true}
                                /> */}

                            </div>

                        </div>

                    </div>

                </section>
            </div>

            <Footer />
        </div>

    )
}

export default GraphicClassDetails