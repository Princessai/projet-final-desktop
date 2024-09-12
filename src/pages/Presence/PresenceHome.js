import React from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import '/src/pages/Presence/presence.css';
import { Link } from 'react-router-dom';

function PreesenceHome() {
    return (
        <div className='div-container d-flex flex-column'>
            <Navbar />
            <div className='body-content-container d-flex'>
                <Sidebar />
                <section className='content-container'>
                   

                <div class="row">
    <div class="col-md-12 mt-3 ms-5">
    <h1 class='py-3'>Missing</h1>
    </div>
    <div class="col-md-12 d-flex ">


     <div class=" d-flex ">
     <select class="form-select ms-3" aria-label="Default select example">
  <option selected>Open this select menu</option>
  <option value="1">One</option>
  <option value="2">Two</option>
  <option value="3">Three</option>
</select>
     </div>


     <div class="d-flex justify-content-end flex-grow-1">
     <select class="form-select w-25 me-3 " aria-label="Default select example">
  <option selected>Open this select menu</option>
  <option value="1">One</option>
  <option value="2">Two</option>
  <option value="3">Three</option>
</select>
     </div>
    </div>
    <div class="col-md-12">
        <Link  to={'/student/presence/details'}>
         <div className=' shadow bloc-presence m-auto text-center mt-5 mb-4' >
     <h5>WEEK 12-16 JUNE 2024</h5>
    </div>
        </Link>

    <div className=' shadow bloc-presence  m-auto text-center mt-5 mb-4'>
     <h5>WEEK 12-16 JUNE 2024</h5>
    </div>
    <div className=' shadow bloc-presence  m-auto text-center mt-5 mb-4'>
     <h5>WEEK 12-16 JUNE 2024</h5>
    </div>
    </div>
  </div>



                </section>
            </div>

            <Footer />
        </div>

    )
}

export default  PreesenceHome