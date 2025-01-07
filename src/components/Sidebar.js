import React from 'react';
import './Sidebar.css';
import Button from './Button.js';
import { useAuth } from '../Providers/AuthProvider.js';

function Sidebar() {

    const { user } = useAuth();
    
    return (
        <aside className='side-container container m-0'>
            <div className='side-bar d-flex flex-column align-items-center justify-content-around'>
                <Button label={'Home'} linkto={'/student/home'} />
                <Button label={'Timetable'} linkto={'/student/timetable'} />
                <Button label={'Profil'} linkto={'/student/profil'} />

            </div>
        </aside>
    )
}

export default Sidebar