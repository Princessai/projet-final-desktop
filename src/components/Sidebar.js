import React from 'react';
import './Sidebar.css';
import Button from './Button';

function Sidebar() {
    return (
        <div className='side-container container'>
            <div className='side-bar d-flex flex-column align-items-center justify-content-center'>
                <Button label={'Home'} linkto={'/student/home'} />
                <Button label={'Timetable'} linkto={''} />
                <Button label={'Missing'} linkto={''} />
                <Button label={'Presence'} linkto={''} />
            </div>
        </div>
    )
}

export default Sidebar