import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import SidebarCoordinator from '../../components/SidebarCoordinator'
import Footer from '../../components/Footer'
import { Link, useParams } from 'react-router-dom';
import { useAxios } from '../../Providers/AxiosProvider';
import { FallbackContent } from '../../components/FallbackContent';

let selectedModuleId;


function Modules() {


    const { classe_id, classe_label } = useParams();

    const [modulesList, setModulessList] = useState([]);

    const [message, setMessage] = useState('');
    const [messageVisible, setMessageVisible] = useState(false);

    const [confirmMessageVisible, setConfirmMessageVisible] = useState(false);



    const { axios } = useAxios();


    const [loading, setLoading] = useState(true);  // État de chargement


    function fetchModulesList() {
        console.log('fetch student list');
        axios.get(`/list/modules`)
            .then(function (response) {

                const modulesList = response.data;

                setModulessList((oldvalue) => [...modulesList]);
                setLoading(false);
                console.log(modulesList);

            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });


    }

    // function showConfirmationDiv() {
    //     setConfirmMessageVisible(true);
    // }

    // function handleDelete(student_id) {
    //     console.log('Deleting student');

    //     axios.delete(`/student/${student_id}`)
    //         .then(function (response) {

    //             setMessage(response.message);
    //             setMessageVisible(true);

    //             // retirer le student supprimé de la liste 
    //             setModulessList((oldList) => oldList.filter(student => student.id !== student_id));

    //             setTimeout(() => setMessageVisible(false), 3000);

    //             selectedModuleId = null;

    //             setConfirmMessageVisible(false);

    //         })
    //         .catch(function (error) {
    //             console.error('Error deleting student:', error);
    //         });



    // }

    useEffect(function () {

        fetchModulesList();


    }, [])


    if (loading) return <FallbackContent />;

    return (
        <div className='div-container d-flex flex-column'>
            <Navbar />
            <div className='body-content-container d-flex'>
                <SidebarCoordinator />
                <section className='content-container'>

                    <div className="row w-100">
                        <div className="col-md-12 mb-4 mt-3 ps-5">
                            <h1 className='py-3'>{classe_label} module's list</h1>
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
                                        onClick={() => {
                                            console.log('selecteddddd', selectedModuleId)
                                            // handleDelete(selectedModuleId);
                                        }
                                        }
                                    >Yes</button>
                                    <button type="button" className="btn btn-secondary me-3"
                                        onClick={() => setConfirmMessageVisible(false)}
                                    >No</button>
                                </div>

                            </div>
                            <div
                                className='completionMessage bg-success text-white fw-bold rounded text-center'
                                style={{ display: messageVisible ? 'block' : 'none' }}
                            >
                                {message}
                            </div>
                            {modulesList.map((module, index) => {
                                return <div key={index} className='bloc-presence d-flex justify-content-between align-items-center ms-3 text-center mb-4' >
                                   <div className='ms-5 text-center'> 
                                    <h5> {module.label} </h5> 
                                    </div>

                                    <div>
                                        <Link to={''}>
                                            <button type="button" className="btn btn-warning text-light me-2">EDIT</button>
                                        </Link>
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={() => {
                                                setConfirmMessageVisible(true);
                                                selectedModuleId = student.id;
                                                console.log(student.id);
                                                console.log('selectedddrrrrr', selectedModuleId);
                                            }} >DELETE</button>
                                    </div>
                                </div>


                            })}

                        </div>
                    </div>

                </section>
            </div>

            <Footer />
        </div>
    )
}

export default Modules