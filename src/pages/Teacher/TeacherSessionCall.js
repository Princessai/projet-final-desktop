import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SidebarTeacher from '../../components/SidebarTeacher';


function TeachersessionCall() {
    return (
        <div className='div-container d-flex flex-column'>
            <Navbar />
            <div className='body-content-container d-flex'>
                <SidebarTeacher />
                <section className='content-container'>
                <div class="row">
    <div class="col-md-12 mt-3 ms-5">
    <h1 class='py-3'>SESSION : 9h-12h</h1>
    </div>
    <div class="col-md-12 d-flex justify-content-end ">
    <button type="button" class="btn btn-success me-5 mb-5">END SESSION</button>
    </div>
    <div class="col-md-12">
    <table class="table shadow m-3">
  <thead>
    <tr>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td colspan="2">Mark</td>
      <td class="d-flex justify-content-evenly">
      <button type="button" class="btn btn-warning">Danger</button> 
      <button type="button" class="btn btn-success">Danger</button>
      <button type="button" class="btn btn-danger">Danger</button>
      </td>
 
    </tr>
    <tr>
      <th scope="row">2</th>
      <td colspan="2">Jacob</td>
      <td class="d-flex justify-content-evenly">
      <button type="button" class="btn btn-warning">Danger</button> 
      <button type="button" class="btn btn-success">Danger</button>
      <button type="button" class="btn btn-danger">Danger</button>
      </td>
     
    </tr>
    <tr>
      <th scope="row">3</th>
      <td colspan="2">Larry the Bird</td>
      <td class="d-flex justify-content-evenly">
      <button type="button" class="btn btn-warning">Danger</button> 
      <button type="button" class="btn btn-success">Danger</button>
      <button type="button" class="btn btn-danger">Danger</button>
      </td>
    </tr>
  </tbody>
</table>
    </div>
  </div>

                </section>
            </div>

            <Footer />
        </div>

    )
}

export default TeachersessionCall