import { ErrorMessage, Field } from 'formik'
import React from 'react'
import TextError from './TextError'

const TextArea = (props) => {
    const { label, name, ...rest } = props
    return (
        <div className='form-control' style={{ backgroundColor: 'rgb(250, 187, 81, 0.3)' }}>
            <label htmlFor={name}>{label}</label>
            <Field as='textarea' id={name} name={name} {...rest} style={{
                backgroundColor: '#f9f3e4',
                width: '100%', height: '50px', borderRadius: '4px'
            }} />
            <ErrorMessage component={TextError} name={name} />
        </div>
    )
}
export default TextArea