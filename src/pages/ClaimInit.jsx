import axios from '../utils/axiosConf';
import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLoaderData, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { v4 as uuid } from 'uuid'

const ClaimInit = () => {
	const formRef = useRef()
	const { hospCodes, policyIds } = useLoaderData()
	const policyIdRef = useRef()
	const hospCodeRef = useRef()
	const navigate = useNavigate()
	const userState = useSelector(state => state.user)
	const [loading, setLoading] = useState(false)
	const [policy, setPolicy] = useState({
		coverageStartDate: '--',
		patientDob: '--',
		patientName: '--',
		policyId: '--'
	})
	const [hosp, setHosp] = useState({
		name: '--',
		city: '--',
		code: '--',
	})

	if (!userState.authToken) {
		return <Navigate to='/login' />
	}

	const headers = {
		headers: {
			Authorization: `Bearer ${userState.authToken}`
		}
	}

	async function submit(event) {
		event.preventDefault();
		const formData = new FormData(formRef.current);
		formData.append('policyId', policy.id)
		const data = Object.fromEntries(formData)
		data.claimAmount = +data.claimAmount
		data.dateOfAdmission = dayjs(data.dateOfAdmission).format('YYYY-MM-DD')
		data.dateOfIntimation = dayjs(data.dateOfIntimation).format('YYYY-MM-DD')
		setLoading(true)
		const res = await axios.post(`${process.env.REACT_APP_BACKEND_DOMAIN}/claim/new`, data, headers)
		setLoading(false)
		if (res.data.err) {
			alert(res.data.err)
			return
		}
		return navigate(`/upload-docs/${res.data.msg.split(': ')[1]}`)
	};

	async function getPolicy() {
		if(policyIds[0] === '--') {
			policyIds.shift()
		}
		const enteredPolicyId = policyIdRef.current.value
		setLoading(true)
		const res = await axios.get(`${process.env.REACT_APP_BACKEND_DOMAIN}/policy/${enteredPolicyId}`, headers)
		setLoading(false)
		if (res.data.err) {
			alert(res.data.err)
			return
		}
		setPolicy({ ...res.data.msg })
	}

	async function getHosp() {
		if(hospCodes[0] === '--') {
			hospCodes.shift()
		}
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

	return (<>
		{loading && (
			<div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
				<div className="text-xl font-semibold text-gray-700">
					Loading...
				</div>
			</div>
		)}
		<div className={`${loading && 'pointer-events-none'}`}>
			<form ref={formRef}>
				<div className='flex flex-col items-center'>
					<div id='title' className='text-2xl bg-color-turq rounded-2xl w-4/5 h-16 content-center my-6'>
						<h1 className='pl-6 text-left text-white'>Claim Initiation</h1>
					</div>
					<div className='flex md:flex-row flex-col w-4/5 justify-center items-center md:items-start space-y-4 md:space-y-0'>
						<div className="flex flex-col w-11/12 space-y-4 md:mr-2">
							<label className='mr-auto'>Date of Admission</label>
							<input name="dateOfAdmission" type='date' />
							<label className='mr-auto'>Claim title</label>
							<input name="title" type='text' />
							<label className='mr-auto'>Claim Description</label>
							<textarea name="desc" />
						</div>
						<div className="flex flex-col w-11/12 space-y-4 md:mr-2">
							<label className='mr-auto'>Claim Amount</label>
							<input name="claimAmount" type='number' />
							<label className='mr-auto'>Claim Category Type</label>
							<select name='claimType' className="block px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white rounded-lg border-2 border-color-turq">
								<option value="Cashless">Cashless</option>
								<option value="Reimbursement">Reimbursement</option>
							</select>
						</div>
					</div>

					<div id='title' className='text-2xl bg-color-turq rounded-2xl w-4/5 h-16 content-center my-6'>
						<h1 className='pl-6 text-left text-white'>Patient Details</h1>
					</div>
					<div className='flex md:flex-row flex-col w-4/5 justify-center items-center md:items-start space-y-4 md:space-y-0'>
						<div className="flex flex-col w-11/12 space-y-4 md:mr-2">
							<label className='mr-auto'>Policy Number</label>
							<div className='flex items-start'>
								<select onChange={getPolicy} value={policy.id} ref={policyIdRef} name='policyId' className="w-11/12 block px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white rounded-lg border-2 border-color-turq">
									{Array.from(policyIds).map(policyId => (<option key={uuid()} value={policyId}>{policyId}</option>))}
								</select>
							</div>
							<label className='mr-auto'>Date of Birth</label>
							<p className='rounded-2xl border-2 border-color-turq'>{policy.patientDob}</p>
							<label className='mr-auto'>Date of Intimation</label>
							<input name="dateOfIntimation" type='date' />
						</div>
						<div className="flex flex-col w-11/12 space-y-4 md:mr-2">
							<label className='mr-auto'>Patient Name</label>
							<p className='rounded-2xl border-2 border-color-turq'>{policy.patientName}</p>
							<label className='mr-auto'>Coverage Start Date</label>
							<p className='rounded-2xl border-2 border-color-turq'>{policy.coverageStartDate}</p>

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
					<div onClick={submit} className='bg-color-turq cursor-pointer inline-block text-white p-4 rounded-lg mt-5 hover:bg-color-blue'>Continue</div>
				</div>
			</form>
		</div>
	</>);
};

export default ClaimInit;
