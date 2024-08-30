import React, { useRef, useState } from 'react'
import { useLoaderData, useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import ClaimTile from '../components/ClaimTile'
import { useSelector } from 'react-redux';
import axios from '../utils/axiosConf'


const ViewUser = () => {
    const { userId } = useParams()
    const [user, setUser] = useState(useLoaderData())
    const [loading, setLoading] = useState(false)
    const [showPassInput, setShowPassInput] = useState(false)
    const userState = useSelector(state => state.user)
    const passwdRef = useRef()

    const headers = {
        headers: {
            Authorization: `Bearer ${userState.authToken}`
        }
    }

    async function handlePromoteToCA() {
        setLoading(true)
        const res = await axios.put(`${process.env.REACT_APP_BACKEND_DOMAIN}/user/promote-to-claim-assessor/${userId}`, {}, headers)
        setLoading(false)
        if (res.data.err) return alert(res.data.err)
        setUser(usr => ({ ...usr, userDetails: { ...usr.userDetails, role: "CLAIM_ASSESSOR" } }))
        alert(res.data.msg)
    }

    return (<div>
        {loading && (
            <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
                <div className="text-xl font-semibold text-gray-700">
                    Loading...
                </div>
            </div>
        )}
        <div className={`flex justify-center items-center flex-col ${loading && 'blur-sm pointer-events-none'}`}>
            <div className='w-full'>
                <div className='flex justify-center'>
                    {(user.role === "POLICY_HOLDER" && userState.role === "CLAIM_ASSESSOR") && <button className='bg-color-dark p-2 m-2 text-white rounded-md' onClick={handlePromoteToCA}>Promote to Claim Assessor</button>}
                </div>

                {showPassInput && <div className='flex gap-1 justify-center items-center'>
                    <div>
                        <label htmlFor="password">Enter password</label>
                        <input className='h-10 w-full' name='password' id='password' type="password" ref={passwdRef} />
                    </div>
                    <button className='border-4 border-slate-400 m-2 p-2 rounded-md' onClick={() => setShowPassInput(false)}>Cancel</button>
                </div>}
                <div className='flex justify-center'>
                    <table className='flex flex-col border-2 border-color-turq rounded-lg w-fit px-10 py-8 m-5'>
                        <tbody className='border-spacing-2'>
                            <tr>
                                <th className='text-left'>Name</th>
                                <td>{user.firstName} {user.lastName}</td>
                            </tr>
                            <tr>
                                <th className='text-left'>Age</th>
                                <td>{dayjs().diff(user.dob, 'year')} Years</td>
                            </tr>
                            <tr>
                                <th className='text-left'>Role</th>
                                <td>{user.role}</td>
                            </tr>
                            <tr>
                                <th className='text-left'>Address</th>
                                <td>{user.address}</td>
                            </tr>
                            <tr>
                                <th className='text-left'>Phone</th>
                                <td>{user.phone}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div>
                    {user.role === "POLICY_HOLDER" &&
                        <div className='font-medium text-3xl text-center my-5'>
                            <p>Claims Raised by the user</p>
                        </div>
                    }
                    {user.role === 'POLICY_HOLDER' && <>{
                        user.claims.length === 0 ?
                            <div className='my-7 flex items-center justify-center'><p>No claims made by the user yet</p></div>
                            : <div className='flex flex-row flex-wrap justify-center lg:justify-around'>
                                {user.claims.map(claim => <div key={claim.id} className='md:w-2/3 lg:w-1/4'>
                                    <ClaimTile {...claim} />
                                </div>)}
                            </div>
                    }</>
                    }
                </div>
            </div>
        </div>
    </div>)
}

export default ViewUser

