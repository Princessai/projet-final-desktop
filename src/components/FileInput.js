import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';
import React, { useRef, useState } from 'react'
import classes from './FileInput.module.css'

function FileInput({ label, name, onChange, style }) {

    const [fileName, setFileName] = useState('');

    const fileInputRef = useRef(null);

    let path = '';
    let extension = '';

    if (fileName != '') {
        const values = fileName.split('.');
        path = values[0];
        extension = "." + values[1];
    }

    return (
        <div className='d-flex fl align-items-center'>
            <Button
                variant="outlined"
                component="label"
                // sx={{ }}
            // className='d-flex align-items-center'
            >
                <Add style={{
                    marginRight: '5px'
                }} />
                {label}
                <input
                    type="file"
                    name={name}
                    hidden
                    ref={fileInputRef}
                    onChange={(e) => {
                        setFileName(e.target.files[0]?.name || "No file selected")
                     
                        if (onChange) { onChange(e) }
                    }}
                />
            </Button>
            <div className='d-flex' style={{
                marginLeft: '5px',
            }}>
                <div className={`${classes.pathContainer} position-relative`}>

                    <div className={`${classes.path}`} >{path}</div>

                    <div className={`${classes.abs_path_container}`}>
                        <div className={`${classes.abs_path}`} >{path}</div>
                    </div>


                </div>

                <div>{extension}</div>

            </div>

        </div >

    )
}

export default FileInput