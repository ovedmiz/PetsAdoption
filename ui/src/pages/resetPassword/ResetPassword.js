import React from 'react'
import './ResetPassword.css'
import authService from '../../services/authService'
import { useNavigate } from 'react-router-dom'
import FormikControl from '../../cmps/controls/formik/FormikControl'
import { resetPasswordInitialValues, resetPasswordValidationSchema } from '../../utils/formikSchemasAndStates'
import { useNotification } from '../../cmps/Notification/NotificationProvider';
import { Form, Formik } from "formik";

const ResetPassword = () => {
    const navigate = useNavigate()
    const notify = useNotification()

    const onSubmit = async (values) => {
        try {
            await authService.resetPassword(values)
            notify({
                type: 'SUCCESS',
                msg: `Password reset succefully`
            })
            navigate('/login')
        } catch (err) {
            if (err.response.status === 500) {
                notify({
                    type: 'ERROR',
                    msg: `There was a problem.. Try Again`
                })
            } else {
                notify({
                    type: 'ERROR',
                    msg: `Token is not correct`
                })
            }
        }
    }


    return (
        <Formik
            initialValues={resetPasswordInitialValues}
            validationSchema={resetPasswordValidationSchema}
            onSubmit={onSubmit}
            enableReinitialize
        >
            {
                (formik) => {
                    return (
                        <Form>
                            <h1 className='pageTitle'>Reset Password</h1>
                            <FormikControl control='input'
                                label='Token Recieved' name='currentPassword' type='password' />
                            <FormikControl control='input'
                                label='New Password' name='newPassword' type='password' />
                            <input type="submit" value="Reset Password" className='appBtn' />
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


export default ResetPassword
