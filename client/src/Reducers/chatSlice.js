import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

export const GetLastMessage = createAsyncThunk('chat/GetLastMessage', async (token, { rejectWithValue }) => {
    try {
        const res = await axios.get('http://localhost:8000/api/message', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return res.data.LastMessages
    } catch (error) {
        console.log(error)
        return rejectWithValue(error.response?.data?.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลแชทล่าสุด')
    }
})

export const ReadMessage = createAsyncThunk('chat/ReadMessage', async ({ token, targetuser }, { rejectWithValue }) => {
    try {
        const res = await axios.patch(`http://localhost:8000/api/message/read/${targetuser}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        console.log(res.data)
        return {
            data: res.data.message,
            targetuser: targetuser
        }
    } catch (error) {
        console.log(error)
        return rejectWithValue(error.response?.data?.message || 'เกิดข้อผิดพลาดในการอัพเดทการอ่านแชท')
    }
})

const initialState = {
    activeChats: [],
    MessageData: [],
    LastMessage: [],
    loading: false,
    error: null,
}

export const chatSlice = createSlice({
    name: 'chat',
    initialState: initialState,
    reducers: {
        AddChat: (state, action) => {
            const userData = action.payload
            if (state.activeChats.length === 0) {
                state.activeChats = [...state.activeChats, userData]
            } else {
                const isChatExist = state.activeChats.some(chat => chat._id === userData._id)
                if (!isChatExist) {
                    state.activeChats = [...state.activeChats, userData]
                }
            }
        },
        UpdateChatIsOnline: (state, action) => {
            const { userid, socketid } = action.payload
            state.activeChats = state.activeChats.map((item) => item._id === userid
                ? {
                    ...item,
                    status: 'online',
                    socketId: socketid,
                    last_active: null
                }
                : item)
        },
        UpdateChatIsOffline: (state, action) => {
            const { userid, socketid } = action.payload
            state.activeChats = state.activeChats.map((item) => item._id === userid
                ? {
                    ...item,
                    status: 'offline',
                    socketId: null,
                    last_active: new Date().toISOString()
                }
                : item)
        },
        ExistChat: (state, action) => {
            const userid = action.payload
            state.activeChats = state.activeChats.filter((item) => item._id !== userid)
        },
        UpdateLastMessage: (state, action) => {
            state.LastMessage = state.LastMessage.map((item) => {
                if (item.messages.targetuser._id === action.payload.sender._id) {
                    return {
                        ...item, messages: {
                            ...item.messages,
                            sender: action.payload.sender,
                            receiver: action.payload.receiver,
                            messageContent: action.payload.messageContent,
                            createAt: action.payload.createAt,
                            readByReceiver: action.payload.readByReceiver
                        }
                    }
                } else if (item.messages.targetuser._id === action.payload.receiver._id) {
                    return {
                        ...item, messages: {
                            ...item.messages,
                            sender: action.payload.sender,
                            receiver: action.payload.receiver,
                            messageContent: action.payload.messageContent,
                            createAt: action.payload.createAt,
                            readByReceiver: action.payload.readByReceiver
                        }
                    }
                } else {
                    return item
                }
            })
        },
        UpdateReadByReceiver: (state, action) => {
            state.LastMessage = state.LastMessage.map((item) => {
                if (item.messages._id === action.payload && !item.messages.readByReceiver) {
                    return { ...item, messages: { ...item.messages, readByReceiver: true } }
                } else {
                    return item
                }
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
                    if (action.type.includes('/GetLastMessage')) {
                        state.LastMessage = action.payload
                    } else if (action.type.includes('/ReadMessage')) {
                        state.LastMessage = state.LastMessage.map((item) => {
                            if (item.messages.targetuser._id === action.payload.targetuser) {
                                return { ...item, messages: { ...item.messages, readByReceiver: true } }
                            }
                            console.log(action.payload)
                            return item

                        })


                    }
                }
            )
    }

})

export const { AddChat, UpdateChatIsOnline, UpdateChatIsOffline, ExistChat, UpdateLastMessage, UpdateReadByReceiver } = chatSlice.actions;
export default chatSlice.reducer;