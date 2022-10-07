import { InputAdornment } from '@material-ui/core'
import { ErrorMessage, Field } from 'formik'
import React, { useState } from 'react'
import TextError from './TextError'

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const Input = ({ label, name, type, ...rest }) => {
    const [showPass, setShowPass] = useState(false)
    return (
        <div className='form-control' style={{ backgroundColor: 'rgb(250, 187, 81, 0.3)' }}>
            <label htmlFor={name}>{label}</label>
            <div style={{ display: 'flex' }}>
                <Field id={name} name={name} {...rest} type={showPass ? 'text' : type} />
                {type === 'password' && <InputAdornment position="end" style={{ cursor: 'pointer', display: 'flex', alignSelf: 'center' }} >
                    {showPass
                        ? <VisibilityOffIcon
                            onClick={() => setShowPass(!showPass)}
                            style={{ color: "#EA5C2B" }}
                            fontSize="medium"
                        ></VisibilityOffIcon> :
                        <VisibilityIcon
                            onClick={() => setShowPass(!showPass)}
                            style={{ color: "#EA5C2B" }}
                            fontSize="medium"
                        ></VisibilityIcon>
                    }
                </InputAdornment>}
            </div>
            <ErrorMessage name={name} component={TextError} />
        </div>
    )
}

export default Input