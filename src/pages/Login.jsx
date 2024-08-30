/* eslint-disable react-hooks/rules-of-hooks */
import axios from '../utils/axiosConf';
import React, { useRef } from 'react'
import { useDispatch } from 'react-redux';
import { addUser } from '../store/userSlice';
import jwt from 'jsonwebtoken';
import { useNavigate } from 'react-router-dom';

function Login() {
    const formRef = useRef()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(formRef.current);
        const data = Object.fromEntries(formData)
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_DOMAIN}/auth/login`, data)
        if (res.data.err) {
            alert(res.data.err)
            return
        }
        const authToken = res.data.authToken
        const decodedJwt = jwt.decode(authToken)
        localStorage.setItem('authToken', authToken)
        dispatch(addUser({ ...decodedJwt, authToken }))
        return navigate('/')
    };

    return (
        <div className='flex justify-center w-100 mt-6'>
            <form ref={formRef} onSubmit={handleSubmit} className="bg-color-turq shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
                <p className='block text-white text-lg'>Please enter your email and password below</p>
                <div className="my-4">
                    <label className="block text-white mb-2" htmlFor="email">Email</label>
                    <input
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="email"
                        type="email"
                        placeholder='email'
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-white mb-2" htmlFor="password">Password</label>
                    <input
                        className="shadow  border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="password"
                        type="password"
                        placeholder='password'
                    />
                </div>
                <div className="flex items-center justify-center">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit">
                        Sign In
                    </button>
                </div>

               
            </form>
        </div>
    )
}

export default Login
