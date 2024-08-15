import React from 'react';
import LogoWhite from '/src/assets/logo-white.png';
import Picture from '/src/assets/homme@2x.png';
import logoutIcon from '/src/assets/se-deconnecter@2x.png';
import { Link } from 'react-router-dom';


function Navbar() {
    return (
        <div className='navBar' style={{ backgroundColor: '#202149' }}>

            <nav className="navbar navbar-expand-lg">

                <div className="collapse  d-flex justify-content-between navbar-collapse px-3" id="navbarNavAltMarkup">
                    <Link className="navbar-brand" to={`/`}>
                        <img src={LogoWhite} alt='logo trackIn ifran white' />
                    </Link>

                    <div className="navbar-nav d-flex flex-row align-items-center justif-content-center">
                        <div>
                            <div className='picture-container rounded-circle'>
                                <img src={Picture} className='profile-picture' />
                            </div>
                            <h4>Nicola Lottin</h4>
                        </div>
                        <img src={logoutIcon} className='profile-picture' />

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