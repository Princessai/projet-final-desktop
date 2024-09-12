import React from 'react';
import './Sidebar.css';
import Button from './Button.js';

function SidebarTeacher() {
    return (
        <aside className='side-container container m-0'>
            <div className='side-bar d-flex flex-column align-items-center justify-content-center'>
                <Button label={'Session'} linkto={'/teacher/session'}/>
            </div>
        </aside>
    )
}

export default SidebarTeacher