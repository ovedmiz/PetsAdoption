import React, { useContext, useEffect, useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'

import './MainNavigation.css'

import { PetsContext } from '../../context/PetsContext';
import { AuthContext } from '../../context/authContext';

import petsService from '../../services/petsService';
import authService from '../../services/authService'
import storageService from '../../services/storageService'

import Home from '../../pages/home/Home';
import Login from '../../pages/login/Login';
import Registration from '../../pages/registration/Registration';
import PetDetails from '../../pages/petDetails/PetDetails';
import MyAccount from '../../pages/myAccount/MyAccount';
import AddPet from '../../pages/addPet/AddPet';
import EditUser from '../../pages/editUser/EditUser'
import EditPet from '../../pages/editPet/EditPet';
import MyRequests from '../../pages/myRequests/MyRequests';
import UserDetails from '../../pages/userDetails/UserDetails';
import ForgotPassword from '../../pages/forgotPassword/ForgotPassword';
import ResetPassword from '../../pages/resetPassword/ResetPassword';
import ChangePassword from '../../pages/changePassword/ChangePassword';

import Logo from '../Logo/Logo';

import { RiLoginCircleLine } from 'react-icons/ri'
import { AiOutlineForm } from 'react-icons/ai'
import { PagesContext } from '../../context/PagesContext';
import Footer from '../Footer/Footer';
import AboutUs from '../../pages/AboutUs/AboutUs';


export const MainNavigation = () => {
    const [pets, setPets] = useContext(PetsContext)
    const [pages, setPages] = useContext(PagesContext)

    const navigate = useNavigate()
    const [connectedUser, setConnectedUser] = useContext(AuthContext)
    const loggedInUser = storageService.getConnectedUser();

    const [flags, setFlags] = useState({
        isCategorySelected: false
    })

    useEffect(() => {
        if (loggedInUser) {
            setConnectedUser(loggedInUser);
        }
    }, []);

    const handleHomeClick = async () => {
        setPages(0)
        setFlags({ ...flags, isCategorySelected: false })
        setPets(await petsService.getRandomAnimals())
        navigate('/home')
    }

    const handleLogOut = () => {
        setConnectedUser(false)
        authService.logOut()
        navigate('/home')
    }




    return (
        <>
            <div className='mainRow'>
                <div className='leftSide'>
                    <span className='navigationGreet'>{connectedUser ? `Welcome ${connectedUser.firstName} ${connectedUser.lastName}` : 'Welcome Guest, Save a Life!'} </span>
                    {connectedUser && <button onClick={handleLogOut} className='appBtn'>Log Out</button>}
                </div>
                <div className='centerSide'>
                    <Logo onClick={handleHomeClick} className='logo' />
                </div>
                <div className='rightSide'>
                    {connectedUser ?
                        <div className='logoutBox'>
                            <button onClick={() => navigate(`/home/user/${loggedInUser.id}`)} className='appBtn' > My Account </button>
                            <button onClick={() => navigate(`/home/user/${loggedInUser.id}/addpet`)} className='appBtn' > Post Pet </button>
                            <button onClick={() => {
                                navigate(`/home/user/${loggedInUser.id}#mypets`)
                                document.getElementById('abc')?.scrollIntoView()
                            }} className='appBtn' > My Pets </button>
                            <button onClick={() => navigate(`/home/user/${loggedInUser.id}/requests`)} className='appBtn' > My Requests </button>
                        </div>
                        :
                        <div className='loginBox'>
                            <button onClick={() => navigate(`/login`)} className='appBtn'>Login <RiLoginCircleLine /> </button>
                            <button onClick={() => navigate(`/register`)} className='appBtn'>Register <AiOutlineForm /></button>
                        </div>
                    }
                </div>
            </div>

            <Routes>
                <Route path="/" element={<Navigate replace to="/home" />} />
                <Route path="/home" element={<Home
                    isCategorySelected={flags.isCategorySelected}
                    setIsCategorySelected={(value) => setFlags({ ...flags, isCategorySelected: value })} />} />
                <Route path="/home/pet/:id" element={<PetDetails />} />
                <Route path="/home/user/:id" element={loggedInUser ? <MyAccount /> : <Navigate replace to="/login" />} />
                <Route path="/home/user/:id/requests" element={loggedInUser ? <MyRequests /> : <Navigate replace to="/login" />} />
                <Route path="/home/user/:id/requestor/:requestorId" element={loggedInUser ? <UserDetails /> : <Navigate replace to="/login" />} />
                <Route path="/home/user/:id/addpet" element={loggedInUser ? <AddPet /> : <Navigate replace to="/login" />} />
                <Route path="/home/user/:id/changePassword" element={loggedInUser ? <ChangePassword /> : <Navigate replace to="/login" />} />
                <Route path="/home/user/edit/:id" element={loggedInUser ? <EditUser /> : <Navigate replace to="/login" />} />
                <Route path="/home/user/editpet/:id" element={loggedInUser ? <EditPet /> : <Navigate replace to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/login/forgot" element={<ForgotPassword />} />
                <Route path="/login/resetPassword" element={<ResetPassword />} />
                <Route path="/register" element={<Registration />} />
                <Route path="/aboutUs" element={<AboutUs />} />
            </Routes>
            <Footer />

        </>
    )
}
