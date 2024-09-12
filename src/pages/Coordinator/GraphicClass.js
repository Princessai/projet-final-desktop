import React from 'react';
import Navbar from '../../components/Navbar';
import SidebarCoordinator from '../../components/SidebarCoordinator';
import Footer from '../../components/Footer';
import { Link } from 'react-router-dom';

function GraphicClass() {
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
    <button type="button" class="btn btn-secondary ms-4 me-4">All Class</button>
 <Link to={'/coordinator/graphic/class'}>
 <button type="button" class="btn btn-secondary">Class</button>
 </Link>   
    </div>




    <div class="col-md-12 d-flex flex-wrap"> 
 

    <div class="card shadow w-25 m-3" >
  <img src="..." class="card-img-top" alt="..."/>
  <Link  to={'/coordinator/graphic/class/details'}>
  <div class="card-body">
    <p class="card-text"><strong>B3 DEV</strong> </p>
  </div>
  </Link>
</div>


<div class="card shadow w-25 m-3" >
  <img src="..." class="card-img-top" alt="..."/>
  <Link  to={'/coordinator/graphic/class/details'}>
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

export default GraphicClass