import React, { useEffect, useRef, useState } from 'react';

import Navbar from '../../components/Navbar';
import SidebarCoordinator from '../../components/SidebarCoordinator';
import Footer from '../../components/Footer';
import { Link, useParams } from 'react-router-dom';
import { FallbackContent } from '../../components/FallbackContent';
import { useAxios } from '../../Providers/AxiosProvider';

let selectedStudentId;


function UserClass() {

    const { classe_id, classe_label } = useParams();

    const [studentsList, setStudentsList] = useState([]);

    const [message, setMessage] = useState('');
    const [messageVisible, setMessageVisible] = useState(false);

    const [confirmMessageVisible, setConfirmMessageVisible] = useState(false);



    const { axios } = useAxios();


    const [loading, setLoading] = useState(true);  // État de chargement


    function fetchStudentsList() {
        console.log('fetch student list');
        axios.get(`/list/students/classe/${classe_id}`)
            .then(function (response) {

                const studentsList = response.data;

                setStudentsList((oldvalue) => [...studentsList]);
                setLoading(false);
                console.log(studentsList);

            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });


    }

    // function showConfirmationDiv() {
    //     setConfirmMessageVisible(true);
    // }

    function handleDelete(student_id) {
        console.log('Deleting student');

        axios.delete(`/student/${student_id}`)
            .then(function (response) {

                setMessage(response.message);
                setMessageVisible(true);

                // retirer le student supprimé de la liste 
                setStudentsList((oldList) => oldList.filter(student => student.id !== student_id));

                setTimeout(() => setMessageVisible(false), 3000);

                selectedStudentId = null;

                setConfirmMessageVisible(false);

            })
            .catch(function (error) {
                console.error('Error deleting student:', error);
            });

            

    }

    useEffect(function () {

        fetchStudentsList();


    }, [])


    if (loading) return <FallbackContent />;

    console.log(confirmMessageVisible)
    return (
        <div className='div-container d-flex flex-column'>
            <Navbar />
            <div className='body-content-container d-flex'>
                <SidebarCoordinator />
                <section className='content-container'>

                    <div className="row w-100">
                        <div className="col-md-12 mb-4 mt-3 ps-5">
                            <h1 className='py-3'>{classe_label} student's list</h1>
                        </div>
                        <div className="col-md-12 d-flex justify-content-end">
                            <button type="button" className="btn btn-success me-3">Add Student</button>
                        </div>

                        <div className="col-md-12 my-3 px-5">
                            <div
                                className='confirmationDiv text-white bg-danger text-center rounded'
                                style={{ display: confirmMessageVisible ? 'block' : 'none' }}
                            >
                                <h3 className='fw-bold'>WARNING !</h3>

                                Do you really want to delete this student ?
                                <div className='mt-3'>
                                    <button type="button" className="btn btn-outline-light me-3"
                                    onClick={()=>
                                        {
                                            console.log('selecteddddd',selectedStudentId)
                                            handleDelete(selectedStudentId);
                                        }
                                        }
                                    >Yes</button>
                                    <button type="button" className="btn btn-secondary me-3"
                                    onClick={()=>setConfirmMessageVisible(false)}
                                    >No</button>
                                </div>

                            </div>
                            <div
                                className='completionMessage bg-success text-white fw-bold rounded text-center'
                                style={{ display: messageVisible ? 'block' : 'none' }}
                            >
                                {message}
                            </div>
                            {studentsList.map((student, index) => {
                                return <div key={index} className='bloc-presence d-flex justify-content-between align-items-center ms-3 text-center mb-4' >
                                   <div className='picture-container'>
                                    <img src={student.picture} className='profile-picture' />
                                   </div>
                                    <Link to={`/coordinator/userClass/profil/${student.id}`}>
                                        <h5> {student.name} {student.lastname} </h5>
                                    </Link>

                                    <div>
                                        <Link to={''}>
                                            <button type="button" className="btn btn-warning text-light me-2">EDIT</button>
                                        </Link>
                                        <Link to={''}>
                                            <button
                                                type="button"
                                                className="btn btn-danger"
                                                onClick={() => {
                                                    setConfirmMessageVisible(true);
                                                    selectedStudentId = student.id;
                                                    console.log(student.id);
                                                    console.log('selectedddrrrrr',selectedStudentId);
                                                }} >DELETE</button>
                                        </Link>
                                    </div>
                                </div>


                            })}

                            {/* <div className='bloc-presence shadow d-flex justify-content-between align-items-center ms-5 text-center mt-5 mb-4' >
                                <div></div>
                                <Link to={'/coordinator/userClass/profil'}>
                                    <h5>NATHAN FOLLIN</h5>
                                </Link>

                                <div>
                                    <Link to={'/coordinator/userClass/profil'}>
                                        <button type="button" className="btn btn-warning text-light me-2">EDIT</button>
                                    </Link>
                                    <Link to={'/teacher/session/call'}>
                                        <button type="button" className="btn btn-danger">DELETE</button>
                                    </Link>
                                </div>
                            </div>

                            <div className='bloc-presence shadow d-flex justify-content-between align-items-center ms-5 text-center mt-5 mb-4' >
                                <div></div>
                                <h5>NATHAN FOLLIN</h5>
                                <div>
                                    <Link to={'/teacher/session/call'}>
                                        <button type="button" className="btn btn-warning text-light me-2">EDIT</button>
                                    </Link>
                                    <Link to={'/teacher/session/call'}>
                                        <button type="button" className="btn btn-danger">DELETE</button>
                                    </Link>
                                </div>
                            </div>

                            <div className='bloc-presence shadow d-flex justify-content-between align-items-center ms-5 text-center mt-5 mb-4' >
                                <div></div>
                                <h5>NATHAN FOLLIN</h5>
                                <div>
                                    <Link to={'/teacher/session/call'}>
                                        <button type="button" className="btn btn-warning text-light me-2">EDIT</button>
                                    </Link>
                                    <Link to={'/teacher/session/call'}>
                                        <button type="button" className="btn btn-danger">DELETE</button>
                                    </Link>
                                </div>
                            </div>
 */}
                        </div>
                    </div>

                </section>
            </div>

            <Footer />
        </div>

    )
}

export default UserClass