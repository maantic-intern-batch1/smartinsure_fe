import React, { useEffect, useRef, useState } from 'react';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
import DocViewer from '../components/DocViewer';
import { useSelector } from 'react-redux';
import axios from '../utils/axiosConf';
import dayjs from 'dayjs';
import rupeesFormat from '../utils/rupeesFormat'

const ViewClaim = () => {
    const { claimId } = useParams()
    const formRef = useRef()
    const navigate = useNavigate()
    const [claim, setClaim] = useState(useLoaderData())
    const userState = useSelector(state => state.user)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (claim.err) return navigate('/error', claim.err)
    }, [])

    const headers = {
        headers: {
            Authorization: `Bearer ${userState.authToken}`
        }
    }

    async function handleGenReport() {
        setLoading(true)
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_DOMAIN}/report/generate/${claim.id}`, headers)
        setLoading(false)
        if (res.data.err) return alert(res.data.err)
        setClaim(prevClaim => ({ ...prevClaim, report: { ...res.data.msg } }))
        alert('Report generated for this claim successfully')
    }

    return (<>
        {loading && (
            <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
                <div className="text-xl font-semibold text-gray-700">
                    Loading...
                </div>
            </div>
        )}
        <div className={`w-full ${loading && 'blur-sm pointer-events-none'}`}>
            <form ref={formRef}>
                <div className={`flex w-full items-center flex-col`}>

                    <div>
                        <h1 className='font-medium text-3xl text-center m-10'>Claim Title: {claim.title}</h1>
                        <h3 className='font-medium text-xl text-center mb-10'>Description: {claim.desc}</h3>
                        <div className='flex justify-center'>
                            {userState.role === "POLICY_HOLDER" && <div className='bg-color-turq text-white m-2 px-4 py-2 font-medium rounded-lg inline-block cursor-pointer' onClick={() => navigate(`/edit-claim/${claimId}`, { claim })}>Edit</div>}
                            {userState.role === "CLAIM_ASSESSOR" && <>
                                {claim.report === null ?
                                    <>
                                        <div className='bg-color-turq text-white m-2 px-4 py-2 font-medium rounded-lg inline-block cursor-pointer' onClick={handleGenReport}>Generate report </div>
                                    </> :
                                    <>
                                        <div className='bg-color-turq text-white m-2 px-4 py-2 font-medium rounded-lg inline-block cursor-pointer' onClick={() => navigate(`/view-report/${claim.report.id}`)}>Go to report</div>
                                    </>
                                }
                            </>}
                        </div>
                    </div>

                    <table className='flex flex-col border-2 border-color-turq rounded-lg w-auto px-10 py-8 mt-5'>
                        <tbody className='border-spacing-2'>
                            <tr>
                                <th className='text-left pr-14'>Type of claim</th>
                                <td>{claim.claimType}</td>
                            </tr>
                            <tr>
                                <th className='text-left'>Hospital name</th>
                                <td>{claim.hospName}</td>
                            </tr>
                            <tr>
                                <th className='text-left'>Hospital city</th>
                                <td>{claim.hospCity}</td>
                            </tr>
                            <tr>
                                <th className='text-left'>Hospital code</th>
                                <td>{claim.hospCode}</td>
                            </tr>
                            <tr>
                                <th className='text-left'>Date of Admission  </th>
                                <td>{dayjs(claim.dateOfAdmission).format('DD-MM-YYYY')}</td>
                            </tr>
                            <tr>
                                <th className='text-left'>Date of Intimation</th>
                                <td>{dayjs(claim.dateOfIntimation).format('DD-MM-YYYY')}</td>
                            </tr>
                            <tr>
                                <th className='text-left'>Claim Amount</th>
                                <td>{rupeesFormat(claim.claimAmount)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </form>
            <DocViewer editable={false} documents={Array.from(claim.documents)} claimId={claim.id} />
        </div>
    </>);
};

export default ViewClaim;
