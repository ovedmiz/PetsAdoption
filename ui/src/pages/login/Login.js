import React, { useContext } from 'react'
import './Login.css'
import authService from '../../services/authService'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/authContext'
import storageService from '../../services/storageService'
import FormikControl from '../../cmps/controls/formik/FormikControl'


import { Form, Formik } from "formik";

import { useNotification } from '../../cmps/Notification/NotificationProvider'
import { loginInitialValues, loginValidationSchema } from '../../utils/formikSchemasAndStates'

const Login = () => {
    const navigate = useNavigate()
    const notify = useNotification()

    const [connectedUser, setConnectedUser] = useContext(AuthContext)



    const onSubmit = async (values) => {
        try {
            let resp = await authService.validateLogin(values)
            if (resp) {
                let tokenData = storageService.decodeAndStoreTokenData(resp.jwtToken)
                setConnectedUser(tokenData)
                notify({
                    type: "SUCCESS",
                    msg: 'Succefully Logged In'
                })
                navigate('/home')
            }
        } catch (err) {
            notify({
                type: "ERROR",
                msg: 'Unable to Login, Wrong Email & Password'
            })
        }
    }

    const forgotPassword = () => {
        navigate('/login/forgot')
    }
    return (
        <Formik
            initialValues={loginInitialValues}
            validationSchema={loginValidationSchema}
            onSubmit={onSubmit}
        >
            {
                formik => {
                    return (
                        <Form>
                            <h1 className='pageTitle'>Login</h1>
                            <FormikControl control='input' type='email' label='Email' name='userName' />
                            <FormikControl control='input' type='password' label='Password' name='password' />
                            <input type="submit" value='Login' disabled={!formik.isValid} className='appBtn' />
                            <br />
                            <input type="button" value="Forgot Password" onClick={forgotPassword} className='appBtn' />
                        </Form>)
                }
            }

        </Formik>
    )
}


export default Login