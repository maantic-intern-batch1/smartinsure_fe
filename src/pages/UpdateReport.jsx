import React from 'react'
import { useSelector } from 'react-redux'
import { useLoaderData, useParams, useNavigate } from 'react-router-dom'
import UpdateSummary from '../components/UpdateSummary'
import UpdateTreatments from '../components/UpdateTreatments'
import UpdateDocwise from '../components/UpdateDocwise'

const UpdateReport = () => {
    const navigate = useNavigate()
    const { reportId } = useParams()
    const userState = useSelector(state => state.user)
    const report = useLoaderData()

    const headers = {
        headers: {
            Authorization: `Bearer ${userState.authToken}`
        }
    }

    return (<div className='flex justify-center'>
        <div className='w-3/4'>
            <div className='flex flex-col'>
                <div className='flex justify-center mt-4 md:mt-10'>
                    <button className='py-2 px-4 bg-color-dark hover:bg-color-blue w-fit rounded-lg text-white'
                        onClick={() => navigate(`/view-report/${reportId}`)}
                        key={"dashboard"}>Back to Report</button>
                </div>

                <UpdateDocwise report={report} reportId={reportId} headers={headers} />
                <hr />
                <UpdateTreatments report={report} reportId={reportId} headers={headers} />
                <hr />
                <UpdateSummary report={report} reportId={reportId} headers={headers} />
                <div className='flex justify-center mt-4 md:mt-10'>
                    <button className='py-2 px-4 bg-color-dark hover:bg-color-blue w-fit rounded-lg text-white'
                        onClick={() => navigate(`/view-report/${reportId}`)}
                        key={"dashboard"}>Back to Report</button>
                </div>
            </div>
        </div>
    </div>)
}

export default UpdateReport
