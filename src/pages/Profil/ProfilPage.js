import React from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { Link, useLocation } from 'react-router-dom';
import Profile from '../../components/Profile';
import { useAuth } from '../../Providers/AuthProvider';

function StudentProfil() {

    const { user } = useAuth();
    console.log("🚀 ~ StudentProfil ~ user:", user)

  return (
    <div className='div-container d-flex flex-column'>
      <Navbar />
      <div className='body-content-container d-flex'>
        <Sidebar />
        <section className='content-container'>
          <div className="row">

            <Profile student={user} classe_label={user.classe.label} />
            {/* <div className="col-md-12 d-flex  mb-5 mt-3 ms-5">
              <img src="..." className="rounded-circle me-5" alt="..." />
              <h2>
                NATHAN FOLLIN
              </h2>
            </div>
            <div className="col-md-12 d-flex ps-5">
              <button type="button" className="btn btn-secondary me-5">Missing</button>
              <Link to={'/student/profil/presence'}>
                <button type="button" className="btn btn-secondary">Presence</button>
              </Link>

            </div>
            <div className="col-md-12">


              <div className="accordion " id="accordionPanelsStayOpenExample ">
                <div className="accordion-item w-75 m-auto mt-5 mb-5">
                  <h2 className="accordion-header">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                      <strong className="m-auto ">Justified absences</strong>
                    </button>
                  </h2>
                  <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse show">
                    <div className="accordion-body">
                      RIEN
                    </div>
                  </div>
                </div>
                <div className="accordion-item w-75 m-auto mt-5">
                  <h2 className="accordion-header ">
                    <button className="accordion-button collapsed " type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">
                      <strong className="m-auto"> Unjustified absences</strong>
                    </button>
                  </h2>
                  <div id="panelsStayOpen-collapseTwo" className="accordion-collapse collapse">
                    <div className="accordion-body">
                      RIENN
                    </div>
                  </div>
                </div>

              </div>


            </div> */}
          </div>

        </section>
      </div>

      <Footer />
    </div>

  )
}

export default StudentProfil