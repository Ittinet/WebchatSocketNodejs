import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const GetPost = createAsyncThunk('post/GetPost', async (token, { rejectWithValue }) => {
    try {
        const res = await axios.get(`http://localhost:8000/api/post`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return {
            data: res.data.postData
        }
    } catch (error) {
        console.log(error)
        return rejectWithValue(error.response?.data?.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลโพส')
    }
})



const initialState = {
    postdata: [],
    loading: false,
    error: null
}

export const postSlice = createSlice({
    name: 'post',
    initialState: initialState,
    reducers: {
        UpdatePost: (state, action) => {
            state.postdata = [action.payload, ...state.postdata]
        },
        UpdateComment: (state, action) => {
            state.postdata = state.postdata.map((item) => {
                if (item._id === action.payload.postid) {
                    return { ...item, comments: [...item.comments, action.payload.data] }
                } else {
                    return item
                }
            })
        },
        UpdateLike: (state, action) => {
            state.postdata = state.postdata.map((item) => {
                if (item._id === action.payload.postid) {
                    return { ...item, likes: [...item.likes, { user: action.payload.currentuser, type: 'like' }] }
                }
                return item
            })
        },
        RemoveLike: (state, action) => {
            state.postdata = state.postdata.map((item) => {
                if (item._id === action.payload.postid) {
                    return { ...item, likes: item.likes.filter(item => item.user._id !== action.payload.currentid) }
                }
                return item
            })
        }
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                (action) => action.type.endsWith('/pending'),
                (state, action) => {
                    state.loading = true
                    state.error = null
                }
            )
            .addMatcher(
                (action) => action.type.endsWith('/rejected'),
                (state, action) => {
                    state.loading = false
                    state.error = action.payload
                }
            )
            .addMatcher(
                (action) => action.type.endsWith('/fulfilled'),
                (state, action) => {
                    state.loading = false
                    if (action.type.includes('/GetPost')) {
                        state.postdata = action.payload.data
                    }
                }
            )
    }
})

export const { UpdatePost, UpdateComment, UpdateLike, RemoveLike } = postSlice.actions

export default postSlice.reducer;