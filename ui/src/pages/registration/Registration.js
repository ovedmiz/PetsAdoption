import React, { useContext, useEffect, useState } from 'react'
import authService from '../../services/authService'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/authContext'

import FormikControl from '../../cmps/controls/formik/FormikControl'

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import { Form, Formik } from "formik";
import citiesService from '../../services/citiesService'

import { ErrorMessage } from 'formik'

import { useNotification } from '../../cmps/Notification/NotificationProvider'

import TextError from '../../cmps/controls/formik/TextError'
import { registrationInitialValues, registrationValidationSchema } from '../../utils/formikSchemasAndStates'

const Registration = () => {
    const navigate = useNavigate()
    const notify = useNotification()

    const [connectedUser, setConnectedUser] = useContext(AuthContext)
    const [cities, setCities] = useState([])

    useEffect(() => {
        const getCities = async () => {
            let cities = await citiesService.getAllCities()
            setCities(cities)
        }
        getCities()
    }, []);



    const onSubmit = async (values) => {
        try {
            await authService.register(values)
            notify({
                type: 'SUCCESS',
                msg: 'Registered Successfully'
            })
            navigate('/login')

        } catch (err) {
            if (err.response.data.errorCode === 409) {
                notify({
                    type: 'ERROR',
                    msg: 'Mail Already Registered'
                })
            } else {
                notify({
                    type: 'ERROR',
                    msg: 'There Was A Problem.. Try Again'
                })
            }
        }


    }

    return (


        <Formik
            initialValues={registrationInitialValues}
            validationSchema={registrationValidationSchema}
            onSubmit={onSubmit}
        >
            {
                (formik) => {
                    return (
                        <Form>
                            <h1 className='pageTitle'>Registration</h1>
                            <FormikControl control='input' placeholder='Enter First Name'
                                label='First Name' name='firstName' />
                            <FormikControl control='input' placeholder='Enter Last Name'
                                label='Last Name' name='lastName' />
                            <FormikControl control='input' placeholder='Enter Email'
                                label='Email' name='email' />
                            <FormikControl control='input' placeholder='Enter Password'
                                label='Password' name='password' type='password' />
                            <FormikControl control='date'
                                label='Date of Birth' name='dob' />

                            <FormikControl control='input' placeholder='Enter First Name'
                                label='Phone' name='phone' />
                            <div className='form-control' style={{ backgroundColor: 'rgb(250, 187, 81, 0.3)' }}>
                                <label htmlFor='city'>City</label>
                                <Autocomplete
                                    style={{
                                        width: '100%',
                                        backgroundColor: '#f9f3e4',
                                        borderRadius: '5px'
                                    }}
                                    onChange={(e, value) => formik.setFieldValue('city', value)}
                                    name='city'
                                    disablePortal
                                    options={cities}

                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField {...params} label="Pick City" />}
                                />
                                <ErrorMessage name={'city'} component={TextError} />
                            </div>


                            <input type="submit" value='Register' disabled={!formik.isValid} className='appBtn' />
                            <br />
                            <input type="button" value='Back' onClick={() => navigate(-1)} className='appBtn' />

                        </Form>)
                }
            }

        </Formik>


    )
}


export default Registration