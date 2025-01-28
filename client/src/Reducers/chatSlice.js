import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"


// export const Addchat = createAsyncThunk('chat/Addchat', (chatData, { rejectWithValue }) => {
//     try {
//         console.log('test')
//     } catch (error) {
//         console.log(error)
//         return rejectWithValue(error.response?.data?.message || 'เกิดข้อผิดพลาดบางอย่างในจัดการช่องแชท')
//     }
// })

const initialState = {
    activeChats: [],
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
        }
    },
    // extraReducers: (builder) => {
    //     builder
    //         .addMatcher(
    //             (action) => action.type.endsWith('/pending'),
    //             (state, action) => {
    //                 state.loading = true
    //                 state.error = null
    //             }
    //         )
    //         .addMatcher(
    //             (action) => action.type.endsWith('/rejected'),
    //             (state, action) => {
    //                 state.loading = false
    //                 state.error = action.payload
    //             }
    //         )
    //         .addMatcher(
    //             (action) => action.type.endsWith('/fulfilled'),
    //             (state, action) => {
    //                 state.loading = false
    //                 if (action.type.includes('/Addchat')) {
    //                     state.activeChats = action.payload
    //                 }
    //             }
    //         )
    // }

})

export const { AddChat, UpdateChatIsOnline, UpdateChatIsOffline, ExistChat } = chatSlice.actions;
export default chatSlice.reducer;