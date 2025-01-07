import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import style from './Profile.module.css'
import { useAxios } from '../Providers/AxiosProvider';
import { FallbackContent } from './FallbackContent';
import dayjs from 'dayjs';
import { useAuth } from '../Providers/AuthProvider';
import BarChart from './BarChart';
import PieOrDoughnutChart from './PieOrDoughnutChart';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Modal, styled, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Add, Visibility } from '@mui/icons-material';
import FileInput from './FileInput';
import { SaveAltOutlined } from '@mui/icons-material';
import { set } from 'react-hook-form';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

function Absences({ absences, student, absencesState, message, user, onAbsenceStateChange }) {
    console.log("🚀 ~ Absences ~ absences:", absences)
    const abortControllerRef = useRef(null);
    const absenceIdRef = useRef(null);
    const absenceRef = useRef(null);
    const selectedAbsence = absenceRef.current;

    const [imageVisible, setImageVisible] = useState(false);
    const [justificationModal, setjustificationModal] = useState(false);
    const [justificationDetailsModal, setjustificationDetailsModal] = useState(false);
    const [fileName, setFileName] = useState(null);
    const [PreviewUrl, setPreviewUrl] = useState(null);


    const { axios } = useAxios();

    useEffect(() => {
        return function () {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();

            }
        }
    }, [])

    function justifyAbsence(absenceId, formdatas) {



        abortControllerRef.current = new AbortController();


        axios.post(`/justify/absence/${absenceId}`, formdatas, {
            headers: { "Content-Type": "multipart/form-data" },
            signal: abortControllerRef.current.signal
        })
            .then(function (response) {
                const dataRes = response.data;
                console.log("🚀 ~ dataRes:", dataRes);
                console.log("🚀 ~ justifyAbsence ~ data:", formdatas)
                const comments = formdatas.get('comments')
                const props = [{ name: 'comments', value: comments }];
                Object.keys(dataRes).forEach((key) => {
                    props.push({ name: key, value: dataRes[key] })
                })
                console.log("🚀 ~ props:", props)


                if (onAbsenceStateChange) {
                    onAbsenceStateChange(absenceId, absencesState, props)
                }
            })
            .catch(function (error) {
                // handle error
                console.error(error);
            });


    }

    // function downloadFile(path, name = ' ') {

    //     axios.get(`/download/file?path=${path}&name=${name}`, {
    //         headers: { "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7" },
    //     })
    //         .then((response) => {
    //             console.log(response)
    //         })
    // }
    function absenceSetter(absenceId) {
        absenceIdRef.current = absenceId;
        const currentAbsence = absences.find((absence) => {
            if (absence.id == absenceId) return absence;

        })
        if (currentAbsence) {
            absenceRef.current = currentAbsence
            setPreviewUrl(currentAbsence.receiptThumb)
            console.log('currentAbsence.receiptThumb', currentAbsence.receiptThumb)
        };
    }



    function handleClose() {
        console.log('handleClose__')
        setjustificationModal(false);
        setPreviewUrl(null);


    }

    function handleCloseImage() {
        setImageVisible(false);
    }

    function justificationDetailsClose() {
        setjustificationDetailsModal(false);
    }
    function handleSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        justifyAbsence(absenceIdRef.current, formData);

        setjustificationModal(false);

    }
    const isJustified = absencesState != 0;

    const box = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        // width: '70%',
        height: '70%',

        p: 4,
    };

    const showView = (isJustified && selectedAbsence && imageVisible && selectedAbsence?.receiptThumb == PreviewUrl);
    console.log('PreviewUrl', PreviewUrl, selectedAbsence?.receiptImage)

    function resizeImage(file, OnResizeEnd) {
        console.log("🚀 ~ image ~ fileSize:", file.size)
        const url = URL.createObjectURL(file);
        const image = new Image();

        image.src = url;
        image.onload = function () {
            // document.body.appendChild(image);

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;

            ctx.drawImage(image, 0, 0);

            canvas.toBlob((blob) => {

                const fr = new FileReader();

                fr.readAsDataURL(blob);

                fr.addEventListener('load', () => {
                    const dataURL = fr.result;
                    console.log("🚀 ~ fr.addEventListener ~ dataURL:", dataURL)
                    const image2 = new Image();
                    if (OnResizeEnd) {
                        OnResizeEnd(dataURL);
                    }
                    // image2.src = dataURL;
                    // document.body.appendChild(image2);

                    // console.log(blob.size);

                })

            }, 'image/webp', 0.01);
        }
    }


    function downloadLink() {
        return `${axios.defaults.baseURL}download/file?path=${(new URL(selectedAbsence.receiptFile)).pathname.slice(1)}&name=${student.name}_${selectedAbsence.receipt}`
    }


    return (
        <div>

            <div>
                <BootstrapDialog
                    onClose={handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={justificationModal}
                    PaperProps={{
                        component: 'form',
                        encType: "multipart/form-data",
                        onSubmit: handleSubmit,
                        sx: { minWidth: 500, width: 700 }
                    }}

                >
                    <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                        Modal title
                    </DialogTitle>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={(theme) => ({
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: theme.palette.grey[500],
                        })}
                    >
                        <CloseIcon />
                    </IconButton>

                    <DialogContent dividers>

                        {(selectedAbsence) &&
                            <div className='d-flex align-items-end my-3'>
                                {
                                    PreviewUrl && <div style={{
                                        width: '100px',
                                        height: '100px'
                                    }} onClick={() => {
                                        setImageVisible(true);
                                    }} >
                                        <img className={`thumImg ${style.picture}`} src={PreviewUrl} alt='thumb image' />
                                    </div>
                                }

                                {isJustified && <a className='d-flex' href={downloadLink()}
                                >
                                    <SaveAltOutlined
                                    // onClick={() => {
                                    //     const path = (new URL(selectedAbsence.receiptFile)).pathname.slice(1);
                                    //     downloadFile((new URL(selectedAbsence.receiptFile)).pathname.slice(1););
                                    // }}
                                    />
                                    <p className='ms-3'>Download justificatory</p>


                                </a>}

                            </div>
                        }



                        <FileInput label={'Upload Justificatory'} onChange={(e) => {

                            resizeImage(e.target.files[0],
                                (Url) => {
                                    setPreviewUrl(Url);
                                })

                        }} name={'receipt'} />


                        <TextField
                            name='comments'
                            fullWidth
                            label="Comments..."
                            variant="outlined"
                            margin="normal"
                            multiline
                            rows={4} // Specify the number of visible rows
                            defaultValue={absenceRef.current?.comments ? absenceRef.current.comments : ''}

                        />

                    </DialogContent>

                    <DialogActions>
                        <Button autoFocus
                            type="submit"
                        // onClick={handleClose}
                        >
                            Justify
                        </Button>
                    </DialogActions>
                </BootstrapDialog>



                {showView && <Modal
                    open={imageVisible}
                    onClose={handleCloseImage}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={box}>
                        <div>
                            <img className={`receiptImage ${style.picture}`} src={selectedAbsence.receiptImage} alt='' />
                        </div>

                    </Box>
                </Modal>}
            </div>



            <div className={`absence-container ${style['absence-container']}`} style={{
                height: !absences?.length ? 'unset' : '200px'
            }} >
                {absences?.length > 0 ?
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Date</th>
                                <th scope="col">Hour</th>
                                <th scope="col">Session Type</th>
                                <th scope="col">Module</th>
                                {isJustified && <th scope="col">receipt</th>}
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


                                    {(user.role.label == 'coordinator' && absence.etat == 0) &&
                                        <td>
                                            <button
                                                className='btn btn-success mx-3 mb-3'
                                                value={absence.id}
                                                onClick={(e) => {

                                                    setjustificationModal(true);

                                                    absenceSetter(e.target.value);
                                                }}
                                            >Justify</button>

                                        </td>

                                    }


                                    {(isJustified && absence.receiptFile || absence.comments) && <td> <Visibility onClick={() => {
                                        setjustificationModal(true);
                                        absenceSetter(absence.id)

                                    }} /> </td>}

                                </tr>


                            })
                            }
                        </tbody>

                    </table> :
                    <p className='fw-bold border-0 text-center text-black-50 fst-italic'>{message}</p>

                }

            </div>

        </div >
    )
}

