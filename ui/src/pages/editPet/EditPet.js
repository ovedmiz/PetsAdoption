import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import useCategories from '../../hooks/useCategories'
import petsService from '../../services/petsService'
import storageService from '../../services/storageService'
import axios from 'axios';
import breedService from '../../services/breedService';
import { Form, Formik } from 'formik';
import FormikControl from '../../cmps/controls/formik/FormikControl';
import { useNotification } from '../../cmps/Notification/NotificationProvider';
import { sizes, sexes } from '../../services/constsService';

import { editPetValidationSchema } from '../../utils/formikSchemasAndStates'

const EditPet = () => {
    const navigate = useNavigate()
    let { id } = useParams()
    let userId = storageService.getConnectedUserId()
    const categories = useCategories()

    const notify = useNotification()



    const [image, setImage] = useState(null)
    const [file, setFile] = useState(null)
    const [isCategoryChosen, setIsCategoryChosen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState('')
    const [breeds, setBreeds] = useState([])
    const [formValues, setFormValues] = useState({
        name: '',
        age: '',
        color: '',
        description: '',
        category: '',
        breed: '',
        sex: '',
        size: '',
    })


    useEffect(() => {
        const getBreeds = async () => {
            const resp = await breedService.getBreeds(parseInt(selectedCategory || formValues.category))
            let dogBreeds = resp?.map(str => str.charAt(0).toUpperCase() + str.slice(1))
            setBreeds(dogBreeds)
        }
        if (selectedCategory || formValues.category) {
            getBreeds()
            setIsCategoryChosen(true)
        } else {
            setIsCategoryChosen(false)
        }
    }, [formValues.category, selectedCategory])

    useEffect(() => {
        const getPet = async () => {
            let pet = await petsService.getPetById(id)
            const resp = await breedService.getBreeds(parseInt(pet.category.id))
            setFormValues({ ...pet, category: pet.category.id, })
            setImage(pet.image)
        }
        getPet()
    }, []);


    const onSubmit = async (values) => {
        const categoryName = await petsService.getCategoryNameByCategoryId(values.category)
        let catObj = { id: parseInt(values.category), categoryName: categoryName }
        let obj = { ...values, category: catObj }
        try {
            const resp = await petsService.editPet(id, obj)
            if (file) {
                const formData = new FormData();
                formData.append("imageFile", file);
                const config = {
                    headers: {
                        'content-type': 'multipart/form-data'
                    }
                }
                try {
                    await axios.put(`http://localhost:8080/pa/api/animal/addImage/${id}`, formData, config)
                } catch (error) {
                    notify({
                        type: 'ERROR',
                        msg: 'There was A Problem.. Try Again'
                    })
                }
            }
            notify({
                type: 'SUCCESS',
                msg: 'Details Changed Succefully'
            })
            navigate(`/home/user/${userId}`)
        } catch (error) {
            notify({
                type: 'ERROR',
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
            initialValues={{
                name: formValues ? formValues.name : '',
                age: formValues ? formValues.age : '',
                color: formValues ? formValues.color : '',
                description: formValues ? formValues.description : '',
                category: formValues ? formValues.category : '',
                breed: formValues ? formValues.breed : '',
                sex: formValues ? formValues.sex : '',
                size: formValues ? formValues.size : '',
            }} validationSchema={editPetValidationSchema}
            onSubmit={onSubmit}
            enableReinitialize>
            {
                (formik) => {
                    return (
                        <Form onChange={handleOnChangeForm}>
                            <h1 className='pageTitle'>Edit Pet Details</h1>
                            <FormikControl control='input'
                                label='Name' name='name' />
                            <FormikControl control='input'
                                label='Age' name='age' />
                            <FormikControl control='input'
                                label='Color' name='color' />
                            <FormikControl control='input'
                                label='Description' name='description' />
                            <FormikControl control='select'
                                label='Category' name='category'
                                options={categories.map(cat => ({ id: cat.id, value: cat.categoryName }))} />
                            <FormikControl control='select'
                                label='Breed' name='breed'
                                options={breeds.map((breed) => ({ id: breed, value: breed }))} />
                            <FormikControl control='select'
                                label='Sex' name='sex'
                                options={sexes} />
                            <FormikControl control='select'
                                label='Size' name='size'
                                options={sizes} />

                            <div className='form-control' style={{ backgroundColor: 'rgb(250, 187, 81, 0.3)' }}>
                                <label htmlFor='addImage'>Add Image</label>
                                <input type="file" name='addImage' onChange={e => setFile(e.target.files[0])} className='appBtn' />
                            </div>

                            <input type="submit" value='Edit Pet' className='appBtn' />
                            <br />
                            <input type="button" value='Back' className='appBtn' onClick={() => navigate(-1)} />
                        </Form>)
                }
            }
        </Formik>
    )
}

export default EditPet