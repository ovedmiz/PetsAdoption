import React, { useState } from 'react'
import requestsService from '../../services/requestsService'
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog'

import './RequestRow.css'
import { useNotification } from '../Notification/NotificationProvider'

const RequestRow = ({ request, handleStatusChange }) => {

    const notify = useNotification()

    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false, title: '', subTitle: ''
    })
    const changeStatus = async (status) => {

        try {
            const resp = await requestsService.setRequestStatus(request.id, status)
            handleStatusChange(request.adoptedAnimal.id)
            notify({
                type: 'SUCCESS',
                msg: status === 'APPROVE' ? 'Request Approved' : status === 'DECLINE' ? 'Request Decliend' : 'Request Pending'
            })
        } catch (err) {
            alert(err.response.data.errorMessage)
        }
    }

    const handleApprove = () => {
        if (request.status !== 'APPROVE') {
            setConfirmDialog({
                isOpen: true,
                title: 'Are You Sure You want To Approve?',
                subTitle: 'All other request for this pet will be denied',
                onConfirm: () => changeStatus('APPROVE')
            })
        } else alert('Already Approved')
    }

    const handleDecline = () => {
        if (request.status !== 'DECLINE') {
            setConfirmDialog({
                isOpen: true,
                title: 'Are You Sure You want To Decline?',
                subTitle: 'This Request Will Be Deleted!',
                onConfirm: () => changeStatus('DECLINE')
            })
        } else alert('Already Declined')
    }
    const handlePending = () => {
        if (request.status !== 'PENDING') {
            setConfirmDialog({
                isOpen: true,
                title: 'Are You Sure You want to set to Pend ?',
                subTitle: `Maybe it's the right person For Your Pet`,
                onConfirm: () => changeStatus('PENDING')
            })
        } else alert('Already Pending')
    }


    return (
        <div className='rowContainer'>
            <div className='leftSideRR'
            >
                <div className='itemContainer'>
                    <span>Name</span>
                    <span className='adoptiveDetails'>{request.requestorUser.firstName} {request.requestorUser.LastName}</span>
                </div>
                <div className='itemContainer'>
                    <span>Age</span>
                    <span className='adoptiveDetails'>{request.requestorUser.age < 1 ? 'Less Than 1' : request.requestorUser.age}</span>
                </div>
                <div className='itemContainer'>
                    <span>City</span>
                    <span className='adoptiveDetails'>{request.requestorUser.city}</span>
                </div>
                <div className='itemContainer'>
                    <span>Phone</span>
                    <span className='adoptiveDetails'>{request.requestorUser.phone}</span>
                </div>
                <div className='itemContainer'>
                    <span>Status</span>
                    <span className='adoptiveDetails'>{request.status}</span>
                </div>
            </div>


            <div className='rightSideRR'>
                <button type="button" value="" onClick={handleApprove} className="changeReqStatusBtn" style={{ backgroundColor: '#C3E5AE', color: request.status === 'APPROVE' && 'black', display: request.status === 'APPROVE' && 'none' }} >Approve</button>
                <button type="button" value="" onClick={handleDecline} className="changeReqStatusBtn" style={{ backgroundColor: '#F4BBBB', color: request.status === 'DECLINE' && 'black', display: request.status === 'DECLINE' && 'none' }} >Decline</button>
                <button type="button" value="" onClick={handlePending} className="changeReqStatusBtn" style={{ backgroundColor: '#F1E1A6', color: request.status === 'PENDING' && 'black', display: request.status === 'PENDING' && 'none' }} >Pending</button>
            </div>




            <ConfirmDialog
                confirmDialog={confirmDialog}
                setConfirmDialog={setConfirmDialog}
            />


        </div>
    )
}

export default RequestRow