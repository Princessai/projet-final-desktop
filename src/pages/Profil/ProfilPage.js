import React from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { Link } from 'react-router-dom';

function StudentProfil() {
    return (
        <div className='div-container d-flex flex-column'>
            <Navbar />
            <div className='body-content-container d-flex'>
                <Sidebar/>
                <section className='content-container'>
                <div class="row">
    <div class="col-md-12 d-flex  mb-5 mt-3 ms-5">
    <img src="..." class="rounded-circle me-5" alt="..."/>
    <h2>
    NATHAN FOLLIN
    </h2>
    </div>
    <div class="col-md-12 d-flex ps-5">
    <button type="button" class="btn btn-secondary me-5">Missing</button>
    <Link  to={'/student/profil/presence'}>
      <button type="button" class="btn btn-secondary">Presence</button>
    </Link>
  
    </div>
    <div class="col-md-12">
   

    <div class="accordion " id="accordionPanelsStayOpenExample ">
                <div class="accordion-item w-75 m-auto mt-5 mb-5">
                  <h2 class="accordion-header">
                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                      <strong class="m-auto ">Justified absences</strong>
                    </button>
                  </h2>
                  <div id="panelsStayOpen-collapseOne" class="accordion-collapse collapse show">
                    <div class="accordion-body">
                      RIEN
                    </div>
                  </div>
                </div>
                <div class="accordion-item w-75 m-auto mt-5">
                  <h2 class="accordion-header ">
                    <button class="accordion-button collapsed " type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">
                      <strong class="m-auto"> Unjustified absences</strong>
                    </button>
                  </h2>
                  <div id="panelsStayOpen-collapseTwo" class="accordion-collapse collapse">
                    <div class="accordion-body">
                      RIENN
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

export default StudentProfil