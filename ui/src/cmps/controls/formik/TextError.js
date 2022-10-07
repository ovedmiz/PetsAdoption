import React from 'react'

const TextError = ({ children }) => {
    return (
        <div className='error' style={{ color: 'red' }}>
            {children}
        </div>
    )
}

export default TextError