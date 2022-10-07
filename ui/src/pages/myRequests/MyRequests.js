import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import MyRequsetRow from '../../cmps/MyRequsetRow/MyRequsetRow'
import requestsService from '../../services/requestsService'


const MyRequests = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [requests, setRequests] = useState([])

    const getRequests = async () => {
        let myRequests = await requestsService.getRequestsByUser(id)
        if (myRequests)
            setRequests(myRequests);
    }
    useEffect(() => {
        getRequests()
    }, []);
    return (
        <div>
            <h1 className='pageTitle'>
                My Requests
            </h1>

            <div className='reqContainer'>
                {requests &&
                    requests.length > 0 ?
                    requests.map((req, i) => {
                        return <MyRequsetRow key={req.id} request={req} getRequests={() => getRequests()} />
                    }) :
                    <h1 className='pageTitle'>You Have No Requests</h1>
                }
            </div>
            <br />
            <input type="button" value='Back to My Account' className='appBtn' onClick={() => navigate(-1)} />
        </div>
    )
}

export default MyRequests