import React from 'react';


export function FallbackContent ({children}) {
    console.log('childen,',children)
    return (
        <div className='fallback button-container h-100 d-flex flex-column justify-content-center align-items-center'>
           { children ? children:'loading...'}
        </div>

    )
}

