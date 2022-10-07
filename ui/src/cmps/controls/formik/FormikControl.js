import React from 'react'
import DatePicker from './DatePicker'
import Input from './Input'
import Select from './Select'
import TextArea from './TextArea'

const FormikControl = ({ control, ...rest }) => {
    switch (control) {
        case 'input':
            return <Input {...rest} />
        case 'textarea':
            return <TextArea {...rest} />
        case 'select':
            return <Select {...rest} />
        case 'date':
            return <DatePicker {...rest} />
        default: return null

    }
}

export default FormikControl