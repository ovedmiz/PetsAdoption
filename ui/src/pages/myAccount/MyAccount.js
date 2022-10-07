import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import PetCard from '../../cmps/PetCard/PetCard'
import requestsService from '../../services/requestsService'
import usersService from '../../services/usersService'
import './MyAccount.css'
import RequsetRow from '../../cmps/RequsetRow/RequestRow'
import petsService from '../../services/petsService'
import { capitalize } from '../../utils/stringUtils'
import { useNotification } from '../../cmps/Notification/NotificationProvider'




const MyAccount = () => {
    let navigate = useNavigate()
    let params = useParams();
    let location = useLocation()
    const [userPets, setUserPets] = useState([])
    const [user, setUser] = useState({})
    const [petRequests, setPetrequests] = useState(null)
    const [selcetedPet, setSelectedPet] = useState({ id: '', name: '' })

    const notify = useNotification()

    const myRef = useRef(null)

    const petsRef = useRef(null)

    const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop)


    const getPets = async () => {
        let pets = await usersService.getUserPets(params.id)
        setUserPets(pets)
    }
    const getRequests = async (petId, petName) => {
        try {

            let petRequests = await requestsService.getRequestsByAnimal(petId)
            setPetrequests(petRequests.data)
        } catch (error) {
            notify({
                type: "EROOR",
                msg: `There was A Problem Getting Requests For ${petName}`
            })
        }


    }
    useEffect(() => {
        getPets()
    }, []);

    useEffect(() => {
        if (location.hash && myRef) {
            setTimeout(() => {
                scrollToRef(myRef)
            }, 150);
        }
    }, []);


    const getUser = async () => {
        let user = await usersService.getUserById(params.id)
        setUser(user)
    }

    useEffect(() => {
        getUser()
    }, []);



    const handlePetClick = async (petId, petName) => {
        setSelectedPet({ name: petName, id: petId })
        getRequests(petId, petName)
        petsRef.current.scrollIntoView()

    }

    const deletePet = async (petId) => {
        try {
            const resp = await petsService.deletePet(petId)
            console.dir(resp)
            getPets()
            setPetrequests(null)
            setSelectedPet({ id: '', name: '' })
            notify({ type: 'SUCCESS', msg: 'Deleted Successfully' })

        } catch (err) {
            notify({ type: 'ERROR', msg: 'There was A Problem.. Try Again' })

        }
    }


    return (
        <>
            <h1 className='pageTitle'>My Account</h1>

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


                <div className='btnWrapperDetalis'>
                    <input type="button" value="Edit My Details" onClick={() => navigate(`/home/user/edit/${params.id}`)} className='appBtn' />
                    <input type="button" value="Post Pet For Adoption" onClick={() => navigate(`/home/user/${params.id}/addpet`)} className='appBtn ' />
                    <input type="button" value="Check My Requests" onClick={() => navigate(`/home/user/${params.id}/requests`)} className='appBtn' />
                    <input type="button" value="Change Password" onClick={() => navigate(`/home/user/${params.id}/changePassword`)} className='appBtn ' />
                    <input type="button" value="Back Home" onClick={() => navigate(`/home`)} className='appBtn' />

                </div>
            </div>

            {userPets?.length > 0 ? <h1 ref={myRef} className='pageTitle'>My Pets</h1> : <h1 ref={myRef} className='pageTitle'>You Have No Pets Posted </h1>}
            <div id='abc' className='petsContainer'>
                {userPets.map(pet =>

                    <PetCard
                        key={pet.id}
                        pet={pet}
                        onClick={() => handlePetClick(pet.id, pet.name)}
                        deletePet={() => deletePet(pet.id)}
                        showBtns={true}
                    />

                )
                }
            </div>

            <div className='requestsContainer' ref={petsRef}>
                {selcetedPet.name ? petRequests?.length > 0 ? <h1 className='pageTitle'>Requests For {capitalize(selcetedPet.name)}</h1> : <h1 className='pageTitle'>No Requests For {capitalize(selcetedPet.name)}</h1> : ''}
                {petRequests?.length > 0 &&
                    <div className='reqContainer' ref={myRef} >
                        {petRequests.map((petReq) => {
                            return <RequsetRow key={petReq.id} request={petReq} selcetedPetId={selcetedPet.id} handleStatusChange={handlePetClick} />
                        })}
                    </div>
                }
            </div>
        </>
    )
}

export default MyAccount