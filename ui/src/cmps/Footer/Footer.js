import React from 'react'
import './Footer.css'

import {
    FaYoutube,
    FaFacebook,
    FaTwitter,
    FaInstagram
} from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate()
    return (
        <div className="footerContainer">
            <div className='footerIconsContainer'>

                <a href="https://www.youtube.com"
                    className="youtube social">
                    <FaYoutube size={40} />
                </a>
                <a href="https://www.instagram.com"
                    className="instagram social">
                    <FaInstagram size={40} />
                </a>
                <a href="https://www.facebook.com"
                    className="facebook social">
                    <FaFacebook size={40} />
                </a>
                <a href="https://www.twitter.com" className="twitter social">
                    <FaTwitter size={40} />
                </a>
                <button onClick={() => navigate('/aboutUs')} className='appBtn footerBtn'>About Us</button>
            </div>
        </div>)
}

export default Footer