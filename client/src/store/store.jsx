import axios from "axios"
import { toast } from "react-toastify"
import { create } from "zustand"
import { persist, createJSONStorage } from 'zustand/middleware'

const chatappStore = (set) => ({
    token: null,
    payload: null,
    LoginApi: async (loginForm) => {
        try {
            const res = await axios.post('http://localhost:8000/api/login', loginForm)
            if (res.data.message === 'กรุณาใส่ข้อมูลให้ครบ') {
                throw new Error(res.data.message)

            }
            if (res.data.message === 'เข้าสู่ระบบสำเร็จ') {
                toast.success(res.data.message)
                set({
                    token: res.data.token,
                    payload: res.data.payload
                })
                return {
                    status: 'ok'
                }
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
            return {
                status: 'cancle'
            }
        }

    },
    RegisterApi: async (RegisterForm) => {
        try {
            const res = await axios.post('http://localhost:8000/api/register', RegisterForm)
            if (res.data.message === 'กรุณาใส่ข้อมูลให้ครบ') {
                toast.error(res.data.message)
                return
            }
            if (res.data.message === 'สมัครสมาชิกสำเร็จ!') {
                toast.success(res.data.message)
                console.log(res)
                return {
                    status: 'ok'
                }
            } else {
                throw new Error(res.data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
            return {
                status: 'cancle'
            }

        }
    }

})



const usePersist = {
    name: 'chat-app',
    storage: createJSONStorage(() => localStorage)
}

const useChatStore = create(persist(chatappStore, usePersist))

export default useChatStore;