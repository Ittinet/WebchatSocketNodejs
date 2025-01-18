import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


export const Getcurrentuser = createAsyncThunk('/user/Getcurrentuser', async (token, { rejectWithValue }) => {
    try {
        const res = await axios.get('http://localhost:8000/api/user/currentuser', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return res.data.userData
    } catch (error) {
        console.log(error)
        return rejectWithValue(error.response?.data?.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลยูสเซอร์')
    }
})

export const GetcurrentFriend = createAsyncThunk('/user/GetcurrentFriend', async (token, { rejectWithValue }) => {
    try {
        const res = await axios.get('http://localhost:8000/api/friend', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return res.data.friend
    } catch (error) {
        console.log(error)
        return rejectWithValue(error.response?.data?.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลเพื่อน')
    }
})

export const AcceptFriend = createAsyncThunk('/user/AcceptFriend', async ({ token, id }, { rejectWithValue }) => {
    try {
        const res = await axios.post(`http://localhost:8000/api/request/accept/${id}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return res.data

    } catch (error) {
        console.log(error)
        return rejectWithValue(error.response?.data?.message || 'เกิดข้อผิดพลาดในการตอบรับคำขอ')
    }
})

export const RejectFriend = createAsyncThunk('/user/RejectFriend', async ({ token, id }, { rejectWithValue }) => {
    try {
        const res = await axios.delete(`http://localhost:8000/api/request/reject/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return res.data
    } catch (error) {
        console.log(error)
        return rejectWithValue(error.response?.data?.message || 'เกิดข้อผิดพลาดในการปฎิเสธคำขอ')
    }
})


export const GetcurrentRequest = createAsyncThunk('/user/GetcurrentRequest', async (token, { rejectWithValue }) => {
    try {
        const res = await axios.get('http://localhost:8000/api/request', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return res.data.data
    } catch (error) {
        console.log(error)
        return rejectWithValue(error.response?.data?.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลคำขอเป็นเพื่อน')
    }
})



const initialState = {
    currentuser: null,
    currentFriend: [],
    currentRequest: [],
    users: [],
    loading: false,
    error: null,
}

export const userSlice = createSlice({
    name: 'user',
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
                    state.error = action.payload
                    state.loading = false
                }
            )
            .addMatcher(
                (action) => action.type.endsWith('/fulfilled'),
                (state, action) => {
                    state.loading = false
                    if (action.type.includes('/Getcurrentuser')) {
                        state.currentuser = action.payload
                    } else if (action.type.includes('/GetcurrentFriend')) {
                        state.currentFriend = action.payload
                    } else if (action.type.includes('/GetcurrentRequest')) {
                        state.currentRequest = action.payload
                    } else if (action.type.includes('/AcceptFriend')) {
                        state.currentRequest = state.currentRequest.filter((item) => item._id !== action.payload.request_id)
                    } else if (action.type.includes('/RejectFriend')) {
                        state.currentRequest = state.currentRequest.filter((item) => item._id !== action.payload.request_id)
                    }
                }
            )
    }

})

export default userSlice.reducer;

