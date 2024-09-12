import React from 'react';

import Navbar from '../../components/Navbar';
import SidebarCoordinator from '../../components/SidebarCoordinator';
import Footer from '../../components/Footer';
import { Link } from 'react-router-dom';

function User() {
    return (
        <div className='div-container d-flex flex-column'>
            <Navbar />
            <div className='body-content-container d-flex'>
                <SidebarCoordinator />
                <section className='content-container'>
                   
                <div class="row">
    <div class="col-md-12  mb-4 mt-3 ms-5">
    <h1 class='py-3'>Class</h1>
    </div>
    <div class="col-md-12 d-flex flex-wrap">
     
    <div class="card shadow w-25 m-3" >
  <img src="..." class="card-img-top" alt="..."/>
  <Link  to={'/coordinator/userClass'}>
  <div class="card-body">
    <p class="card-text"><strong>B3 DEV</strong> </p>
  </div>
  </Link>
</div>

<div class="card shadow w-25 m-3" >
  <img src="..." class="card-img-top" alt="..."/>
  <Link  to={'/coordinator/userClass'}>
  <div class="card-body">
    <p class="card-text"><strong>B3 DEV</strong> </p>
  </div>
  </Link>
</div>

    </div>
   
  </div>

                </section>
            </div>

            <Footer />
        </div>

    )
}

export default User