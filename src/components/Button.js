import React from 'react';
import { Link } from 'react-router-dom';

function Button({label, linkto}) {
    return (
        <div className='button-container my-5 mx-3'>
            <Link to={linkto}>
                <button className="btn rounded fw-bold" style={{color: '#202149', backgroundColor: 'white'}}>{label}</button>
            </Link>
        </div>

    )
}

export default Button