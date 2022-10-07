import React from 'react'
import './Logo.css'

const Logo = ({ onClick }) => {
    return (
        <img src={require('../../assests/icons/logo.png')} className='logo' onClick={onClick} />
    )
}

export default Logo