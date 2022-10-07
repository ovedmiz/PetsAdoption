import { Form, Formik } from 'formik';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import FormikControl from '../../cmps/controls/formik/FormikControl';

import { useNotification } from '../../cmps/Notification/NotificationProvider';
import { sendMail } from '../../services/mailService';
import { aboutUsInitialValues, aboutUsValidationSchema } from '../../utils/formikSchemasAndStates';

import './AboutUs.css'
const AboutUs = () => {
    const navigate = useNavigate()
    const notify = useNotification()
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])



    const onSubmit = async (values) => {
        try {
            await sendMail(values)
            notify({
                type: 'SUCCESS',
                msg: `Mail was sent, we will contact you soon`
            })
        } catch (err) {
            notify({
                type: 'ERROR',
                msg: `There was a problem.. Try Again`
            })

        }
    }

    return (
        <div>
            <h1 className='pageTitle'>About Us</h1>
            <div className='aboutUsText'>
                <p> This is a project that its only purpose is to help pets find their loving forever homes </p>
                <p> Whether you’re an animal lover who wants to save a life ,animal rescuer or </p>
                <p> shelter that cares for cats, dogs, rabbits, birds and more.. </p>
                <p> Speed up your adoption process with us </p>
            </div>
            <Formik
                initialValues={aboutUsInitialValues}
                validationSchema={aboutUsValidationSchema}
                onSubmit={onSubmit}
            >
                {
                    () => {
                        return (
                            <Form>
                                <h1 className='pageTitle'>Contact Us</h1>
                                <FormikControl control='input' placeholder='Your Email'
                                    label='Email' name='email' />
                                <FormikControl control='input' placeholder='Email Subject'
                                    label='Subject' name='subject' />
                                <FormikControl control='textarea' placeholder='Message'
                                    label='Body' name='body' />
                                <input type="submit" value='Send Email' className='appBtn' />
                                <br />
                                <input type="button" value='Back Home' onClick={() => navigate('/home')} className='appBtn' />
                            </Form>)
                    }
                }
            </Formik>
        </div>
    )
}

export default AboutUs