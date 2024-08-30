import React from 'react'
import { useNavigate } from 'react-router-dom'

const ClaimTile = ({ title, claimType, user, id }) => {
    const navigate = useNavigate()

    return (<div className=' bg-color-turq rounded-lg text-white p-4 m-4'>

        <div className='flex flex-col justify-center space-y-4' >
            <div className='flex flex-col justify-between text-pretty md:flex-row '>
                <h1 className='font-medium text-left text-xl'>{title}</h1>
                <div className='text-sm'>{claimType}</div>
            </div>
            <div className='text-right font-light'>By {user.firstName} {user.lastName}</div>
        </div>
        <button
            className='px-2 py-1 bg-color-blue hover:bg-color-dark rounded-lg mt-4'
            onClick={() => navigate(`/view-claim/${id}`)}
        >View Claim</button>

    </div>
    )
}

export default ClaimTile
