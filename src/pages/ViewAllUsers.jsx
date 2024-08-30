import React from 'react'
import { useLoaderData } from 'react-router-dom'
import UserTile from '../components/UserTile'

const ViewAllUsers = () => {
    const users = useLoaderData()

    return (<>
        <div className='flex items-center justify-center'>
            <h1 className='my-8 text-3xl font-semibold'>List of Policy Holders</h1>
        </div>

        <div className='w-full flex flex-col items-center'>
            {users.length === 0 ?
                <p className='mt-10'>No users found</p> :
                users.map(user => <UserTile key={user.id} {...user} />)
            }
        </div>
    </>)
}

export default ViewAllUsers
