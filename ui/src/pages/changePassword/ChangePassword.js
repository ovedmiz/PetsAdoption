import React, { useState } from 'react'
import authService from '../../services/authService'
import { useNavigate, useParams } from 'react-router-dom'
import FormikControl from '../../cmps/controls/formik/FormikControl'
import { Form, Formik } from "formik";

import { changePasswordsInitialValues, changePasswordsValidationSchema } from '../../utils/formikSchemasAndStates'

import { useNotification } from '../../cmps/Notification/NotificationProvider'


const ChangePassword = () => {
    const navigate = useNavigate()
    const { id } = useParams()

    const notify = useNotification()


    const onSubmit = async (values) => {
        try {
            await authService.changePassword(id, values)
            notify({
                type: "SUCCESS",
                msg: 'Password changed succefully'
            })
            navigate(`/home/user/${id}`)
        } catch (err) {
            if (err.response.status === 500) {

                notify({
                    type: "ERRORR",
                    msg: `Mail wasn't sent.. Try Again`
                })
            } else {

                notify({
                    type: "ERRORR",
                    msg: 'Wrong Passowrd!'
                })
            }
        }
    }

    return (
        <Formik
            initialValues={changePasswordsInitialValues}
            validationSchema={changePasswordsValidationSchema}
            onSubmit={onSubmit}
            enableReinitialize
        >
            {
                (formik) => {
                    return (

                        <Form>
                            <h1 className='pageTitle'>Change Password</h1>
                            <FormikControl control='input' placeholder='Current Password' label='Current Password' name='currentPassword' type='password' />
                            <FormikControl control='input' placeholder='New Password' label='New Password' name='newPassword' type='password' />
                            <input type="submit" value="Confirm Passowrd" className='appBtn' />
                            <br />
                            <div className='btnWrapperDetails'>
                                <input type="button" value='Back' className='appBtn' onClick={() => navigate(-1)} />
                            </div>
                        </Form>
                    )
                }
            }

        </Formik>


    )
}


export default ChangePassword