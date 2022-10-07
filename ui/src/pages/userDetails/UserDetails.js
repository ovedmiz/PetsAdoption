import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import usersService from '../../services/usersService'

const UserDetails = () => {
    const [user, setUser] = useState({})
    const navigate = useNavigate()
    const { requestorId } = useParams()


    useEffect(() => {
        const getUser = async () => {
            let user = await usersService.getUserById(requestorId)
            setUser(user)
        }
        getUser()
    }, []);
    return (
        <div>
            <h1 className='pageTitle'>
                Requestor Details
            </h1>

            <div className='detailsContainerAccount'>
                <div className='detailsWrapperAccount'>
                    <span>Name: </span>
                    <p>{user.firstName} {user.lastName} </p>
                    <span>Email: </span>
                    <p>{user.email}</p>
                    <span>Age: </span>
                    <p>{user.age}</p>
                    <span>Date of Birth: </span>
                    <p>{user.dob}</p>
                    <span>City: </span>
                    <p>{user.city}</p>
                    <span>Phone: </span>
                    <p>{user.phone}</p>
                </div>
            </div>




            <input type="button" value="Back" className='appBtn' onClick={() => navigate(-1)} />

        </div>
    )
}

export default UserDetails