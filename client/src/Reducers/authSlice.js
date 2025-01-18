import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


export const Register = createAsyncThunk('auth/Register', async (form, { rejectWithValue }) => {
    try {
        const res = await axios.post("http://localhost:8000/api/register", form)
        if (res) {
            const reslogin = await axios.post("http://localhost:8000/api/login", form)
            return reslogin.data
        }
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'เกิดข้อผิดพลาดในการลงทะเบียน')
    }
})

export const Login = createAsyncThunk('auth/Login', async (form, { rejectWithValue }) => {
    try {
        const reslogin = await axios.post("http://localhost:8000/api/login", form)
        return reslogin.data
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'เกิดข้อผิดพลาดในการล็อคอิน')
    }
})



const initialState = {
    token: null,
    user: null,
    loading: false,
    error: null,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    extraReducers: (builder) => {
        builder
            .addMatcher(
                (action) => action.type.endsWith('/pending'),
                (state) => {
                    state.loading = true
                    state.error = null
                }
            )
            .addMatcher(
                (action) => action.type.endsWith('/rejected'),
                (state, action) => {
                    state.loading = false
                    state.error = action.payload || action.error.message;
                }
            )
            .addMatcher(
                (action) => action.type.endsWith('/fulfilled'),
                (state, action) => {
                    state.loading = false
                    if (action.type.includes('Register')) {
                        state.token = action.payload.token
                        state.user = action.payload.payload
                    } else if (action.type.includes('Login')) {
                        state.token = action.payload.token
                        state.user = action.payload.payload
                    }
                }
            )
    }
})



export default authSlice.reducer;