import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import SidebarCoordinator from '../../components/SidebarCoordinator';
import Footer from '../../components/Footer';
import { Link, useParams } from 'react-router-dom';
import { FallbackContent } from '../../components/FallbackContent';
import { useAxios } from '../../Providers/AxiosProvider';

function UserClassProfilPresence() {

    const { student_id } = useParams();

    const [studentsInfos, setStudentsInfos] = useState([]);
  
    const [absences, setAbsences] = useState([]);
  
    const { axios } = useAxios();
  
  
    const [loading, setLoading] = useState(true);  // État de chargement
  
  
    function fetchStudentsInfos() {
      console.log('fetch student Infos');
      axios.get(`/student/${student_id}`)
        .then(function (response) {
  
          const studentsInfos = response.data;
  
          setStudentsInfos((oldvalue) => [studentsInfos]);
          setLoading(false);
          console.log(studentsInfos);
  
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        });
  
    }
  
    // function fetchStudentsAbsences() {
    //   console.log('fetch student Absences');
  
    //   axios.get(`/list/absences/student/${student_id}`)
    //     .then(function (response) {
  
    //       const absences = response.data;
  
    //       setAbsences((oldvalue) => [absences]);
    //       setLoading(false);
    //       console.log("student's absences", absences);
  
    //     })
    //     .catch(function (error) {
    //       // handle error
    //       console.log(error);
    //     });
  
    // }
  
    useEffect(function () {
  
      fetchStudentsInfos();
    //   fetchStudentsAbsences();
  
  
    }, [])
  

    if (loading) return <FallbackContent />;

    return (
        <div className='div-container d-flex flex-column'>
            <Navbar />
            <div className='body-content-container d-flex'>
                <SidebarCoordinator />
                <section className='content-container'>

                    <div className="">
                        <div className="col-md-12 mb-5 mt-3 ms-5">
                            <div className='d-flex my-5'>
                                <img src="..." className="rounded-circle me-5" alt="..." />
                                <h2>
                                    {studentsInfos[0].name} {studentsInfos[0].lastname}
                                </h2>
                            </div>
                            <p> <span className='fw-bold'>Email:</span> {studentsInfos[0].email}</p>
                            <p> <span className='fw-bold'>Phone number:</span> {studentsInfos[0].phone_number}</p>
                            <p> <span className='fw-bold'>Class:</span> {studentsInfos[0].classe[0].label}</p>

                        </div>
                        <div className="col-md-12 d-flex ps-5">
                            <button type="button" className="btn btn-secondary me-5">Missing</button>
                            <Link to={'/coordinator/userClass/profil/presence'}>
                                <button type="button" className="btn btn-secondary">Presence</button>
                            </Link>

                        </div>
                        <div className="col-md-10 graphics-container">


                        </div>
                    </div>



                    {/* <div class="row">
                        <div class="col-md-12 d-flex  mb-5 mt-3 ms-5">
                            <img src="..." class="rounded-circle me-5" alt="..." />
                            <h2>
                                NATHAN FOLLIN
                            </h2>
                        </div>
                        <div class="col-md-12 d-flex ps-5">
                            <Link to={''}>
                                <button type="button" class="btn btn-secondary me-5">Missing</button>
                            </Link>
                            <button type="button" class="btn btn-secondary">Presence</button>
                        </div>
                        <div class="col-md-12">





                        </div>
                    </div> */}

                </section>
            </div>

            <Footer />
        </div>

    )
}

export default UserClassProfilPresence