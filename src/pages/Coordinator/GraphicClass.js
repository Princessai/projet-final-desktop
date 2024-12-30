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
          <div className="row">
            <div className="col-md-12  mb-4 mt-3 ms-5">
              <h1 className='py-3'>GRAPHIC</h1>
            </div>
            <div className="col-md-12 mb-4 d-flex">
              <button type="button" className="btn btn-secondary ms-4 me-4">All Class</button>
                <button type="button" className="btn btn-secondary">Class</button>
            </div>




            <div className="col-md-12 d-flex flex-wrap">



            </div>
          </div>

        </section>
      </div>

      <Footer />
    </div>

  )
}

export default GraphicClass