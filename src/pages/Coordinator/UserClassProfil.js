import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import SidebarCoordinator from '../../components/SidebarCoordinator';
import Footer from '../../components/Footer';
import dayjs from 'dayjs';
import { Link, useParams } from 'react-router-dom';
import { FallbackContent } from '../../components/FallbackContent';
import { useAxios } from '../../Providers/AxiosProvider';

function UserClassProfilMissing() {

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

  function fetchStudentsAbsences() {
    console.log('fetch student Absences');

    axios.get(`/list/absences/student/${student_id}`)
      .then(function (response) {

        const absences = response.data;

        setAbsences((oldvalue) => [absences]);
        setLoading(false);
        console.log("student's absences", absences);

      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });

  }

  useEffect(function () {

    fetchStudentsInfos();
    fetchStudentsAbsences();


  }, [])

  console.log("student's absences after useeffect", absences);

  // if (absences[0]) {

  //   let justifiedAbsences = absences[0].justified;
  //   console.log('justifiedAbsences', justifiedAbsences);

  //   let heure_debut = justifiedAbsences[0].seance_heure_debut.split(' ');
  //   console.log('heure_debut', heure_debut)

  //   let unJustifiedAbsences = absences[0].notjustified;
  //   console.log('unJustifiedAbsences', unJustifiedAbsences);

  // }
  // let justifiedAbsences = absences[0].justified;
  //     console.log('justifiedAbsences', justifiedAbsences);

  // let unJustifiedAbsences = absences[0];
  //     console.log('unJustifiedAbsences', unJustifiedAbsences);


  if (loading) return <FallbackContent />;


  if (absences[0]) 
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
            <div className="col-md-10 accordion-container">

              <div className="accordion m-3 mt-5" id="accordionPanelsStayOpenExample ">
                <div className="accordion-item mb-3">
                  <h2 className="accordion-header">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                      <strong className="m-auto ">Justified absences</strong>
                    </button>
                  </h2>
                  <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse show">
                    <div className="accordion-body">
                      {
                        absences[0].justified.map((absence, index) => {
                          let heure_debut = dayjs(absence.seance_heure_debut).format('HH:mm');
                          let heure_fin = dayjs(absence.seance_heure_fin).format('HH:mm');
                          let date = dayjs(absence.seance_heure_fin).format('MMMM D, YYYY');

                          // let
                          return <div key={index} className='d-flex justify-content-around border-bottom mb-3' >
                            <p className='fw-bold'>{date}</p>
                            <p> {heure_debut} - {heure_fin}</p>
                            <p> {absence.type_seance}</p>
                            <p>{absence.module}</p>

                          </div>

                        })
                      }

                    </div>
                  </div>
                </div>
                <div className="accordion-item border-top">
                  <h2 className="accordion-header ">
                    <button className="accordion-button collapsed " type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">
                      <strong className="m-auto"> Unjustified absences</strong>
                    </button>
                  </h2>
                  <div id="panelsStayOpen-collapseTwo" className="accordion-collapse collapse">
                    <div className="accordion-body">
                      {
                        absences[0].notjustified.map((absence, index) => {
                          let heure_debut = dayjs(absence.seance_heure_debut).format('HH:mm');
                          let heure_fin = dayjs(absence.seance_heure_fin).format('HH:mm');
                          let date = dayjs(absence.seance_heure_fin).format('MMMM D, YYYY');

                          return <div key={index} className='d-flex justify-content-around align-items-center border-bottom mb-3' >
                            <p className='fw-bold'>{date}</p>
                            <p>{heure_debut} - {heure_fin}</p>
                            <p>{absence.type_seance}</p>
                            <p>{absence.module}</p>

                            <div>
                              <button className='btn btn-success mx-3 mb-3'>Justify</button>
                            </div>

                          </div>


                        })
                      }

                    </div>
                  </div>
                </div>

              </div>


            </div>
          </div>

        </section>
      </div>

      <Footer />
    </div>

  )
}

export default UserClassProfilMissing