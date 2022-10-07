import React from 'react'
import ReactLoading from 'react-loading'

const Spinner = ({ size = 60 }) => {
    return (
        <div className='spinningBubbles' style={{ padding: '50px' }}>
            <ReactLoading type={'spinningBubbles'} color="rgb(255, 94, 0, 0.5)" width={size} height={size} />
        </div>
    )
}

export default Spinner