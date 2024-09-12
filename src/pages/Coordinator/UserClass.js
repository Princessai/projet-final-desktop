import React from 'react';

import Navbar from '../../components/Navbar';
import SidebarCoordinator from '../../components/SidebarCoordinator';
import Footer from '../../components/Footer';
import { Link } from 'react-router-dom';

function UserClass() {
    return (
        <div className='div-container d-flex flex-column'>
            <Navbar />
            <div className='body-content-container d-flex'>
                <SidebarCoordinator />
                <section className='content-container'>
                   
                <div class="row">
    <div class="col-md-12  mb-4 mt-3 ms-5">
    <h1 class='py-3'>STUDENT B3 DEV</h1>
    </div>
    <div class="col-md-12 d-flex justify-content-end pe-5">
    <button type="button" class="btn btn-success me-5">Add Student</button>
    </div>
    <div class="col-md-12 ">

    <div className='bloc-presence shadow d-flex justify-content-between align-items-center ms-5 text-center mt-5 mb-4' >
      <div></div>
      <Link  to={'/coordinator/userClass/profil'}>
       <h5>NATHAN FOLLIN</h5>
      </Link>
    
     <div>
 <Link  to={'/coordinator/userClass/profil'}> 
     <button type="button" class="btn btn-warning text-light me-2">EDIT</button>
     </Link>
     <Link  to={'/teacher/session/call'}> 
     <button type="button" class="btn btn-danger">DELETE</button>
     </Link>
     </div>
    </div>

    <div className='bloc-presence shadow d-flex justify-content-between align-items-center ms-5 text-center mt-5 mb-4' >
      <div></div>
     <h5>NATHAN FOLLIN</h5>
     <div>
 <Link  to={'/teacher/session/call'}> 
     <button type="button" class="btn btn-warning text-light me-2">EDIT</button>
     </Link>
     <Link  to={'/teacher/session/call'}> 
     <button type="button" class="btn btn-danger">DELETE</button>
     </Link>
     </div>
    </div>

    <div className='bloc-presence shadow d-flex justify-content-between align-items-center ms-5 text-center mt-5 mb-4' >
      <div></div>
     <h5>NATHAN FOLLIN</h5>
     <div>
 <Link  to={'/teacher/session/call'}> 
     <button type="button" class="btn btn-warning text-light me-2">EDIT</button>
     </Link>
     <Link  to={'/teacher/session/call'}> 
     <button type="button" class="btn btn-danger">DELETE</button>
     </Link>
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

export default UserClass