import React from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import '/src/pages/Presence/presence.css';

function Preesencedetails() {
    return (
        <div className='div-container d-flex flex-column'>
            <Navbar />
            <div className='body-content-container d-flex'>
                <Sidebar />
                <section className='content-container'>
            



                </section>
            </div>

            <Footer />
        </div>

    )
}

export default   Preesencedetails