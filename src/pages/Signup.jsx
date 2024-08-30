import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../utils/axiosConf'
import { useDispatch } from 'react-redux'
import jwt from 'jsonwebtoken'
import { addUser } from '../store/userSlice'

const Signup = () => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const formRef = useRef()
    const navigate = useNavigate()

    function isValidEmail(email) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    }


    async function handleSubmit(e) {
        e.preventDefault()
        const formData = new FormData(formRef.current)
        const data = Object.fromEntries(formData)
        setLoading(true)
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_DOMAIN}/auth/signup`, data)
        setLoading(false)
        if (res.data.err) return alert(res.data.err)
        const authToken = res.data.authToken
        const decodedJwt = jwt.decode(authToken)
        localStorage.setItem('authToken', authToken)
        dispatch(addUser({ ...decodedJwt, authToken }))
        return navigate('/')
    }

    async function handleSendOtp() {
        const formData = new FormData(formRef.current)
        const data = Object.fromEntries(formData)
        const enteredEmail = data.email
        if (isValidEmail(enteredEmail)) {
            setLoading(true)
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_DOMAIN}/auth/send-otp/${enteredEmail}`)
            setLoading(false)
            if (res.data.err) return alert(res.data.err)
            return alert(`${res.data.msg} to ${res.data.email}`)
        } else {
            alert('Enter valid email first')
        }
    }

    return (<>
        {loading && (
            <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
                <div className="text-xl font-semibold text-gray-700">
                    Loading...
                </div>
            </div>
        )}
        <div className={`${loading && 'pointer-events-none'} `}>
            <div className='flex justify-center'>
            <div className='my-10 flex flex-col items-center border-2 border-color-turq bg-color-turq bg-opacity-30 p-10 rounded-lg'>
                <form ref={formRef} onSubmit={handleSubmit} className='flex flex-col'>
                    <label htmlFor="email">Email</label>
                    <input className='h-10 mb-5 bord' type="email" name='email' />
                    <label htmlFor="password">Password</label>
                    <input className='h-10 mb-5' type="password" name='password' />
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input className='h-10 mb-5' type="password" name='confirmPassword' />
                    <label htmlFor="firstName">First Name</label>
                    <input className='h-10 mb-5' type="text" name='firstName' />
                    <label htmlFor="lastName">Last Name</label>
                    <input className='h-10 mb-5' type="text" name='lastName' />
                    <label htmlFor="dob">Date of birth</label>
                    <input className='h-10 mb-5' type="date" name='dob' />
                    <label htmlFor="address">Address</label>
                    <input className='h-10 mb-5' type="text" name='address' />
                    <label htmlFor="phone">Phone number</label>
                    <input className='h-10 mb-5' type="tel" pattern="[0-9]{10}" name='phone' />
                    <div >
                        <div>
                            <label htmlFor="otp">OTP (Enter the most recent one received)</label>
                            <input className='h-10' type="number" name='otp' />
                        </div>
                        <button onClick={handleSendOtp} className='flex py-1 px-2 bg-color-dark text-white hover:bg-color-blue rounded-lg items-center mt-2'>Send otp</button>
                    </div>
                    <button className='mt-10 block rounded-md m-3 p-3 text-white font-semibold bg-color-dark' type="submit">Create new account</button>
                </form>
            </div>
            </div>
        </div>
    </>)
}

export default Signup