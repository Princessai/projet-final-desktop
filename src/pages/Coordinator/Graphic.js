import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import SidebarCoordinator from '../../components/SidebarCoordinator';
import Footer from '../../components/Footer';
import { Link } from 'react-router-dom';
import { useAxios } from '../../Providers/AxiosProvider';
import { FallbackContent } from '../../components/FallbackContent';
import { useEffect } from 'react';
import { useAuth } from '../../Providers/AuthProvider';
import BarChart from '../../components/BarChart';

function Graphic() {

    const [selectedView, setSelectedView] = useState("allClasses");

    const [selectedGraph, setSelectedGraph] = useState('overall');

    const { isUserAuthenticated } = useAuth();


    const [graphicsData, setGraphicsData] = useState({
        classesAttendance: null,
        semesterAttendances: null,
        classes: null,
    })

    const { axios } = useAxios();


    const [loading, setLoading] = useState(false);  // État de chargement

    const semesters = selectedGraph === 'overall' ? [1, 2, 3] : selectedGraph;

    function fetchData() {
        /*
         la méthode "Promise.all()" permet (en gros) de lancer plusieurs requêtes a la fois.
         Elle prend en un élément itérable comme entrée 
         et renvoie une seule instance de promesse.
        */
        Promise.all([
            axios.get(`/presence/classes`),
            axios.get(`/list/classes`),
            axios.get(`/gethours/classes/year_segments/${semesters}`),
        ])
            .then(([classesAttendanceRes, classesRes, semesterAttendancesRes]) => {
                setGraphicsData({
                    classesAttendance: classesAttendanceRes.data,
                    semesterAttendances: semesterAttendancesRes.data,
                    classes: classesRes.data,
                });
                console.log('classes innn useffect', graphicsData.classes);

                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    }

    // function fetchSemesterData(semester) {
    //     axios.get(`/gethours/classes/year_segments/${semester}`)
    //         .then((response) => {
    //             setGraphicsData({
    //                 semesterAttendances: response
    //             });

    //             setLoading(false);
    //         })
    //         .catch(error => {
    //             console.error("Error fetching data:", error);
    //             setLoading(false);
    //         })
    // }

    useEffect(() => {

        if (isUserAuthenticated) {
            fetchData();
        }
        console.log('useeeeee')

    }, [isUserAuthenticated]);

    let classes = graphicsData.classes;
    let classesAttendance = graphicsData.classesAttendance;
    let semesterAttendances = graphicsData.semesterAttendances;

    console.log("🚀 ~ Graphic ~  semesterAttendances:", semesterAttendances)
    console.log('selectedGraph', selectedGraph)

    let classesAttendanceData = [];
    let classesAttendanceLabel = [];

    let semesterAttendancesData = [];
    let semesterAttendancesLabel = [];

    let semesterData = {};

    semesterAttendances?.map(classe => {

        if (classe.yearSegments.length > 0) {
            classe.yearSegments?.map(yearSegment => {

                let number = yearSegment.number;
                if (selectedGraph == 'overall' || number == selectedGraph) {
                    if (!semesterData[number]) {
                        semesterData[number] = [];
                    }
                    const workedHours = yearSegment.workedHours?.all || '';
                    semesterData[number].push(workedHours)

                }


            })

        }
    });
    console.log("🚀 ~ Graphic ~ semesterData:", semesterData)

    semesterAttendancesData = Object.keys(semesterData).map((semesterNumber) => {

        return {
            label: `Semester ${semesterNumber}`,
            data: semesterData[semesterNumber]
        }

    })
    console.log("🚀 ~ semesterAttendancesData=Object.keys ~ semesterAttendancesData:", semesterAttendancesData)


    // semesterAttendances?.map(classe => {
    //     let currentDataset = {};
    //     if (classe.yearSegments.length > 0) {
    //         currentDataset = classe.yearSegments?.map(yearSegment => {
    //             return {
    //                 label: `${yearSegment.type} ${yearSegment.number}`,
    //                 data: [yearSegment.workedHours?.all] || ''
    //             }
    //             // data.label = `${yearSegment.type} ${yearSegment.number}`;
    //             // data.data = yearSegment.workedHours?.all || '';

    //         })
    //         semesterAttendancesData.push(currentDataset)
    //     }
    //     // if (classe.yearSegments.length == 1) {
    //     //     // data = classe.yearSegments[0].workedHours?.all || '';
    //     //     semesterAttendancesData.push(classe.yearSegments[0].workedHours?.all)
    //     // }

    // });


    classesAttendance?.map((classe) => {
        classesAttendanceData.push(classe.classeAttendanceRate);
        classesAttendanceLabel.push(classe.label);

    }) || [];

    const datasetsBgColor = classesAttendanceData?.map((value) => {
        if (value >= 70) return '#00B050';
        if (value >= 50.1) return '#92D050';
        if (value >= 30.1) return '#FFC000';
        return '#E30F41';
    });

    // let  semesterAttendanceData = [];

    // if (selectedGraph == 'semester1') {
    //     chartTitle= "1st Semester Classes Attendance Rate";

    // }



    if (loading || !classes) {
        return <FallbackContent />;
    }

    return (
        <div className='div-container d-flex flex-column'>
            <Navbar />
            <div className='body-content-container d-flex'>
                <SidebarCoordinator />
                <section className='content-container'>
                    <div className="row">
                        <div className="col-md-12  mb-4 mt-3 ms-5">
                            <h1 className='py-3'>GRAPHICS</h1>
                        </div>
                        <div className="col-md-12 d-flex">
                            <button
                                type="button"
                                className={`btn btn-secondary ms-4 me-4 ${selectedView === 'allClasses' && 'active'}`}
                                onClick={() => setSelectedView("allClasses")}
                            >All Classes
                            </button>

                            <button
                                type="button"
                                className={`btn btn-secondary ${selectedView === 'classes' && 'active'}`}
                                onClick={() => setSelectedView("classes")}
                            >
                                Classes
                            </button>

                            {/* <Link to={'/coordinator/graphic/className'}>
                            </Link> */}
                        </div>
                        <div className="col-md-12">
                            {selectedView === 'classes' &&
                                <div className="col-md-12 d-flex flex-wrap">

                                    {classes.map((classe, index) => {
                                        return <div key={index} className="card shadow w-25 m-3" >
                                            <Link to={`/coordinator/graphic/class/details/${classe.id}/${classe.label}`}>
                                                <div className="card-body">
                                                    <p className="card-text"><strong>{classe.label}</strong> </p>
                                                </div>
                                            </Link>
                                        </div>

                                    })}


                                    {/* <div class="card shadow w-25 m-3" >
                                        <img src="..." class="card-img-top" alt="..." />
                                        <Link to={'/coordinator/graphic/class/details'}>
                                            <div class="card-body">
                                                <p class="card-text"><strong>B3 DEV</strong> </p>
                                            </div>
                                        </Link>
                                    </div>


                                    <div class="card shadow w-25 m-3" >
                                        <img src="..." class="card-img-top" alt="..." />
                                        <Link to={'/coordinator/graphic/class/details'}>
                                            <div class="card-body">
                                                <p class="card-text"><strong>B3 DEV</strong> </p>
                                            </div>
                                        </Link>
                                    </div> */}


                                </div>

                            }

                            {selectedView === 'allClasses' &&
                                <div className='my-3 mx-3'>

                                    <div className='my-5'>
                                        <h4 className='text-center'>Year-to-date Classes Attendance Rate</h4>
                                        <BarChart
                                            dataLabel={classesAttendanceLabel}
                                            datasetsLabel='Attendance Rate'
                                            datasetsData={classesAttendanceData}
                                            datasetsBgColor={datasetsBgColor}
                                            chartTitle="Year-to-date Classes Attendance Rate"
                                            legendPosition="bottom"
                                            canvaHeigth={400}
                                        />
                                    </div>

                                    <div>

                                        <div className='d-flex justify-content-end'>
                                            <div style={{ width: '30%' }}>
                                                <select
                                                    className="form-select "
                                                    aria-label="Default select example"
                                                    value={selectedGraph}
                                                    onChange={(e) => setSelectedGraph(e.target.value)}
                                                >
                                                    <option value="overall">Overall</option>
                                                    <option value="1">Semester 1</option>
                                                    <option value="2">Semester 2</option>
                                                    <option value="3">Semester 3</option>
                                                </select>
                                            </div>

                                        </div>


                                        <div className='my-5'>
                                            <h4 className='text-center'>Classes Worked Hours per semester</h4>

                                            <BarChart
                                                dataLabel={classesAttendanceLabel}
                                                datasetsLabel='Worked Hours'
                                                datasets={semesterAttendancesData}
                                                datasetsBgColor={['#002060', '#8FAADC']}
                                                chartTitle={selectedGraph == 'overall' ? 'Overall' : `Semester ${selectedGraph}`}
                                                legendPosition="bottom"
                                                isStacked={true}
                                                canvaHeigth={600}
                                            />

                                        </div>
                                    </div>




                                </div>
                            }
                        </div>
                    </div>

                </section>
            </div>

            <Footer />
        </div>

    )
}

export default Graphic