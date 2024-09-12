import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';


function ParentChoicePage() {
    return (
        <div className='div-container d-flex flex-column'>
            <Navbar />
            <div className='body-content-container d-flex'>
                <section className='content-container'>
                <div class="row">
    <div class="col-md-12 d-flex justify-content-center mt-5 mb-5">
    <h3>Your child(ren): </h3>
    </div>
    <div class="col-md-12 d-flex justify-content-evenly">
    

    <div class="card w-25 shadow p-3  rounded" >
  <img src="..." class="card-img-top" alt="..."/>
  <div class="card-body">
    <p class="card-text text-center">NICOLAS LOTTIN B3 DEV</p>
  </div>
</div>


<div class="card w-25 shadow p-3  rounded" >
  <img src="..." class="card-img-top" alt="..."/>
  <div class="card-body">
    <p class="card-text text-center">NICOLAS LOTTIN B3 DEV</p>
  </div>
</div>


<div class="card w-25 shadow p-3  rounded" >
  <img src="..." class="card-img-top" alt="..."/>
  <div class="card-body">
    <p class="card-text text-center">NICOLAS LOTTIN B3 DEV</p> 
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

export default ParentChoicePage