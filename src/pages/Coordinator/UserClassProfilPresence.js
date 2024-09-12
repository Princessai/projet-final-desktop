import React from 'react';
import Navbar from '../../components/Navbar';
import SidebarCoordinator from '../../components/SidebarCoordinator';
import Footer from '../../components/Footer';
import { Link } from 'react-router-dom';

function UserClassProfilPresence() {
    return (
        <div className='div-container d-flex flex-column'>
            <Navbar />
            <div className='body-content-container d-flex'>
                <SidebarCoordinator />
                <section className='content-container'>
                <div class="row">
    <div class="col-md-12 d-flex  mb-5 mt-3 ms-5">
    <img src="..." class="rounded-circle me-5" alt="..."/>
    <h2>
    NATHAN FOLLIN
    </h2>
    </div>
    <div class="col-md-12 d-flex ps-5">
 <Link  to={'/coordinator/userClass/profil'}>
  <button type="button" class="btn btn-secondary me-5">Missing</button>
 </Link>  
    <button type="button" class="btn btn-secondary">Presence</button>
    </div>
    <div class="col-md-12">
   

   


    </div>
  </div>

                </section>
            </div>

            <Footer />
        </div>

    )
}

export default UserClassProfilPresence