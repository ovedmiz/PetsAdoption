import React from 'react'
import './ForgotPassword.css'
import authService from '../../services/authService'
import { useNavigate } from 'react-router-dom'
import { Form, Formik } from 'formik'
import FormikControl from '../../cmps/controls/formik/FormikControl'

import { useNotification } from '../../cmps/Notification/NotificationProvider';
import { forgotPasswordInitialValues, forgotPasswordValidationSchema } from '../../utils/formikSchemasAndStates'



const ForgotPassword = () => {
    const navigate = useNavigate()


    const notify = useNotification()



    const onSubmit = async (values) => {
        try {
            await authService.forgotPassword(values)
            notify({
                type: 'SUCCESS',
                msg: `Mail was sent with a Token`
            })
            navigate('/login/resetPassword')
        } catch (err) {
            if (err.response.status === 500) {

                notify({
                    type: 'ERROR',
                    msg: `There was a problem.. Try Again`
                })
            } else {
                notify({
                    type: 'ERROR',
                    msg: `Mail wasn't sent.. Verify Correct Email`
                })
            }
        }
    }

    return (
        <Formik
            initialValues={forgotPasswordInitialValues}
            validationSchema={forgotPasswordValidationSchema}
            onSubmit={onSubmit}
        >
            {
                (formik) => {
                    return (
                        <Form>
                            <h1 className='pageTitle'>Forgot Password</h1>


                            <FormikControl control='input'
                                label='Email' name='email' />
                            <input type="submit" value='Send Email' className='appBtn' />
                            <br />
                            <input type="button" value='Back' onClick={() => navigate(-1)} className='appBtn' />
                        </Form>)
                }
            }
        </Formik>


    )
}

export default ForgotPassword