import React, { useState } from 'react'
import requestsService from '../../services/requestsService'
import { useNotification } from '../../cmps/Notification/NotificationProvider'
import './MyRequsetRow.css'
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog'

const MyRequsetRow = ({ request, getRequests }) => {
    const notify = useNotification()
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false, title: '', subTitle: ''
    })

    const deletePet = async () => {
        try {
            await requestsService.deleteRequest(request.id)
            getRequests()
            notify({ type: 'SUCCESS', msg: 'Deleted Successfully' })

        } catch (error) {
            if (error.response.data.errorCode === 409) {
                notify({ type: 'ERROR', msg: 'Cannot Deleted. Request Already Aprroved' })
            } else
                notify({ type: 'ERROR', msg: 'There was A Problem.. Try Again' })
        }
    }

    const handleDelete = () => {
        setConfirmDialog({
            isOpen: true,
            title: 'Are You Sure You want To Delete?',
            subTitle: 'This Request Will Be Deleted!',
            onConfirm: () => deletePet()
        })
    }

    let backgroundColor;
    if (request.status === 'PENDING') { backgroundColor = '#F1E1A6' }
    else if (request.status === 'APPROVE') { backgroundColor = '#C3E5AE' }
    else if (request.status === 'DECLINE') { backgroundColor = '#F4BBBB' }


    return (
        <div className='rowContainer' style={{ backgroundColor }} >
            <div className='leftSideMRR' >
                <div className="petCardImg">
                    <img className='petCardImgMRR' src={request.adoptedAnimal.image ?
                        `data:image/png;base64,${request.adoptedAnimal.image}` :
                        require('../../assests/icons/logo.png')
                    } alt="pet" />
                </div>


                <div className='itemContainer'>
                    <span>Name</span>
                    <span className='reqPetDetails' >{request.adoptedAnimal.name} </span>
                </div>
                <div className='itemContainer'>
                    <span>Category</span>

                    <span className='reqPetDetails' >{request.adoptedAnimal.category.categoryName} </span>
                </div>
                <div className='itemContainer'>
                    <span>Breed</span>
                    <span className='reqPetDetails' >{request.adoptedAnimal.breed} </span>
                </div>
                <div className='itemContainer'>
                    Age
                    <span className='reqPetDetails' >{request.adoptedAnimal.age} Years</span>
                </div>
                <div className='itemContainer'>

                    <span>City</span>
                    <span className='reqPetDetails' >{request.adoptedAnimal.owner.city}</span>
                </div>
                {request.status === 'APPROVE' &&
                    <div className='itemContainer'>
                        <span>Phone</span>
                        <span className='reqPetDetails' >{request.adoptedAnimal.owner.phone}</span>
                    </div>

                }
                <div className='itemContainer'>
                    <span>Status</span>

                    <span className='reqPetDetails'>{request.status}</span>
                </div>            </div>

            <div className='rightSideMRR'>

                {request.status !== 'APPROVE' &&
                    <div>
                        <button type="button" value="" className="changeReqStatusBtn" style={{ backgroundColor: '#F4BBBB' }} onClick={handleDelete} >Delete</button>
                    </div>
                }
            </div>

            <ConfirmDialog
                confirmDialog={confirmDialog}
                setConfirmDialog={setConfirmDialog}
            />

        </div>
    )
}

export default MyRequsetRow