import React from 'react'
import { useNavigate } from 'react-router-dom'

const UserTile = ({ firstName, lastName, role, id }) => {
    const navigate = useNavigate()

    return (
        <div onClick={() => navigate(`/view-user/${id}`)} className='my-2 inline-block w-3/4 border-2 border-blue-500 cursor-pointer px-4 py-2 rounded-md'>
            <div className='flex justify-between'>
                <div className='w-12 h-12 rounded-full bg-blue-500 flex justify-center items-center'>
                    <p className='text-white font-bold'>{firstName[0].toUpperCase()}{lastName[0].toUpperCase()}</p>
                </div>
                <h2>Name: {firstName} {lastName}</h2>
                <p>Role: {role}</p>
                <p>Id: {id}</p>
            </div>
        </div>
    )
}

export default UserTile
