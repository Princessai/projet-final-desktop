import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SidebarCoordinator from '../../components/SidebarCoordinator';
import '/src/pages/Presence/presence.css';
import { Link } from 'react-router-dom';



function Call() {
    return (
        <div className='div-container d-flex flex-column'>
            <Navbar />
            <div className='body-content-container d-flex'>
                < SidebarCoordinator/>
                <section className='content-container'>
                <div class="row">
    <div class="col-md-12 mt-3 ms-5">
    <h1 class='py-3'>Session</h1>
    </div>
    <div class="col-md-12  pe-5 d-flex justify-content-end">
    <button type="button" class="btn btn-light me-3 shadow   rounded"> <strong>current session</strong> </button>
    <button type="button" class="btn btn-light me-3 shadow  rounded">  <strong>past session</strong> </button>
    </div>
    <div class="col-md-12 ">
    <div className='bloc-presence shadow d-flex justify-content-between align-items-center m-auto text-center mt-5 mb-4' >
      <div></div>
     <h5>MARDI 9h-12h</h5>
     <Link  to={'/coordinator/call/session'}> 
     <button type="button" class="btn btn-success">Start session</button>
     </Link>
    </div>

    <div className='bloc-inactif shadow d-flex justify-content-center align-items-center m-auto text-center mt-5 mb-4' >

     <h5 class="me-5">MARDI 9h-12h</h5>
    
    </div>

    <div className='bloc-inactif shadow d-flex justify-content-center align-items-center m-auto text-center mt-5 mb-4' >

<h5 class="me-5">MARDI 9h-12h</h5>

</div>

    </div>
  </div>

                </section>
            </div>

            <Footer />
        </div>

    )
}

export default Call