import React, { useRef, useState } from 'react'
import { v4 as uuid } from 'uuid'
import axios from '../utils/axiosConf'

const UpdateDocwise = ({ report, headers, reportId }) => {
    const [docWise, setDocWise] = useState(JSON.parse(report.docWiseReport.text))
    const [activeDocIdx, setActiveDocIdx] = useState(0)  // store active doc's index number
    const docWiseFormRef = useRef()
    const medicalRepNames = useRef(docWise.map(dw => dw.MedicalReportName))
    const [loading, setLoading] = useState(false)

    function handleChangeActiveDoc(e, docIdx) {
        e.preventDefault()
        const formData = new FormData(docWiseFormRef.current);
        const data = Object.fromEntries(formData)

        setDocWise(dws => {
            const newDw = []
            dws.forEach((dw, i) => {
                if (i === activeDocIdx) {
                    newDw.push(data)
                } else {
                    newDw.push(dw)
                }
            })
            return newDw
        })
        setActiveDocIdx(docIdx)
    }

    async function handleDocWiseSubmit(e) {
        e.preventDefault()
        const formData = new FormData(docWiseFormRef.current);
        const data = Object.fromEntries(formData)
        let newDw = []
        docWise.forEach((dw, i) => {
            if (i === activeDocIdx) {
                newDw.push(data)
            } else {
                newDw.push(dw)
            }
        })
        newDw = newDw.filter(dw => dw.MedicalReportName !== '')
        medicalRepNames.current = newDw.map(dw => dw.MedicalReportName)
        setActiveDocIdx(0)
        setDocWise(newDw)
        setLoading(true)
        const res = await axios.put(`${process.env.REACT_APP_BACKEND_DOMAIN}/report/docWise/update/${reportId}`,
            { "text": JSON.stringify(newDw) },
            headers)
        setLoading(false)
        if (res.data.err) {
            alert(res.data.err)
        }
    }

    async function handleGenDocWise(e) {
        e.preventDefault()
        setLoading(true)
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_DOMAIN}/report/docwise/generate/${reportId}`, headers)
        setLoading(false)
        if (res.data.err) {
            alert(res.data.err)
        }
        const newDw = JSON.parse(res.data.msg)
        setDocWise(newDw)
        medicalRepNames.current = newDw.map(dw => dw.MedicalReportName)
    }

    return (<>
        {loading && (
            <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
                <div className="text-xl font-semibold text-gray-700">
                    Loading...
                </div>
            </div>
        )}
        <div className={`p-2 ${loading && 'blur-sm pointer-events-none'}`}>
            <div className='m-2 p-2'>
                <div className='flex justify-between'>
                    <div className='my-6'>
                        <h1 className='font-bold text-xl'>Edit Report Wise Summary</h1>
                        <p>Leave medical report name field name empty to delete corresponding report</p>
                    </div>
                    <button className='h-10 px-3 rounded-md bg-color-dark text-white m-2 p-2' onClick={handleGenDocWise}>Generate new report wise summary</button>
                </div>
                <div className='flex'>
                    {docWise.map((_, i) => <div key={`dwbuttons_${uuid()}`}>
                        <div
                            className={`p-2 m-2 cursor-pointer inline-block text-white rounded-md ${activeDocIdx === i ? 'bg-color-blue' : 'bg-color-turq'}`}
                            onClick={(e) => handleChangeActiveDoc(e, i)}>{medicalRepNames.current[i]}</div>
                    </div>)}
                </div>

                <div>
                    {docWise[activeDocIdx].hasOwnProperty('Findings') && <>
                        {/* !IMPORTANT! in the immediate line below, we can see we have provided key even though its not a list but as we are mounting and unmounting the element react loses track of which form has which value */}
                        <form key={`dwscan_${uuid()}`} ref={docWiseFormRef} className='flex flex-col gap-y-3 my-6'>
                            <div className='flex flex-col'>
                                <label htmlFor="MedicalReportName">Medical Report Name</label>
                                <input type="text" className='h-10' name="MedicalReportName" defaultValue={docWise[activeDocIdx].MedicalReportName} />
                            </div>
                            <div className='flex flex-col'>
                                <label htmlFor="Findings">Findings</label>
                                <input type="text" className='h-10' name="Findings" defaultValue={docWise[activeDocIdx].Findings} />
                            </div>
                            <div className='flex flex-col'>
                                <label htmlFor="ClinicalIndication">Clinical Indication</label>
                                <input type="text" className='h-10' name="ClinicalIndication" defaultValue={docWise[activeDocIdx].ClinicalIndication} />
                            </div>
                            <div className='flex flex-col'>
                                <label htmlFor="TypeOfReportUploaded">Type Of Report Uploaded</label>
                                <input type="text" className='h-10' name="TypeOfReportUploaded" defaultValue={docWise[activeDocIdx].TypeOfReportUploaded} />
                            </div>
                            <div className='flex flex-col'>
                                <label htmlFor="Diagnosis">Diagnosis</label>
                                <input type="text" className='h-10' name="Diagnosis" defaultValue={docWise[activeDocIdx].Diagnosis} />
                            </div>
                            <div className='flex flex-col'>
                                <label htmlFor="Impression">Impression</label>
                                <input type="text" className='h-10' name="Impression" defaultValue={docWise[activeDocIdx].Impression} />
                            </div>
                            <div className='flex flex-col'>
                                <label htmlFor="Technique">Technique</label>
                                <input type="text" className='h-10' name="Technique" defaultValue={docWise[activeDocIdx].Technique} />
                            </div>
                        </form>
                    </>}
                    {docWise[activeDocIdx].hasOwnProperty('Prognosis') && <>
                        <form key={`dwtext_${uuid()}`} ref={docWiseFormRef} className='flex flex-col gap-y-3 my-6'>
                            <div className='flex flex-col'>
                                <label htmlFor="MedicalReportName">Medical Report Name</label>
                                <input type="text" className='h-10' name="MedicalReportName" defaultValue={docWise[activeDocIdx].MedicalReportName} />
                            </div>
                            <div className='flex flex-col'>
                                <label htmlFor="Prognosis">Prognosis</label>
                                <textarea className='h-10 min-h-16' name="Prognosis" defaultValue={docWise[activeDocIdx].Prognosis} />
                            </div>
                        </form>
                    </>}
                    <div className="flex justify-center items-center">
                        <button onClick={handleDocWiseSubmit}
                            className={`inline-block p-2 m-2 mt-4 text-white rounded-md bg-color-blue`}
                            type="submit">Set Docwise Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default UpdateDocwise