import React from 'react';
import { Link } from 'react-router-dom';

function Button({ label, linkto, onclick }) {
    return (
        <div className='button-container'>
            {onclick ?

                <button className="btn rounded fw-bold" style={{ color: '#202149', backgroundColor: 'white' }} onClick={onclick}>{label}</button>

                : <Link to={linkto}>
                    <button className="btn rounded fw-bold" style={{ color: '#202149', backgroundColor: 'white' }}>{label}</button>
                </Link>
            }
        </div>

    )
}

export default Button