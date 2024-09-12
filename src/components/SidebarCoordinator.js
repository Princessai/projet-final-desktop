import React from 'react';
import './Sidebar.css';
import Button from './Button.js';
import { routeRegister } from '../../route.js';

function SidebarCoordinator() {
    return (
        <aside className='side-container container m-0'>
            <div className='side-bar d-flex flex-column align-items-center justify-content-center'>
                <Button label={'Timetable'} linkto={routeRegister.getRoute("coordinatorhome")}/>
                <Button label={'Graphic'} linkto={'/coordinator/graphic'}/>
                <Button label={'User'} linkto={'/coordinator/user'}/>
                <Button label={'Call'} linkto={'/coordinator/call'}/>
            </div>
        </aside>
    )
}

export default SidebarCoordinator