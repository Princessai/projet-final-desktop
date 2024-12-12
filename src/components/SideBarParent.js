import React from 'react'
import './Sidebar.css';
import Button from './Button.js';
import { routeRegister } from '../../route.js';
import { useNavigate } from 'react-router-dom';

function SideBarParent() {

    const navigate = useNavigate()
    function back(){
        navigate(-1);
    }
    return (
        <aside className='side-container container m-0'>
            <div className='side-bar d-flex flex-column align-items-center justify-content-center'>
                <Button label={'Student Profile'} linkto={''}/>
                <Button label={'Timetable'} linkto={''}/>
                <div className='flex-end'>
                <Button label={'Back'} onclick = {back}/>
                </div>
            </div>
        </aside>
    )
}

export default SideBarParent