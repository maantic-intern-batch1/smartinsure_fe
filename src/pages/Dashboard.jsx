import { Navigate, useLoaderData, useNavigate } from 'react-router-dom'
import ClaimTile from '../components/ClaimTile'
import { useRef, useState } from 'react'
import axios from '../utils/axiosConf'
import { useSelector } from 'react-redux'


const Dashboard = () => {
    const navigate = useNavigate()
    const loaderData = useLoaderData()
    const [claims, setClaims] = useState(loaderData)
    const formRef = useRef()
    const userState = useSelector(state => state.user)

    if (loaderData.err) return navigate('/error', loaderData.err)

    if (!userState.authToken) {
        return <Navigate to='/login' />
    }

    const headers = {
        headers: {
            Authorization: `Bearer ${userState.authToken}`
        }
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        const formData = new FormData(formRef.current);
        const { claimsPerPage, pageNumber } = Object.fromEntries(formData)
        const endpt = userState.role === "CLAIM_ASSESSOR" ? 'claim/pending' : 'claim/my-claims'
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_DOMAIN}/${endpt}?claimsPerPage=${claimsPerPage}&pageNumber=${pageNumber}`, headers)
        if (res.data.err) {
            alert(res.data.err)
            return
        }
        formRef.current.reset()
        setClaims(JSON.parse(res).msg)
    }

    return (<>
    
        <div className='w-full'>

            {userState.role === "CLAIM_ASSESSOR" && <>
                <h1 className='font-medium text-3xl text-center m-10'>Pending Claims</h1>
            </>}

            {userState.role === "POLICY_HOLDER" && <>
                <h1 className='font-medium text-3xl text-center m-10'>Claims raised by me</h1>
            </>}

            <form ref={formRef} onSubmit={handleFormSubmit}>
                <div className='flex justify-center items-center space-x-5'>
                        <label htmlFor="claimsPerPage">Claims per page: </label>
                        <input type="number" name='claimsPerPage'/>
                        <label htmlFor="pageNumber">Page number: </label>
                        <input type="number" name='pageNumber' />
                    
                </div>
            </form>

            <div>
                {claims.length === 0 ?
                    <div >{
                        userState.role === "CLAIM_ASSESSOR" ? <p>No cliams pending yet</p> : <p>No cliams filed yet</p>
                    }</div>
                    : <div className='flex flex-row flex-wrap justify-center lg:justify-around'>
                        {claims.map(claim => <div key={claim.id} className='md:w-2/3 lg:w-1/4'>
                            <ClaimTile {...claim} />
                        </div>)}
                    </div>
                }
            </div>
        </div>
    </>)
}

export default Dashboard
