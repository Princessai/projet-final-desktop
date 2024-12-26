import React from 'react'
import './Sidebar.css';
import Button from './Button.js';
import { routeRegister } from '../../route.js';
import { useNavigate } from 'react-router-dom';
import { useChild } from '../Providers/ChildProvider.js';

function SideBarParent() {

   const { selectedChild } = useChild();
   console.log("🚀 ~ SideBarParent ~ selectedChild:", selectedChild)

   let user_id = selectedChild.id;

   let classe_id = selectedChild.classe[0].id;

   let classe_label = selectedChild.classe[0].label;

    const navigate = useNavigate();
    
    function back(){
        navigate(-1);
        console.log('navigateee');
    }
    return (
        <aside className='side-container container m-0'>
            <div className='side-bar d-flex flex-column align-items-center justify-content-center'>
                <Button label={'Student Profile'} linkto={`/parent/child/profil/${user_id}`}/>
                <Button label={'Timetable'} linkto={`/parent/child/timetable/${classe_id}/${classe_label}`}/>
                <div className='flex-end'>
                <Button label={'Back'} onclick = {back}/>
                </div>
            </div>
        </aside>
    )
}

export default SideBarParent