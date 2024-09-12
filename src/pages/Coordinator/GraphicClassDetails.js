import React from 'react';
import Navbar from '../../components/Navbar';
import SidebarCoordinator from '../../components/SidebarCoordinator';
import Footer from '../../components/Footer';
import { Link } from 'react-router-dom';

function GraphicClassDetails() {
    return (
        <div className='div-container d-flex flex-column'>
            <Navbar />
            <div className='body-content-container d-flex'>
                <SidebarCoordinator />
                <section className='content-container'>
                <div class="row">
    <div class="col-md-12  mb-4 mt-3 ms-5">
    <h1 class='py-3'>GRAPHIC</h1>
    </div>
    <div class="col-md-12 mb-4 d-flex">
    <Link to={'/coordinator/graphic'}>     
    <button type="button" class="btn btn-secondary ms-4 me-4">All Class</button>
 </Link>   
 <Link>
  <button type="button" class="btn btn-secondary">Class</button>
 </Link>


    </div>

    <div class="col-md-12 d-flex justify-content-end"> 
    <select class="form-select w-25 me-3 " aria-label="Default select example">
  <option selected>Open this select menu</option>
  <option value="1">One</option>
  <option value="2">Two</option>
  <option value="3">Three</option>
</select>


    </div>
  </div>

                </section>
            </div> 

            <Footer />
        </div>

    )
}

export default GraphicClassDetails