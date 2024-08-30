import axios from '../utils/axiosConf'
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLoaderData, useNavigate, useParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import rupeesFormat from '../utils/rupeesFormat';

function ReportPage() {
    const navigate = useNavigate()
    const { reportId } = useParams()
    const userState = useSelector(state => state.user)
    const report = useLoaderData()
    const [loading, setLoading] = useState(false)
    const summary = JSON.parse(report.combinedSummary).Summary
    const docWiseReport = JSON.parse(report.docWiseReport.text)
    const alternateTreatments = JSON.parse(report.alternateTreatments.text).TreatmentDetails
    const [activeDocReport, setActiveDocReport] = useState(0)
    const treatmentTypes = [...new Set(alternateTreatments.map(at => at.TypeOfTreatment))]
    const [activeTreatmentType, setActiveTreatmentType] = useState(alternateTreatments[0].TypeOfTreatment)
    let totalCost = 0

    const [approvalMessage, setApprovalMessage] = useState(() => {
        if (report.approved !== null) {
            if(report.approved === 'YES')
                return 'Approved';
            else if(report.approved === 'NO')
                return 'Repudiated';
            return 'Decision Pending'
        } else {
          return 'Decision Pending';
        }
      });
    
    const headers = {
        headers: {
            Authorization: `Bearer ${userState.authToken}`
        }
    }

    useEffect(() => {
        if (report.err) navigate('/error', { state: report.err })
    }, [])

    function handleUpdateReport() {
        const data = { s: summary, dw: docWiseReport, at: alternateTreatments }
        navigate(`/update-report/${reportId}`, { state: data })
    }

    async function handleDeleteReport() {
        setLoading(true)
        const res = await axios.delete(`${process.env.REACT_APP_BACKEND_DOMAIN}/report/delete/${reportId}`, headers)
        setLoading(false)
        if (res.data.err) return alert(res.data.err)
        alert(res.data.msg)
        navigate('/')
    }

    if (!userState.authToken) {
        return <Navigate to='/login' />
    }

    Array.from(alternateTreatments).forEach(at => totalCost += Number(at.Cost))

    return (<>
        {loading && (
            <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
                <div className="text-xl font-semibold text-gray-700">
                    Loading...
                </div>
            </div>
        )}
        <div className={`p-2 ${loading && 'blur-sm pointer-events-none'}`}>
            <div>
                {report.approved !== null && <div>
                    <h1 className='m-8 px-2 py-1 text-lg rounded-lg text-white bg-color-turq w-fit'>Approval Status: {approvalMessage}</h1>
                </div>}
                <hr />

                <div className='m-8 rounded-lg p-10 border-2 border-color-turq'>
                    <div className='flex justify-between'>
                        <h1 className='text-lg font-bold'>Report Wise Summary</h1>
                        {userState.role === "CLAIM_ASSESSOR" && <button className='p-2 rounded-md bg-color-turq text-white' onClick={handleUpdateReport}>Edit Report</button>}
                        {userState.role === "CLAIM_ASSESSOR" && <button className='p-2 rounded-md bg-red-500 text-white' onClick={handleDeleteReport}>Delete Report</button>}
                    </div>
                    <div className='flex justify-center mb-6'>
                        <div className='flex overflow-auto mt-16'>
                            {docWiseReport.map((docReport, idx) => (
                                <button
                                    key={idx}
                                    className={`${idx === activeDocReport ? 'bg-color-blue' : 'bg-color-turq'} rounded-lg p-2 m-2 whitespace-nowrap text-white`}
                                    onClick={() => setActiveDocReport(idx)}
                                >
                                    {docReport.MedicalReportName}
                                </button>
                            ))}
                        </div>
                    </div>

                    {docWiseReport[activeDocReport].hasOwnProperty('Findings') && <div>
                        <p><p className='font-semibold inline'>Findings:</p> {docWiseReport[activeDocReport].Findings}</p>
                        <br />
                        <p><p className='font-semibold inline'>Clinical Indication:</p> {docWiseReport[activeDocReport].ClinicalIndication}</p>
                        <br />
                        <p><p className='font-semibold inline'>Type Of Report Uploaded:</p> {docWiseReport[activeDocReport].TypeOfReportUploaded}</p>
                        <br />
                        <p><p className='font-semibold inline'>Diagnosis:</p> {docWiseReport[activeDocReport].Diagnosis}</p>
                        <br />
                        <p><p className='font-semibold inline'>Impression:</p> {docWiseReport[activeDocReport].Impression}</p>
                        <br />
                        <p><p className='font-semibold inline'>Technique:</p> {docWiseReport[activeDocReport].Technique}</p>
                    </div>}

                    {docWiseReport[activeDocReport].hasOwnProperty('Prognosis') && <div>
                        <p><p className='font-semibold inline'>Prognosis:</p> {docWiseReport[activeDocReport].Prognosis}</p>
                    </div>}
                </div>
                <hr />

                <div className='m-8 rounded-lg p-10 bg-color-turq bg-opacity-30 border-2 border-color-turq'>
                    <h1 className='text-lg font-bold'>Consildated Summary</h1>
                    <br />
                    <p>{summary}</p>
                    {report.notes && <div>
                        <br />
                        <h3><p className='font-semibold inline'>Notes: </p>{report.notes}</h3>
                    </div>}
                </div>
                <hr />

                <div className='m-8 rounded-lg p-10 border-2 border-color-turq'>
                    <h1 className='text-lg font-bold'>Alternate Treatments</h1>
                    <div className='mt-2 mb-6'>
                        <h1 className='font-semibold'>Estimated cost: {rupeesFormat(totalCost)}</h1>
                    </div>
                    {treatmentTypes.map(t => (
                        <button key={t} className={`${t === activeTreatmentType ? 'bg-color-blue' : 'bg-color-turq'} rounded-lg p-2 m-2 whitespace-nowrap text-white`}
                            onClick={() => setActiveTreatmentType(t)}>{t}</button>
                    ))}

                    <table className='mt-3 border-collapse border border-slate-300 w-full'>
                        <thead>
                            <tr>
                                <th className='p-5 border border-slate-300 w-full'>Treatment Description</th>
                                <th className='p-5 border border-slate-300'>Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            {alternateTreatments.map(altTreatment => {
                                if (altTreatment.TypeOfTreatment === activeTreatmentType) {
                                    return (
                                        <tr key={uuid()}>
                                            <td className='p-2 border border-slate-300'>{altTreatment.TreatmentDescription}</td>
                                            <td className='p-2 border border-slate-300'>{rupeesFormat(altTreatment.Cost)}</td>
                                        </tr>
                                    )
                                }
                                return <></>
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </>);
}

export default ReportPage;
