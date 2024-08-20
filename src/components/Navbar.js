import React from 'react';
import { Link } from 'react-router-dom';
import LogoWhite from '/src/assets/logo-white.png';
import Picture from '/src/assets/homme.png';
import logoutIcon from '/src/assets/se-deconnecter.png';
import './Navbar.css';


function Navbar() {
    return (
        <div className='navBar' style={{ backgroundColor: '#202149' }}>

            <nav className="navbar navbar-expand-lg">

                <div className="collapse  d-flex justify-content-between navbar-collapse pe-3" id="navbarNavAltMarkup">
                    <Link className="navbar-brand" to={`/`}>
                        <img src={LogoWhite} alt='logo trackIn ifran white' />
                    </Link>

                    <div className="navbar-nav d-flex flex-row align-items-center justif-content-center">
                        <div className='d-flex mx-3 align-items-center justif-content-center'>
                            <div className='picture-container me-3 rounded-circle'>
                                <img src={Picture} className='profile-picture' />
                            </div>
                            <h4 className='text-white m-0'>Nicola Lottin</h4>
                        </div>
                        <img src={logoutIcon} className='profile-picture ms-3' />

                        {/* <DarkModeSwitch
                        style={{ marginBottom: '20px' }}
                        checked={isDarkMode}
                        onChange={toggleDarkMode}
                        size={25}
                        /> */}

                    </div>
                </div>

            </nav>

        </div>
    )
}

export default Navbar