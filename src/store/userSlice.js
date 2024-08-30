import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    authToken: '',
    role: '',
    userId: ''
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        addUser(state, action) {
            state.authToken = action.payload.authToken
            state.role = action.payload.role
            state.userId = action.payload.userId
        },
        removeUser(state, action) {
            return initialState
        },
    }
})

export const { addUser, removeUser } = userSlice.actions
export default userSlice.reducer