function Profile({ student, classe_label }) {


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

        if (isUserAuthenticated) {
            fetchData();
        }


    }, [isUserAuthenticated]);

    let absences = studentData.absences;

    function switchSeance(absenceId, absenceState, props) {
        const absenceStateInverse = absenceState == 0 ? 1 : 0
        absenceId = parseInt(absenceId);
        if (absenceState == 0) {
            let currentAbsenceIndex;
            const currentAbsence = absences.notjustified.find((absence, index) => {

                if (absence.id == absenceId) {
                    currentAbsenceIndex = index
                    return absence;
                };

            })
            console.log("🚀 ~ currentAbsence ~ currentAbsence:", currentAbsence, absences.notjustified)
            console.log("🚀 ~ switchSeance ~ absenceId:", absenceId, currentAbsenceIndex)


            if (currentAbsence) {

                setStudentData((oldStudentData) => {
                    console.log("🚀 ~ setStudentData ~ setStudentData:")

                    const newStudentData = { ...oldStudentData }
                    const newJustifiedAbsences = [...newStudentData.absences.justified]
                    let newUnJustifiedAbsences = newStudentData.absences.notjustified

                    if (absenceState == 0) {
                        newUnJustifiedAbsences = newUnJustifiedAbsences.filter((absence) => {
                            return absence.id != absenceId;
                        })

                        currentAbsence.etat = 1;
                        props.forEach(prop => {
                            if (currentAbsence.hasOwnProperty(prop.name)) {
                                console.log('props__', prop.name, prop.value)
                                currentAbsence[prop.name] = prop.value;
                            }
                        });
                        console.log("🚀 ~ setStudentData ~ currentAbsence:", currentAbsence, props)

                        newJustifiedAbsences.push(currentAbsence);

                    }

                    newStudentData.absences.justified = newJustifiedAbsences;
                    newStudentData.absences.notjustified = newUnJustifiedAbsences;

                    return newStudentData

                })

            }
        }
    }
    let attendancesByWeeks = studentData.attendancesByWeeks;
    let attendancesByModules = studentData.attendancesByModules;
    let attendanceRate = studentData.attendanceRate;




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
                        <p><span className='fw-bold'>Class: </span>{classe_label ? classe_label : student.classe[0].label}</p>

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

                                    <Absences
                                        absences={absences.justified}
                                        absencesState={1}
                                        message="No justified absences."
                                        user={user}
                                        onAbsenceStateChange={switchSeance}
                                        student={student}
                                    />



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

                                    <Absences
                                        absences={absences.notjustified}
                                        absencesState={0}
                                        message="No absences."
                                        user={user}
                                        onAbsenceStateChange={switchSeance}
                                        student={student}
                                    />

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
