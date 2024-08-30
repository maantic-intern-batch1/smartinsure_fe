import { configureStore } from "@reduxjs/toolkit";
import userReducer from './userSlice';
import jwt from 'jsonwebtoken'

const loadStateFromLocalStorage = () => {
    try {
        const authToken = localStorage.getItem('authToken')
        if (!authToken) return {}
        const decodedJwt = jwt.decode(authToken)
        return { user: { ...decodedJwt, authToken } }
    } catch {
        return {};
    }
};

const reduxStore = configureStore({
    reducer: {
        user: userReducer
    },
    preloadedState: loadStateFromLocalStorage()
})

export default reduxStore;
