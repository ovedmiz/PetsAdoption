import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from '../../context/authContext'
import petsService from '../../services/petsService'
import requestsService from '../../services/requestsService'
import storageService from '../../services/storageService'
import { TiArrowBackOutline } from 'react-icons/ti'

import './PetDetails.css'
import Spinner from '../../cmps/Spinner/Spinner'
import ConfirmDialog from '../../cmps/ConfirmDialog/ConfirmDialog'

import { useNotification } from '../../cmps/Notification/NotificationProvider'




const PetDetails = () => {
    let { id } = useParams()
    let navigate = useNavigate()
    const notify = useNotification()

    const [connectedUser, setConnectedUser] = useContext(AuthContext)
    const [pet, setPet] = useState({})
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false, title: '', subTitle: ''
    })

    const defImg = "https://media.istockphoto.com/photos/crazy-looking-black-and-white-border-collie-dog-say-looking-intently-picture-id1213516345?k=20&m=1213516345&s=612x612&w=0&h=_XUSwcrXe5HjI2QEby0ex6Tl1fB_YJUzUU8o2cUt0YA="

    const loggedInUser = storageService.getConnectedUser();


    const adoptPet = async () => {
        try {
            let resp = await requestsService.addRequest(connectedUser.id, id)
            notify({
                type: 'SUCCESS',
                msg: 'Adoption request sent!'
            })
        } catch (err) {
            if (err.response.data.errorCode === 409) {
                notify({
                    type: 'ERROR',
                    msg: 'You Already Sent A request!'
                })
            } else {
                notify({
                    type: 'ERROR',
                    msg: 'There was A Problem.. Try Again'
                })
            }
        }

    }

    const handleAdopt = () => {
        setConfirmDialog({
            isOpen: true,
            title: 'Are You Sure You want To Send Adoption Request?',
            subTitle: 'You can delete the request in `My Requests` page',
            onConfirm: () => adoptPet()
        })
    }


    useEffect(() => {
        const getPet = async () => {
            let pet = await petsService.getPetById(id)
            setPet(pet)

        }
        getPet()
    }, []);

    return (
        <>
            {pet.name ?
                <>
                    <div className='detailsPageContainer'>
                        <div className='headerWrapper'>
                            <h1 className='detailsHeader'>{pet.name} Details:</h1>
                        </div>
                        <div className='detailsContainer'>
                            <div className='leftSideDetails'>
                                <div className='detailsWrapper'>
                                    <div>
                                        <span>Name: </span>
                                        <p>   {pet.name} </p>
                                        <span>Age: </span>
                                        <p>   {pet.age} </p>
                                        <span>Breed: </span>
                                        <p>   {pet.breed} </p>
                                        <span>Category: </span>
                                        <p>   {pet.category?.categoryName} </p>
                                    </div>
                                    <div>
                                        <span>Sex: </span>
                                        <p>   {pet.sex.charAt(0).toUpperCase() + pet.sex.slice(1)} </p>
                                        <span>Color: </span>
                                        <p>   {pet.color} </p>
                                        <span>Size: </span>
                                        <p>   {pet.size.charAt(0).toUpperCase() + pet.size.slice(1)} </p>
                                        <span>City: </span>
                                        <p>   {pet.owner.city} </p>
                                    </div>
                                </div>
                                <div>
                                    <span> Description: </span>
                                    <p>   {pet.description} </p>
                                </div>
                            </div>
                            <div className='rightSideDetails'>
                                <img className='petImgDetails' src={pet.image ? `data:image/png;base64,${pet.image}` : defImg}
                                    alt="pet" />

                            </div>
                        </div>
                        {loggedInUser && loggedInUser.id != pet.owner?.id &&
                            <div className='adoptWrapper' onClick={handleAdopt}>
                                <span className='adoptHeader'>Adopt</span>
                            </div>}
                        <button className='appBtn' onClick={() => navigate(-1)}>
                            <TiArrowBackOutline />
                            Back
                        </button>
                    </div>

                </>
                : <Spinner />
            }
            <ConfirmDialog
                confirmDialog={confirmDialog}
                setConfirmDialog={setConfirmDialog}
            />

        </>

    )
}

export default PetDetails