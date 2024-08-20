import React from 'react';
import Timetable from '../../components/Timetable';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';


function TimetablePage() {
    return (
        <div className='div-container d-flex flex-column'>
            <Navbar />
            <div className='body-content-container d-flex'>
                <Sidebar />
                <section className='content-container'>
                    <Timetable />

                </section>
            </div>

            <Footer />
        </div>

    )
}

export default TimetablePage