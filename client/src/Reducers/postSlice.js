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

export const GetNotify = createAsyncThunk('post/GetNotify', async (token, { rejectWithValue }) => {
    try {
        const res = await axios.get('http://localhost:8000/api/notify', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        console.log(res.data.NotifyData)
        return {
            data: res.data.NotifyData
        }

    } catch (error) {
        console.log(error)
        return rejectWithValue(error.response?.data?.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลแจ้งเตือน')
    }
})





const initialState = {
    postdata: [],
    notifydata: [],
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
        DeletePost: (state, action) => {
            state.postdata = state.postdata.filter((item) => item._id !== action.payload)
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
        },
        UpdatePostNotify: (state, action) => {
            state.notifydata = [action.payload, ...state.notifydata]
        },
        UpdateLikeNotify: (state, action) => {
            const checkalreadyNotify = state.notifydata.find((item) => item._id === action.payload._id)
            if (!checkalreadyNotify) {
                state.notifydata = [action.payload, ...state.notifydata]
            } else {
                state.notifydata = state.notifydata.map((item) => {
                    if (item._id === action.payload._id) {
                        return action.payload
                    } else {
                        return item
                    }
                })
            }
            state.notifydata = [...state.notifydata].sort((a, b) => new Date(b.createAt) - new Date(a.createAt))

        },
        UpdateUnlinkeNotify: (state, action) => {
            state.notifydata = state.notifydata.map((item) => {
                if ((item.type === 'like' && item.content._id === action.payload.postdata._id)) {
                    return { ...item, content: { ...item.content, likes: item.content.likes.filter((item) => item.user._id !== action.payload.userlikedId) } }
                } else {
                    return item
                }
            })
        },
        ReadNotify: (state, action) => {
            state.notifydata = state.notifydata.map((item) => ({ ...item, readByReceiver: true }))
        },
        UpdateAcceptFriendNotify: (state, action) => {
            state.notifydata = [action.payload, ...state.notifydata]
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
                    else if (action.type.includes('/GetNotify')) {
                        state.notifydata = action.payload.data
                    }
                }
            )
    }
})

export const { UpdatePost, UpdateComment, UpdateLike, RemoveLike, UpdatePostNotify, UpdateLikeNotify, UpdateUnlinkeNotify, ReadNotify, DeletePost, UpdateAcceptFriendNotify } = postSlice.actions

export default postSlice.reducer;