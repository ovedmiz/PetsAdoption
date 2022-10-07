import { ErrorMessage, Field } from 'formik'
import React from 'react'
import TextError from './TextError'


const Select = ({ label, name, options, ...rest }) => {
    return (
        <div className='form-control' style={{ backgroundColor: 'rgb(250, 187, 81, 0.3)' }}>
            <label htmlFor={name}>{label}</label>
            <Field as='select' id={name} name={name} {...rest} style={{
                backgroundColor: '#f9f3e4',
                width: '100%', height: '50px', borderRadius: '4px'
            }} >
                <option value="">Choose {name.charAt(0).toUpperCase() + name.slice(1)}</option>
                {options.map((option) => {
                    return <option key={option.id} value={option.id} style={{ zIndex: '100' }} >{option.value}</option>
                })}
            </Field>
            <ErrorMessage name={name} component={TextError} />
        </div>
    )
}

export default Select