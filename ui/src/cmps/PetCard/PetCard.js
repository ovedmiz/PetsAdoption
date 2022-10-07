import React, { useState } from 'react'

import './PetCard.css'
import { capitalize } from '../../utils/stringUtils';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog'
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../cmps/Notification/NotificationProvider'

const PetCard = ({ pet, onClick, showBtns, deletePet }) => {
    const navigate = useNavigate()
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false, title: '', subTitle: ''
    })
    const notify = useNotification()

    const handleDelete = () => {
        setConfirmDialog({
            isOpen: true,
            title: 'Are You Sure You want To Delete This Pet?',
            subTitle: 'You are about to delete a Pet This Cannot be undone!',
            onConfirm: () => deletePet()
        })
    }
    return (
        <div className='petCard' onClick={onClick} >

            <img className='petImgCard' src={pet.image ?
                `data:image/png;base64,${pet.image}` :
                require('../../assests/icons/logo.png')
            } alt="pet" />

            <div className="petCardText">
                <>
                    <h2 className="petCardHeader">{capitalize(pet.name)}</h2>
                </>
                <>
                    <p className="petCardDetails"> {pet.breed !== "Other" ? pet.breed : ""}   </p>
                    <p className="petCardDetails"> {pet.sex.charAt(0).toUpperCase() + pet.sex.slice(1)}  </p>
                    <p className="petCardDetails"> {pet.age > 0 ? `${pet.age} Years` : 'Less Than a Year'}  </p>
                </>
                {showBtns &&
                    <div className='petCardBtnWrapper'>
                        <input style={{ alignSelf: 'end' }} className='appBtn cardBtn' type="button" value={'Edit Pet'} onClick={() => navigate(`/home/user/editpet/${pet.id}`)} />
                        <input style={{ alignSelf: 'end' }} className='appBtn cardBtn' type="button" value={'Delete'} onClick={() => handleDelete()} />
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

export default PetCard
