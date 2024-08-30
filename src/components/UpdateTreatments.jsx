import axios from '../utils/axiosConf'
import React, { useRef, useState } from 'react'
import { v4 as uuid } from 'uuid'

const UpdateTreatments = ({ report, headers, reportId }) => {
    const [loading, setLoading] = useState(false)
    const [altTreatements, setAltTreatements] = useState(JSON.parse(report.alternateTreatments.text).TreatmentDetails)
    const treatmentsFormRef = useRef()

    const listOfObjects = (input) => {
        const result = [];
        Object.keys(input).forEach((key) => {
            const [field, index] = key.split('_');
            const idx = Number(index);

            if (!result[idx]) {
                result[idx] = {};
            }

            result[idx][field] = input[key];
        });
        return result;
    }

    async function handleAltTreatmentsSubmit(e) {
        e.preventDefault()
        const formData = new FormData(treatmentsFormRef.current);
        const data = listOfObjects(Object.fromEntries(formData))
        setAltTreatements(data)
        setLoading(true)
        const res = await axios.put(`${process.env.REACT_APP_BACKEND_DOMAIN}/report/treaments/update/${reportId}`,
            { "text": JSON.stringify({ TreatmentDetails: data }) },
            headers)
        if (res.data.err) {
            alert(res.data.err)
        }
        setLoading(false)
    }

    async function handleGenAltTreatments(e) {
        e.preventDefault()
        setLoading(true)
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_DOMAIN}/report/treatments/generate/${reportId}`, headers)
        setLoading(false)
        if (res.data.err) {
            alert(res.data.err)
        }
        setAltTreatements(JSON.parse(res.data.msg).TreatmentDetails)
    }

    function handleRemoveTreatment(idx) {
        const formData = new FormData(treatmentsFormRef.current);
        const data = listOfObjects(Object.fromEntries(formData))
        setAltTreatements(data.filter((_, i) => i !== idx))
    }

    function handleAddTreatment() {
        const formData = new FormData(treatmentsFormRef.current)
        const data = listOfObjects(Object.fromEntries(formData))
        setAltTreatements([...data, {
            "TreatmentDescription": "",
            "TypeOfTreatment": "",
            "Cost": 0
        }])
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
                <div className='flex justify-between items-center'>
                    <h1 className='my-6 font-bold text-xl'>Edit Alternate Treatments</h1>
                    <button className='h-10 px-3 rounded-md bg-color-dark text-white' onClick={handleGenAltTreatments}>Generate new alternate treatments</button>
                    <button className='h-10 px-3 rounded-md bg-color-teal' onClick={() => handleAddTreatment()}>Add new</button>
                </div>
                <form onSubmit={handleAltTreatmentsSubmit} ref={treatmentsFormRef}>
                    {altTreatements.map((altTreatement, idx) => (
                        <div key={`at_${uuid()}`} className='w-full flex my-5 gap-x-4'>
                            <div className='w-[70%]'>
                                <textarea className='h-20 w-full' type="text" name={`TreatmentDescription_${idx}`} defaultValue={altTreatement.TreatmentDescription} />
                            </div>
                            <div className='w-[15%]'>
                                <input className='h-10 w-full' type="text" name={`TypeOfTreatment_${idx}`} defaultValue={altTreatement.TypeOfTreatment} />
                            </div>
                            <div className='w-[10%]'>
                                <input className='h-10 w-full' type="number" name={`Cost_${idx}`} defaultValue={altTreatement.Cost} />
                            </div>
                            <div className='cursor-pointer rounded-lg h-10 bg-red-500 text-white mx-2 p-2' onClick={() => handleRemoveTreatment(idx)}>Delete</div>
                        </div>
                    ))}
                    <div className="flex justify-center items-center">
                        <button className={`inline-block self-center p-2 my-2 mt-4 text-white rounded-md bg-color-blue`} type="submit">Set Alternate Treatments</button>
                    </div>
                </form>
            </div>

        </div>
    </>)
}

export default UpdateTreatments