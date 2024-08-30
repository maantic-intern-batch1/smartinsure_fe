import axios from '../utils/axiosConf';
import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';

function FileItem({ name, index }) {
    return <li className='flex justify-between px-4 py-2 bg-color-teal rounded-lg my-2 w-full overflow-hidden bg-opacity-50 items-center' key={index}>
        <p>{name}</p>
        <select name={`fileType_${index}`} className="block px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white rounded-lg border-2 border-color-turq">
            <option value="TEXT">Text Report or Bills</option>
            <option value="SCAN">Scans or Images</option>
        </select>
    </li>
}

function DocUpload() {
    const formRef = useRef()
    const { claimId } = useParams()
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isSubmitted, setSubmitted] = useState(false)
    const maxUploads = useLoaderData()
    const [loading, setLoading] = useState(false)
    const userState = useSelector(state => state.user)
    const navigate = useNavigate()

    function arrangeObject(obj) {
        const result = [];
        Object.keys(obj).forEach(key => {
            const index = key.split('_')[1]
            result[index] = obj[key];
        });

        return result;
    }

    const headers = {
        headers: {
            Authorization: `Bearer ${userState.authToken}`
        }
    }

    function handleFileInputChange(event) {
        const newFiles = event.target.files;
        const updatedFiles = [...uploadedFiles, ...Array.from(newFiles)];
        const fileNames = []
        const uniqueFiles = []
        updatedFiles.forEach(file => {
            if (!(file.name in fileNames)) {
                fileNames.push(file.name)
                uniqueFiles.push(file)
            }
        })
        setUploadedFiles(uniqueFiles)
    }

    async function handleFileInputSubmit(event) {
        event.preventDefault();
        if (uploadedFiles.length > maxUploads) {
            alert('too many files');
        }
        const fileTypeData = arrangeObject(Object.fromEntries(new FormData(formRef.current)))
        const data = new FormData()
        uploadedFiles.forEach((file, i) => {
            data.append('files', file)
        })
        data.append('fileTypes', fileTypeData)
        setLoading(true)
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_DOMAIN}/document/upload/${claimId}`, data, { ...headers, 'Content-Type': 'multipart/form-data' })
        setLoading(false)
        if (res.data.err) {
            alert(res.data.err)

        }
        setSubmitted(true)
    }

    return (
        <div>
            {loading && (
                <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
                    <div className="text-xl font-semibold text-gray-700">
                        Loading...
                    </div>
                </div>
            )}

            {maxUploads === 0 && (
                <div className='flex flex-col items-center'>
                    <h1 className='mt-10 text-lg'>Cannot upload more documents for the claim</h1>
                    <p>Maximum number of files (ie 15) is already uploaded for this document. Delete some documents and try again</p>
                    <button onClick={() => navigate('/')} className='bg-color-turq text-white p-4 rounded-lg mt-5 hover:bg-color-blue'>Dashboard</button>
                </div>
            )}

            <div className={`p-8 ${loading && 'blur-sm pointer-events-none'} flex flex-col items-center`}>
                {(!isSubmitted && maxUploads !== 0) &&
                    (
                        <h1 className='my-7 text-3xl font-semibold'>Upload your documents below</h1>
                    )
                }

                <form onSubmit={handleFileInputSubmit} ref={formRef}>
                    {(!isSubmitted && maxUploads !== 0) &&
                        (
                            <div>
                                <input type='file' name='files' multiple className='mt-6' onChange={handleFileInputChange} />
                                <p className='mt-3'>Maximum {maxUploads} {maxUploads === 1 ? 'file' : 'files'} allowed</p>
                            </div>
                        )
                    }

                    <div className='flex flex-col mt-6 border-4 rounded-lg border-color-turq p-4 h-60 max-w-4xl overflow-y-auto'>
                        {uploadedFiles.length > 0 && (
                            <ul className='content-center'>
                                {uploadedFiles.map((file, index) => (
                                    <div key={index}>
                                        <FileItem
                                            name={file.name}
                                            index={index}
                                        />
                                    </div>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className='flex flex-col mt-6 border-4 rounded-lg border-color-turq p-6 h-40 max-w-4xl overflow-y-auto bg-color-teal bg-opacity-50'>
                        <p> <span className='font-medium'>Document upload warning:</span>
                            <br />
                            For efficient processing of your medical insurance claim, we utilize advanced AI technology to analyze submitted documents.
                            To safeguard your protected health information (PHI), <span className='font-bold'> please redact any personal details such as names, dates of birth, UHID, and member ID numbers. </span>
                            This crucial step helps maintain your privacy and ensures a smooth claims process.</p>
                    </div>

                    {(!isSubmitted && maxUploads !== 0) &&
                        (
                            <button type="submit" className='bg-color-turq text-white p-4 rounded-lg mt-5 hover:bg-color-blue'>Upload</button>
                        )
                    }

                    {isSubmitted &&
                        (
                            <div className='mt-10'>
                                <p>Documents submitted!</p>
                                <button onClick={() => navigate('/')} className='bg-color-turq text-white p-4 rounded-lg mt-5 hover:bg-color-blue'>Home</button>
                            </div>
                        )
                    }
                </form>

            </div>
        </div>
    );
}

export default DocUpload;

