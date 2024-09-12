import React from 'react';


export function ErrorSpan({errors, inputName}) {
    return errors[inputName] && <span className='text-danger mb-3'>{errors[inputName].message}</span>  
}

