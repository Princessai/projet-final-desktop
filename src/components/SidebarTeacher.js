import React from 'react';
import './Sidebar.css';
import Button from './Button.js';
import { routeRegister } from '../../route.js';

function SidebarTeacher() {
    return (
        <aside className='side-container container m-0'>
            <div className='side-bar d-flex flex-column align-items-center justify-content-center'>
                <Button label={'Session'} linkto={routeRegister.getRoute('teacherhome')}/>
            </div>
        </aside>
    )
}

export default SidebarTeacher