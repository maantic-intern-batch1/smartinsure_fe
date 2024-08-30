import axios from '../utils/axiosConf'
import React, { useRef, useState } from 'react'

const UpdateSummary = ({ report, headers, reportId }) => {
    const [loading, setLoading] = useState(false)
    const [summary, setSummary] = useState(JSON.parse(report.combinedSummary).Summary)
    const summaryRef = useRef()

    async function handleSummarySubmit(e) {
        e.preventDefault()
        const formData = new FormData(summaryRef.current);
        const data = Object.fromEntries(formData)
        setSummary(data.summary)

        const body = {
            "combinedSummary": JSON.stringify({ Summary: data.summary }),
            "notes": data.notes,
            "approved": data.approved
        }

        setLoading(true)
        const res = await axios.put(`${process.env.REACT_APP_BACKEND_DOMAIN}/report/update/${reportId}`, body, headers)
        if (res.data.err) {
            alert(res.data.err)
        }
        setLoading(false)
    }

    async function handleGenSummary(e) {
        e.preventDefault()
        setLoading(true)
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_DOMAIN}/report/summary/generate/${reportId}`, headers)
        setLoading(false)
        if (res.data.err) {
            alert(res.data.err)
        }
        const newSummary = JSON.parse(res.data.msg).Summary
        summaryRef.current.summary.value = newSummary
        setSummary(newSummary)
        return
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
                    <h1 className='my-6 font-bold text-xl'>Claim Assessment</h1>
                    <button className='h-10 px-3 rounded-md bg-color-dark text-white m-2 p-2' onClick={handleGenSummary}>Generate new consolidated summary</button>
                </div>
                <form ref={summaryRef} className='flex flex-col gap-y-3 my-5 justify-start' onSubmit={handleSummarySubmit}>
                    <div className="flex flex-col space-y-4">
                        <label className='mr-auto'>Decision</label>
                        <select name='approved' className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full rounded-lg border-2 border-color-turq bg-color-turq bg-opacity-30">
                            <option value="STALL">Decision Pending</option>
                            <option value="YES">Approved</option>
                            <option value="NO">Repudiated</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="summary">Summary</label>
                        <textarea className='h-48 p-3 bg-color-turq bg-opacity-30' name="summary" defaultValue={summary} />
                    </div>
                    <div>
                        <label htmlFor="notes">Notes</label>
                        <textarea className='h-20' name="notes" defaultValue={report.notes} />
                    </div>

                    <button className={`inline-block self-center p-2 m-2 mt-4 text-white rounded-md bg-color-blue`} type="submit">Submit</button>
                </form>
            </div>
        </div>
    </>)
}

export default UpdateSummary
