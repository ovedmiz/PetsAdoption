import React from 'react'
import './CategoryButton.css'

const CategoryButton = ({ onClick, active, category }) => {
    return (
        <input type='button' style={{ background: active && 'rgb(250, 187, 81, 0.8)', color: active && 'black' }} value={category} onClick={onClick} className='categoryBtn' />
    )
}

export default CategoryButton