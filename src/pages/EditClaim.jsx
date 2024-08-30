import axios from '../utils/axiosConf';
import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import DocViewer from '../components/DocViewer';

const EditClaim = () => {
	const formRef = useRef()
	const { claimId } = useParams()
	const [claim, setClaim] = useState(useLoaderData().claims)
	const hospCodes = useLoaderData().hospCodes
	const navigate = useNavigate()
	const hospCodeRef = useRef()
	const userState = useSelector(state => state.user)
	const [loading, setLoading] = useState(false)

	const [hosp, setHosp] = useState({
		name: claim.hospName,
		city: claim.hospCity,
		code: claim.hospCode,
	})

	const headers = {
		headers: {
			Authorization: `Bearer ${userState.authToken}`
		}
	}

	async function getHosp() {
		const hospCode = hospCodeRef.current.value
		setLoading(true)
		const res = await axios.get(`${process.env.REACT_APP_BACKEND_DOMAIN}/policy/hosp/${hospCode}`, headers)
		setLoading(false)
		if (res.data.err) {
			alert(res.data.err)
			return
		}
		setHosp({ ...res.data.msg })
	}

	async function submit(event) {
		event.preventDefault();
		const formData = new FormData(formRef.current);
		const data = Object.fromEntries(formData)
		data.claimAmount = +data.claimAmount
		data.dateOfAdmission = dayjs(data.dateOfAdmission).format('YYYY-MM-DD')
		data.dateOfIntimation = dayjs(data.dateOfIntimation).format('YYYY-MM-DD')
		data.documents = claim.documents
		setClaim(data)
		setLoading(true)
		const res = await axios.put(`${process.env.REACT_APP_BACKEND_DOMAIN}/claim/update/${claimId}`, data, headers)
		setLoading(false)
		if (res.data.err) {
			alert(res.data.err)
			return
		}
		alert(res.data.msg)
		return navigate(`/upload-docs/${claim.id}`)
	};

	async function handleDeleteClaim() {
		setLoading(true)
		const res = await axios.delete(`${process.env.REACT_APP_BACKEND_DOMAIN}/claim/delete/${claimId}`, headers)
		setLoading(false)
		if (res.data.err) return alert(res.data.err)
		alert('Claim deleted successfully')
		return navigate('/')
	}

	return (<>
		{loading && (
			<div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
				<div className="text-xl font-semibold text-gray-700">
					Loading...
				</div>
			</div>
		)}
		<div className={`${loading && 'pointer-events-none'}`}>
			<div className='flex justify-center mt-10 gap-x-5'>
				<button className='bg-color-dark hover:bg-color-blue py-2 px-4 rounded-lg text-white' onClick={() => navigate(`/view-claim/${claim.id}`)}>Back to Claim</button>
				<button className='bg-color-teal hover:bg-color-blue py-2 px-4 rounded-lg' onClick={() => navigate(`/upload-docs/${claim.id}`)}>Upload documents</button>
			</div>
			<form ref={formRef}>
				<div className='flex flex-col items-center'>
					<div id='title' className='text-2xl bg-color-turq rounded-2xl w-4/5 h-16 content-center mb-6 mt-10'>
						<h1 className='pl-6 text-left text-white'>Claim Initiation</h1>
					</div>
					<div className='flex md:flex-row flex-col w-4/5 justify-center items-center md:items-start space-y-4 md:space-y-0'>
						<div className="flex flex-col w-11/12 space-y-4 md:mr-2">
							<label className='mr-auto'>Date of Admission</label>
							<input name="dateOfAdmission" type='date' defaultValue={dayjs(claim.dateOfAdmission).format('YYYY-MM-DD')} />
							<label className='mr-auto'>Claim title</label>
							<input name="title" type='text' defaultValue={claim.title} />
							<label className='mr-auto'>Claim Description</label>
							<textarea name="desc" defaultValue={claim.desc} />
						</div>
						<div className="flex flex-col w-11/12 space-y-4 md:mr-2">
							<label className='mr-auto'>Claim Amount</label>
							<input name="claimAmount" type='number' defaultValue={claim.claimAmount} />
							<label className='mr-auto'>Claim Category Type</label>
							<select defaultValue={claim.claimType} name='claimType' className="px-4 py-0.5 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full rounded-lg border-2 border-color-turq">
								<option value="Cashless">Cashless</option>
								<option value="Reimbursement">Reimbursement</option>
							</select>
						</div>
					</div>

					<div id='title' className='text-2xl bg-color-turq rounded-2xl w-4/5 h-16 content-center mb-6 mt-20'>
						<h1 className='pl-6 text-left text-white'>Patient Details</h1>
					</div>
					<div className='flex md:flex-row flex-col w-4/5 justify-center items-center md:items-start space-y-4 md:space-y-0'>
						<div className="flex flex-col w-11/12 space-y-4 md:mr-2">
							<label className='mr-auto'>Date of Intimation</label>
							<input defaultValue={dayjs(claim.dateOfIntimation).format('YYYY-MM-DD')} name="dateOfIntimation" type='date' />
						</div>
					</div>

					<div id='title' className='text-2xl bg-color-turq rounded-2xl w-4/5 h-16 content-center my-6'>
						<h1 className='pl-6 text-left text-white'>Hospital Details</h1>
					</div>
					<div className='flex md:flex-row flex-col w-4/5 justify-center items-center md:items-start space-y-4 md:space-y-0'>
						<div className="flex flex-col w-11/12 space-y-4 md:mr-2">
							<label className='mr-auto'>Hospital Name</label>
							<input className='rounded-2xl border-2 border-color-turq' value={hosp.name} name='hospName' />
							<label className='mr-auto'>Hospital City</label>
							<input className='rounded-2xl border-2 border-color-turq' value={hosp.city} name='hospCity' />
						</div>
						<div className="flex flex-col w-11/12 space-y-4 md:mr-2">
							<label className='mr-auto'>Hospital Code</label>
							<div className='flex items-start'>
								<select onChange={getHosp} value={hosp.code} ref={hospCodeRef} name='hospCode' className="w-11/12 block px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white rounded-lg border-2 border-color-turq">
									{Array.from(hospCodes).map(hospCode => (<option key={hospCode} value={hospCode}>{hospCode}</option>))}
								</select>
							</div>
						</div>
					</div>
					<div className='flex space-x-5 justify-center mt-10'>
						<button onClick={submit} className='bg-color-turq hover:bg-color-blue py-2 px-4 rounded-lg text-white'>Continue</button>
						<button className='bg-red-500 hover:bg-red-700 py-2 px-4 rounded-lg text-white' onClick={handleDeleteClaim}>Delete claim</button>
					</div>
				</div>
			</form>
			<DocViewer setClaim={setClaim} editable={true} documents={Array.from(claim.documents ?? [])} claimId={claimId} />
			<div className='flex justify-center'>
				<button className='bg-color-dark hover:bg-color-blue py-2 px-4 rounded-lg text-white' onClick={() => navigate(`/view-claim/${claim.id}`)}>Back to Claim</button>
			</div>
		</div>
	</>);
};

export default EditClaim;
