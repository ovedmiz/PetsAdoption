import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './AddPet.css'

import useCategories from '../../hooks/useCategories'
import petsService from '../../services/petsService'
import storageService from '../../services/storageService'
import breedService from '../../services/breedService';
import { Form, Formik } from 'formik';
import FormikControl from '../../cmps/controls/formik/FormikControl';
import { sexes, sizes } from '../../services/constsService';

import { addPedValidationShcema, addPetInitialValues } from '../../utils/formikSchemasAndStates'
import { useNotification } from '../../cmps/Notification/NotificationProvider'

import Spinner from '../../cmps/Spinner/Spinner'
const AddPet = () => {
    const navigate = useNavigate()
    const categories = useCategories()
    let userId = storageService.getConnectedUserId()
    const notify = useNotification()



    const [file, setFile] = useState(null)

    const [isCategoryChosen, setIsCategoryChosen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState('')
    const [breeds, setBreeds] = useState([])



    useEffect(() => {
        const getBreeds = async () => {
            try {
                setBreeds('loading')
                const resp = await breedService.getBreeds(parseInt(selectedCategory))
                let dogBreeds = resp?.map(str => str.charAt(0).toUpperCase() + str.slice(1))
                setBreeds(dogBreeds)
            } catch (error) {
                console.error(error);
            }
        }
        if (selectedCategory) {
            getBreeds()
            setIsCategoryChosen(true)
        } else {
            setIsCategoryChosen(false)
        }
    }, [selectedCategory])

    const onSubmit = async (values) => {
        try {
            const pet = await petsService.addNewPet(userId, selectedCategory, { ...values })
            if (file) {
                const formData = new FormData();
                formData.append("imageFile", file);
                const config = {
                    headers: { 'content-type': 'multipart/form-data' }
                }
                try {
                    await petsService.addNewImage(pet.id, formData, config)
                } catch (error) {
                    notify({
                        msg: 'Could not Save Image, You can edit pets from your account ',
                        type: 'ERROR'
                    })
                }
            }
            notify({
                type: "SUCCESS",
                msg: 'Pet Submited Succefully'
            })
            navigate(`/home/user/${userId}`)
        } catch (error) {
            notify({
                type: "ERROR",
                msg: 'There was A Problem.. Try Again'
            })
        }
    }

    const handleOnChangeForm = (event) => {
        const { name, value } = event.target
        if (name === 'category') {
            setSelectedCategory(value)
        }
    };



    return (
        <Formik
            initialValues={addPetInitialValues}
            validationSchema={addPedValidationShcema}
            onSubmit={onSubmit}
            enableReinitialize>
            {(formik) => {
                return (
                    <Form onChange={handleOnChangeForm}>
                        <h1 className='pageTitle'>Add Pet For Adoption</h1>
                        <FormikControl control='input'
                            label='Name' name='name' placeholder='Enter Pet Name' />
                        <FormikControl control='input'
                            label='Age' name='age' placeholder='Enter Pet Age' />
                        <FormikControl control='input'
                            label='Color' name='color' placeholder='Enter Pet Colors' />
                        <FormikControl control='textarea' placeholder='Enter A Short Description'
                            label='Description' name='description' />
                        <FormikControl control='select'
                            label='Category' name='category'
                            options={categories.map(cat => ({ id: cat.id, value: cat.categoryName }))} />
                        {breeds === 'loading' ? <Spinner size={30} /> : formik.values.category && <FormikControl control='select'
                            label='Breed' name='breed'
                            options={breeds.map(breed => ({ id: breed, value: breed }))} />}
                        <FormikControl control='select'
                            label='Sex' name='sex'
                            options={sexes} />
                        <FormikControl control='select'
                            label='Size' name='size'
                            options={sizes} />

                        <div className='form-control' style={{ backgroundColor: 'rgb(250, 187, 81, 0.3)' }}>
                            <label htmlFor='addImage'>Add Image</label>
                            <input type="file" name='addImage' onChange={e => setFile(e.target.files[0])} />
                        </div>

                        <input type="submit" value='Add Pet' className='appBtn' />
                        <br />
                        <input type="button" value='Back' className='appBtn' onClick={() => navigate(-1)} />

                    </Form>)
            }}
        </Formik>
    )
}

export default AddPet