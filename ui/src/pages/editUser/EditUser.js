import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from '../../context/authContext'
import FormikControl from '../../cmps/controls/formik/FormikControl'

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import { Form, Formik } from "formik";
import citiesService from '../../services/citiesService'
import usersService from '../../services/usersService'


import { useNotification } from '../../cmps/Notification/NotificationProvider';

import { editUserValidationSchema } from '../../utils/formikSchemasAndStates'

const EditUser = () => {
    const navigate = useNavigate()
    const { id } = useParams()

    const notify = useNotification()

    const [connectedUser, setConnectedUser] = useContext(AuthContext)
    const [cities, setCities] = useState([])
    const [formValues, setFormValues] = useState(null)

    useEffect(() => {
        const getCities = async () => {
            let cities = await citiesService.getAllCities()
            setCities(cities)
        }
        getCities()
    }, []);

    useEffect(() => {
        const getUsers = async () => {
            let user = await usersService.getUserById(id)
            setFormValues(user)
        }
        getUsers()
    }, []);


    const onSubmit = async (values) => {
        values = { ...values, dob: values.dob.toISOString() }
        try {
            const resp = await usersService.updateUser(id, values)
            setConnectedUser(prev => ({
                ...prev, firstName: values.firstName, lastName: values.lastName,
            }))
            let user = JSON.parse(sessionStorage.getItem('user'))
            let newUser = { ...user, firstName: values.firstName, lastName: values.lastName }
            sessionStorage.setItem('user', JSON.stringify(newUser))
            notify({
                type: 'SUCCESS',
                msg: 'Details Changed Succefully'
            })
            navigate(-1)
        } catch (error) {
            notify({
                type: 'ERROR',
                msg: 'There was A Problem.. Try Again'
            })
        }

    }

    return (
        <Formik
            initialValues={{
                firstName: formValues ? formValues.firstName : '',
                lastName: formValues ? formValues.lastName : '',
                dob: formValues ? new Date(formValues.dob) : null,
                phone: formValues ? formValues.phone : '',
                city: formValues ? formValues.city : '',

            }}
            validationSchema={editUserValidationSchema}
            onSubmit={onSubmit}
            enableReinitialize
        >
            {
                (formik) => {
                    return (
                        <>
                            <Form>
                                <h1 className='pageTitle'>Edit Details</h1>
                                <FormikControl control='input'
                                    label='First Name' name='firstName' />
                                <FormikControl control='input'
                                    label='Last Name' name='lastName' />
                                <FormikControl control='date'
                                    label='Pick a Date' name='dob' />
                                {/* <FormikControl control='input'
                                    label='City' name='phone' /> */}
                                <FormikControl control='input'
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
                                        renderInput={(params) => <TextField {...params} label={formik.values.city} />}
                                    />
                                    <div className='error' style={{ color: 'red' }}>
                                        {formik.errors.city}

                                    </div>
                                </div>

                                <input type="submit" value='Edit Details' className='appBtn' disabled={!formik.isValid} />
                                <br />
                                <input type="button" value='Back' className='appBtn appBtnDetails' onClick={() => navigate(-1)} />
                            </Form>
                        </>)
                }
            }

        </Formik>


    )
}


export default EditUser