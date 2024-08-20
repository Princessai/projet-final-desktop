import React from 'react';
import Navbar from '../../components/Navbar.js';
import Sidebar from '../../components/Sidebar.js';
import Footer from '../../components/Footer.js';

function Home() {
  return (
    <div className='div-container d-flex flex-column'>
      <Navbar />
      <div className='body-content-container d-flex'>
        <Sidebar />
        <section className='content-container'>
          <div className=''>
            <div className='header-container bg-body-tertiary px-5 py-3'>
              <h1 className='py-3'>Home</h1>
              <h5>WELCOME TO THE IFRAN STUDENT AREA</h5>
              <p>With its hands-on teaching approach. IFRAN is developing a professionalized
                teaching program to help train Africa's elite.</p>
            </div>
            <div className=''>
              <h3 className='py-3 px-5'>News</h3>

            </div>

          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}

export default Home