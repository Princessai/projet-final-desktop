import React from 'react';
import './Sidebar.css';
import Button from './Button.js';

function Sidebar() {
    return (
        <aside className='side-container container m-0'>
            <div className='side-bar d-flex flex-column align-items-center justify-content-center'>
                <Button label={'Home'} linkto={'/student/home'}/>
                <Button label={'Timetable'} linkto={'/student/timetable'} />
                <Button label={'Missing'} linkto={''} />
                <Button label={'Presence'} linkto={''} />
            </div>
        </aside>
    )
}

export default Sidebar