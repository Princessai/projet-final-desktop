import React from 'react';
import './Sidebar.css';
import Button from './Button.js';
import { routeRegister } from '../../route.js';

function SidebarCoordinator() {

    function back(){
        navigate(-1);
        console.log('navigateee');
    }

               
    return (
        <aside className='side-container container m-0'>
            <div className='side-bar d-flex flex-column align-items-center justify-content-around'>
                <Button label={'Timetable'} linkto={routeRegister.getRoute("coordinatorhome")}/>
                <Button label={'Classes'} linkto={'/coordinator/classes'}/>
                <Button label={'Graphic'} linkto={'/coordinator/graphic'}/>
                <Button label={'Call'} linkto={'/coordinator/call'}/>
                    
                <div className='flex-end'>

                <Button label={'Back'} onclick = {back}/>

                </div>

            </div>
        </aside>
    )
}

export default SidebarCoordinator